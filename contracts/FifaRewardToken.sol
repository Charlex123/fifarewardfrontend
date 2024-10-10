// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

interface IPancakeRouter02 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

interface IPancakeFactory {
    function createPair(address tokenA, address tokenB) external returns (address pair);
}

contract FifaRewardToken is ERC20, ERC20Burnable, Ownable {
    using SafeMath for uint256;
    using Address for address;
    using EnumerableSet for EnumerableSet.AddressSet;

    EnumerableSet.AddressSet private dexPools;
    mapping(address => bool) private _isExcludedFromFee;

    uint256 public buyFeePercent = 2; // 2 percent 
    uint256 public sellFeePercent = 4; // 4 percent
    uint256 public transferFeePercent = 4; // 4 percent

    uint256 public maxTxAmount = 4000000 * 10**18;
    uint256 public maxWAmount = 4000000 * 10**18;
    uint256 public maxSupply = 1000000000 * 10**18;

    address payable private marketingWalletAddress;
    address payable private liquidityWalletAddress;
    address payable private stakingWalletAddress;
    address payable private nftWalletAddress;

    mapping(address => bool) public isFeeExempt;
    mapping(address => bool) public isTxLimitExempt;

    IPancakeRouter02 public pancakeswapV2Router;
    address public pancakeswapPair;
    address private immutable WETH;

    address public feeAddress = 0x334364043B0AD2d1e487bf3EE25Fa7F42D125892;

    constructor() ERC20("FIFAReward", "FRD") Ownable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4) {
        
        address admin = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
        transferOwnership(admin);

        IPancakeRouter02 _pancakeswapV2Router = IPancakeRouter02(0x9A082015c919AD0E47861e5Db9A1c7070E81A2C7);
        WETH = _pancakeswapV2Router.WETH();
        pancakeswapPair = IPancakeFactory(_pancakeswapV2Router.factory()).createPair(address(this), WETH);
        pancakeswapV2Router = _pancakeswapV2Router;

        isFeeExempt[address(0)] = true;
        isTxLimitExempt[address(0)] = true;
        isFeeExempt[address(this)] = true;
        isTxLimitExempt[address(this)] = true;
        isFeeExempt[msg.sender] = true;
        isTxLimitExempt[msg.sender] = true;

        _mint(msg.sender, 100_000_000 ether);
    }

    function updateFees(
        uint256 _buyFee,
        uint256 _sellFee,
        uint256 _transferFee
    ) external onlyOwner {
        buyFeePercent = _buyFee;
        sellFeePercent = _sellFee;
        transferFeePercent = _transferFee;
    }

    function setMaxTxAmount(uint256 _maxTxAmount) external onlyOwner {
        maxTxAmount = _maxTxAmount;
    }

    function setLW(address lw) external onlyOwner {
        liquidityWalletAddress = payable(lw);
    }

    function setMW(address mw) external onlyOwner {
        marketingWalletAddress = payable(mw);
    }

    function setSW(address sw) external onlyOwner {
        stakingWalletAddress = payable(sw);
    }

    function setNW(address nw) external onlyOwner {
        nftWalletAddress = payable(nw);
    }

    function getNW() external view onlyOwner returns (address) {
        return nftWalletAddress;
    }

    function getLW() external view onlyOwner returns (address) {
        return liquidityWalletAddress;
    }

    function getMW() external view onlyOwner returns (address) {
        return marketingWalletAddress;
    }

    function getSW() external view onlyOwner returns (address) {
        return stakingWalletAddress;
    }

    function addDexPool(address dexPool) external onlyOwner {
        dexPools.add(dexPool);
    }

    function removeDexPool(address dexPool) external onlyOwner {
        dexPools.remove(dexPool);
    }

    function exemptFee(address user, bool exempt) external onlyOwner {
        isFeeExempt[user] = exempt;
        isTxLimitExempt[user] = exempt;
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(
            amount <= maxTxAmount || isTxLimitExempt[to] || isTxLimitExempt[from],
            "TX Limit Exceeded"
        );

        if (isFeeExempt[from] || isFeeExempt[to]) {
            super._transfer(from, to, amount);
            return;
        }

        (uint256 recipientAmount, uint256 fee) = _calculateFee(from, to, amount);

        uint256 contractTokenBalance = balanceOf(address(this));
        bool overMinTokenBalance = contractTokenBalance >= fee;
        if (overMinTokenBalance && !dexPools.contains(from) && from != owner()) {
            swapTokensForBNB(fee);
        }

        uint256 liquidityFee = fee.mul(15).div(100);
        uint256 marketingFee = fee.mul(60).div(100);
        uint256 stakingFee = fee.mul(15).div(100);
        uint256 nftFee = fee.mul(10).div(100);

        payable(liquidityWalletAddress).transfer(liquidityFee);
        payable(marketingWalletAddress).transfer(marketingFee);
        payable(stakingWalletAddress).transfer(stakingFee);
        payable(nftWalletAddress).transfer(nftFee);

        super._transfer(from, to, recipientAmount);
    }

    function _calculateFee(
        address _from,
        address _to,
        uint256 _amount
    ) internal view returns (uint256 amount, uint256 fee) {
        bool isSell = dexPools.contains(_to);
        bool isBuy = dexPools.contains(_from);
        uint256 feePercent;

        if (isBuy) {
            feePercent = buyFeePercent;
        } else if (isSell) {
            feePercent = sellFeePercent;
        } else {
            feePercent = transferFeePercent;
        }

        fee = _amount.mul(feePercent).div(100);
        amount = _amount.sub(fee);
    }

    function swapTokensForBNB(uint256 tokenAmount) private {
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = WETH;

        _approve(address(this), address(pancakeswapV2Router), tokenAmount);

        pancakeswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // Accept any amount of BNB
            path,
            address(this),
            block.timestamp
        );
    }

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) external onlyOwner {
        _approve(address(this), address(pancakeswapV2Router), tokenAmount);

        pancakeswapV2Router.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0,
            0,
            owner(),
            block.timestamp
        );
    }

    receive() external payable {}
}
