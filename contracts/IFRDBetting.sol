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
    
    function getUserId(address _useraddress) external view returns(uint);

    function getuserRefIdBySponsor(address _useraddress, address _sponsor) external view returns(uint);

    function getuserbetIds(address _useraddress) external view returns(uint[] memory);

    function getuserRefId(address _useraddress) external view returns(uint);

    function getuserReferrals(address _useraddress) external view returns (address[] memory);

    function getReferralsMapping(uint256 _referralId) external view returns (Referrals memory);

    function getBetsMapping(uint256 _betId) external view returns (Bets memory);

    function getAllBetIdsCount() external  view returns (uint);

    function getAllRefIdsCount() external view returns (uint);

    function getAllUserIdsCount() external view returns (uint);

    function closeBet(uint _betId) external; 
    // function getBetsArray() external view returns (Bets[] memory);

    function getuserbetId(address _useraddress) external view returns(uint);

    function getuserRefBonus(address _useraddress) external view returns(uint);

    function getBetParticipants(uint betId) external view returns (address[] memory);

    function getBetConditions(uint256 _betId) external  view returns (address, string memory, string memory, string memory);

    function getCount(address _useraddress) external view returns (uint);
    
    function getBetByAddress(address walletaddress) external view returns(Bets[] memory);

}