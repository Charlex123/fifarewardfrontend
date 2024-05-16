// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/*
  8888888888   88888888       888888888
  8888888888   8888 88888     88888888888
  8888         8888   8888    8888   88888
  8888         8888 88888     8888    88888
  8888888888   8888888        8888    88888
  8888888888   8888888        8888    88888
  8888         8888 8888      8888   88888
  8888         8888   8888    88888888888
  8888         8888    8888   888888888
*/

import "./FRDBetting.sol";

interface IFRDBetting {
    
    function getUserRegistrationDetails(address _user) external view returns (User memory);
    function getBetsMapping(uint256 _betId) external view returns (Bet memory);
    function nextBetId() external view returns (uint256);
    function compareStrings(string memory a, string memory b) external pure returns (bool);
    function getBetIdsCreatedByUser(address _user) external view returns (uint[] memory);
    function getBetIdsCreatedByUserCount(address _user) external view returns (uint);
    function getBetIdsUserJoined(address _user) external view returns (uint[] memory);
    function getBetIdsUserJoinedCount(address _user) external view returns (uint);
    function users(address _user) external view returns (User memory);
    function userIdToAddress(uint _userId) external view returns (address);
    function nextUserId() external view returns (uint256);
    

}