// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "uniswap-v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract FifaRewardToken is ERC20Burnable, Ownable {
    using SafeMath for uint256;
    using Address for address;
    using EnumerableSet for EnumerableSet.AddressSet;
    mapping(address => bool) private _isExcludedFromFee;
    EnumerableSet.AddressSet dexPools;
    uint256 public buyFee = 2.5 ether;
    uint256 public sellFee = 8 ether;
    uint256 public transferFee = 8 ether;
    uint256 public maxTxAmount = 100_000 ether;
    address public feeAddress = 0x334364043B0AD2d1e487bf3EE25Fa7F42D125892;
    mapping(address => bool) isFeeExempt;
    mapping(address => bool) isTxLimitExempt;

    constructor() ERC20("FIFAReward", "FRD") Ownable(0xa7c575897e0DC6005e9a24A15067b201a033c453) {
        address admin = 0xa7c575897e0DC6005e9a24A15067b201a033c453;
        transferOwnership(admin);
        isFeeExempt[address(0)] = true ;
        isTxLimitExempt[address(0)] = true;

        isFeeExempt[address(this)] = true;
        isTxLimitExempt[address(this)] = true;

        isTxLimitExempt[admin] = true;
        isFeeExempt[admin] = true;
        _mint(admin, 100_000_000 ether);
    }

    function updateFees(
        uint256 _buyFee,
        uint256 _sellFee,
        uint256 _transferFee
    ) external onlyOwner {
        buyFee = _buyFee;
        sellFee = _sellFee;
        transferFee = _transferFee;
    }

    function setMaxTxAmount(uint256 _maxTxAmount) external onlyOwner {
        maxTxAmount = _maxTxAmount;
    }

    function addDexPool(address dexPool) external onlyOwner {
        dexPools.add(dexPool);
    }

    function exemptFee(address user, bool exempt) external onlyOwner {
        isFeeExempt[user] = exempt;
        isTxLimitExempt[user] = exempt;
    }

    function removeDexPool(address dexPool) external onlyOwner {
        dexPools.remove(dexPool);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal view {
        require(
            amount <= maxTxAmount ||
                isTxLimitExempt[to] ||
                isTxLimitExempt[from],
            "TX Limit Exceeded"
        );
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (isFeeExempt[from] || isFeeExempt[to])
            return super._update(from, to, amount);
        (uint256 recipientAmount, uint256 fee) = __getFee(from, to, amount);
        super._update(from, to, recipientAmount);
        super._update(from, feeAddress, fee);
    }

    function __getFee(
        address _from,
        address _to,
        uint256 _amount
    ) internal view returns (uint256 amount, uint256 fee) {
        bool isSell = dexPools.contains(_to);
        bool isBuy = dexPools.contains(_from);
        if (isBuy) {
            //BUY TAX
            fee = Math.mulDiv(buyFee, _amount, 100 ether);
        } else if (isSell) {
            //SELL TAX
            fee = Math.mulDiv(sellFee, _amount, 100 ether);
        } else {
            //Transfer TAX -
            fee = Math.mulDiv(transferFee, _amount, 100 ether);
        }
        amount = _amount.sub(fee);
    }
}