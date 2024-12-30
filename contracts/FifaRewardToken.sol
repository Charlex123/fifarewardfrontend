// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@unistakingwalletaddressp/v2-core/contracts/interfaces/IUnistakingwalletaddresspV2Fact Router02.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract FifaRewardToken is ERC20Burnable, Ownable {
    using SafeMath for uint256;
    using Address for address;
    using EnumerableSet for EnumerableSet.AddressSet;
    mapping(address => bool) private _isExcludedFromFee;
    EnumerableSet.AddressSet dexPools;
    
    uint256 public buyFeePercent = 2; // 2 percent 
    uint256 public sellFeePercent = 4; // 4 percent
    uint256 public transferFeePercent = 2; // 4 percent

    uint256 public maxTxAmount = 4000000 * 10**18;
    uint256 public maxWAmount = 4000000 * 10**18;
    uint256 public maxSupply = 1000000000 * 10**18;

    address payable private marketingwalletaddress = payable(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2);
    address payable private liquiditywalletaddress = payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db);
    address payable private stakingwalletaddress = payable(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2);
    address payable private nftwalletaddress = payable(0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB);
    // address public feeAddress = 0x334364043B0AD2d1e487bf3EE25Fa7F42D125892;
    mapping(address => bool) isFeeExempt;
    mapping(address => bool) isTxLimitExempt;

    constructor() ERC20("FIFAReward", "FRD") Ownable(msg.sender) {
        address admin = msg.sender;
        transferOwnership(admin);
        isFeeExempt[address(0)] = true ;
        isTxLimitExempt[address(0)] = true;

        isFeeExempt[address(this)] = true;
        isTxLimitExempt[address(this)] = true;

        isTxLimitExempt[admin] = true;
        isFeeExempt[admin] = true;
        _mint(admin, 1000_000_000 ether);
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
        liquiditywalletaddress = payable(lw);
    }

    function setMW(address mw) external onlyOwner {
        marketingwalletaddress = payable(mw);
    }

    function setSW(address sw) external onlyOwner {
        stakingwalletaddress = payable(sw);
    }

    function setNW(address nw) external onlyOwner {
        nftwalletaddress = payable(nw);
    }

    function getNW() external onlyOwner view returns (address){
        return nftwalletaddress;
    }

    function getLW() external onlyOwner view returns (address){
        return liquiditywalletaddress;
    }

    function getMW() external onlyOwner view returns (address){
        return marketingwalletaddress;
    }

    function getSW() external onlyOwner view returns (address){
        return stakingwalletaddress;
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
        require(
            amount <= maxTxAmount || isTxLimitExempt[to] || isTxLimitExempt[from],
            "TX Limit Exceeded"
        );
        if (isFeeExempt[from] || isFeeExempt[to])
            return super._update(from, to, amount);
        (uint256 recipientAmount, uint256 fee) = __getFee(from, to, amount);

        if (isFeeExempt[from] || isFeeExempt[to]) {
            super._transfer(from, to, amount);
            return;
        }

        uint256 liquidityFee = fee.mul(15).div(100);
        uint256 marketingFee = fee.mul(60).div(100);
        uint256 stakingFee = fee.mul(15).div(100);
        uint256 nftFee = fee.mul(10).div(100);

        super._update(from, to, recipientAmount);
        super._update(from, liquiditywalletaddress, liquidityFee);
        super._update(from, marketingwalletaddress, marketingFee);
        super._update(from, stakingwalletaddress, stakingFee);
        super._update(from, nftwalletaddress, nftFee);
    }

    function __getFee(
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

    receive() external payable {}
}