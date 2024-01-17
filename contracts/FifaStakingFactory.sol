// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./IFifaStaking.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract FifaStakingFactory is Context {
    using SafeMath for uint256;
    using Address for address payable;
    using Address for address;
    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet deployed;
    mapping(address => string) public names;
    address public implementation;
    address public token;
    address owner = 0x9C9DfBbaa6f14e5B142365df89b8e2B627dd1bda;
    event StakingCreated(address indexed creator, address indexed stake);
    event CLONE(address clone, string name, uint256 timestamp);
    uint256 maxpools = 0;
    error ImplemationMustBeAContract();

    /**
     * Initializes the factory;
     * @param _implementation The deployed presale contract implementaion.
     */
    constructor(address _implementation, address _token) {
        if (!_implementation.isContract()) revert ImplemationMustBeAContract();
        implementation = _implementation;
        token = _token;
 
    }

    /**
     * @notice Creates a new Presale contract and registers it in the PresaleFactory.sol.
     * @param _fees IStaking.FEES struct
     */

    function createStaking(IFifaStaking.FEES memory _fees, string calldata name)
        public
        payable
    {
        require(maxpools < 36, "Only 32 Pools available");
        maxpools++;
        address clone = Clones.clone(implementation);
        IFifaStaking staking = IFifaStaking(clone);
        staking.initialize(owner, token, name, _fees);
        deployed.add(clone);
        names[clone] = name;
        emit CLONE(clone, name, block.timestamp);
    }
    /**
     * view functions
     */
    struct Cloned {
        address clone;
        string name;
    }

    function length()external view returns(uint256){
        return deployed.length();
    }

    function at(uint256 index)external view returns(address){
        return deployed.at(index);
    }

    function all() external view returns (Cloned[] memory) {
        Cloned[] memory list = new Cloned[](deployed.length());
        for (uint256 i = 0; i < deployed.length(); i++) {
            address _at = deployed.at(i);
            list[i] = Cloned(_at, names[_at]);
        }
        return list;
    }
}