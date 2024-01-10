// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/interfaces/IERC20Upgradeable.sol";

interface IFifaStaking {
    struct FEES {
        uint256 unstakingFee;
        uint256 terminationFee;
        uint256 stakingFee;
    }

    function initialize(
        address _owner,
        address _token,
        string calldata _name,
        FEES calldata _fees
    ) external;

    function addRewards(uint256 amount) external;
}