// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

error TAFA__NotOwner();
error TAFA__PresaleNotOpen();
error TAFA__PresalePriceNotSet();
error TAFA__PresaleDenominatorNotSet();

interface IBEP20 {
    function transfer(address _to, uint256 _value) external returns (bool);
}

contract TAFA is ERC20 {
    enum PresaleStatus {
        Close,
        Open
    }
    PresaleStatus private status;
    address private s_owner;
    uint256 private s_presalePrice;
    uint256 private s_denominator;
    event OwnerSet(address indexed oldOwner, address indexed newOwner);
    event PresaleSet(
        address indexed setter,
        uint256 price,
        uint256 denominator
    );
    event ValueReceived(address indexed sender, uint256 value);
    modifier isOwner() {
        if (msg.sender != s_owner) {
            revert TAFA__NotOwner();
        }
        _;
    }
    modifier isPresaleOn() {
        if (status != PresaleStatus.Open) {
            revert TAFA__PresaleNotOpen();
        }
        if (s_presalePrice <= 0) {
            revert TAFA__PresalePriceNotSet();
        }
        if (s_denominator <= 0) {
            revert TAFA__PresaleDenominatorNotSet();
        }
        _;
    }
  /* solhint-disable */
    constructor(
        uint256 initialSupply,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
        s_owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
        emit OwnerSet(address(0), s_owner);
    }
 /* solhint-enable */
    receive() external payable {
        emit ValueReceived(msg.sender, msg.value);
    }

    fallback() external payable {
        emit ValueReceived(msg.sender, msg.value);
    }

    function sendToken(
        address _to,
        address _ca,
        uint256 _amount
    ) external isOwner {
        IBEP20 token = IBEP20(_ca);
        token.transfer(_to, _amount);
    }

    function setPresaleStatus(
        PresaleStatus _status,
        uint256 _presalePrice,
        uint256 _denominator
    ) public isOwner {
        status = _status;
        s_presalePrice = _presalePrice;
        s_denominator = _denominator;
        emit PresaleSet(msg.sender, _presalePrice, _denominator);
    }

    function buyTokenPresale(address _to, uint256 _amount)
        public
        isOwner
        isPresaleOn
        returns (bool)
    {
        uint256 _tokens = (_amount * s_denominator) / s_presalePrice;
        address owner = _msgSender();
        _transfer(owner, _to, _tokens);
        return true;
    }

    function changeOwner(address newOwner) public isOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnerSet(s_owner, newOwner);
        s_owner = newOwner;
    }
function renounceOwnership() public virtual isOwner {
        emit OwnerSet(s_owner, address(0));
        s_owner = address(0);
    }
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getPresaleStatus() public view returns (PresaleStatus) {
        return status;
    }

    function getPresalePrice() external view returns (uint256) {
        return s_presalePrice;
    }

    function getDenominator() external view returns (uint256) {
        return s_denominator;
    }

    function withdrawBnb() external isOwner {
        payable(msg.sender).transfer(getBalance());
    }

    function getOwner() external view returns (address) {
        return s_owner;
    }
}