// SPDX-License-Identifier: MIT

pragma solidity^0.8.9;

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

import "./SafeMath.sol";
import "./FRDBetting.sol";
import "./IFRDBetting.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract FRDBettingFeatures is ReentrancyGuard {

    using SafeMath for uint256;
    IFRDBetting private FRDBettingContract;
    address admin;

    constructor(address _frdBettingAddress) {
        FRDBettingContract = IFRDBetting(_frdBettingAddress);
        admin = msg.sender;
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    // Function to get bets by wallet address
    function getBetsByWallet(address _user) public view returns (Bet[] memory) {
        uint[] memory createdIds = FRDBettingContract.getBetIdsCreatedByUser(_user);
        uint[] memory joinedIds = FRDBettingContract.getBetIdsUserJoined(_user);
        uint totalCount = createdIds.length;
        Bet[] memory betsByUser = new Bet[](totalCount);
        uint index = 0;

        for (uint i = 0; i < createdIds.length; i++) {
            Bet memory currentItem = FRDBettingContract.getBetsMapping(createdIds[i]);
            betsByUser[index] = currentItem;
            index++;
        }

        for (uint i = 0; i < joinedIds.length; i++) {
            Bet memory currentItem = FRDBettingContract.getBetsMapping(joinedIds[i]);
            betsByUser[index] = currentItem;
            index++;
        }

        return betsByUser;
    }

    function getUserRegistrationDetails(address _user) public view returns (User memory) {
        return FRDBettingContract.getUserRegistrationDetails(_user);
    }

    // Function to get bets by username
    function getBetsByUsername(string memory _username) public view returns (Bet[] memory) {
        uint totalUsers = FRDBettingContract.nextUserId();
        address userAddress;
        bool userFound = false;
        
        for (uint i = 0; i <= totalUsers; i++) {
            address addr = FRDBettingContract.userIdToAddress(i);
            if (compareStrings(FRDBettingContract.getUserRegistrationDetails(addr).username, _username)) {
                userAddress = addr;
                userFound = true;
            }
        }

        require(userFound, "User not found");
        return getBetsByWallet(userAddress);
    }

    function getBetsMapping(uint256 _betId) external view returns (Bet memory) {
        return FRDBettingContract.getBetsMapping(_betId);
    }

    function getBetStatus(uint _betId) external view returns (string memory) {
        return FRDBettingContract.getBetsMapping(_betId).betstatus;
    }

    function compareBetStatus(uint _betId, string memory _betstatus) external view returns (bool) {
        return compareStrings(FRDBettingContract.getBetsMapping(_betId).betstatus, _betstatus);
    }

    function getBetIdsCreatedByUserCount(address _user) external view returns (uint) {
        return FRDBettingContract.getBetIdsCreatedByUserCount(_user);
    }

    function getBetIdsUserJoinedCount(address _user) external view returns (uint) {
        return FRDBettingContract.getBetIdsUserJoinedCount(_user);
    }

    function nextBetId() external view returns (uint256) {
        return FRDBettingContract.nextBetId();
    }

    function nextUserId() external view returns (uint256) {
        return FRDBettingContract.nextUserId();
    }

    // Function to get bets by bet status
    function getBetsByAmount(uint amount) public view returns (Bet[] memory) {
        uint totalBets = FRDBettingContract.nextBetId();
        uint currentIndex = 0;
        
        Bet[] memory bets = new Bet[](totalBets);
        // Populate the array with bets that have the specified status
        for (uint i = 0; i <= totalBets; i++) {
            uint currentId = i + 1;
            if (FRDBettingContract.getBetsMapping(currentId).betamount >= amount) {
                Bet memory currentItem = FRDBettingContract.getBetsMapping(currentId);
                bets[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return bets;
    }

    // Function to get bets by bet status
    function getBetsByStatus(string memory _betstatus) public view returns (Bet[] memory) {
        uint totalBets = FRDBettingContract.nextBetId();
        uint currentIndex = 0;
        
        Bet[] memory bets = new Bet[](totalBets);
        // Populate the array with bets that have the specified status
        for (uint i = 0; i <= totalBets; i++) {
            uint currentId = i + 1;
            if (compareStrings(FRDBettingContract.getBetsMapping(currentId).betstatus, _betstatus)) {
                Bet memory currentItem = FRDBettingContract.getBetsMapping(currentId);
                bets[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return bets;
    }

    // Function to load all bets
    function loadAllBets() public view returns (Bet[] memory) {
        uint totalBets = FRDBettingContract.nextBetId();
        Bet[] memory allBets = new Bet[](totalBets);

        for (uint i = 1; i <= totalBets; i++) {
            Bet memory currentItem = FRDBettingContract.getBetsMapping(i);
            allBets[i - 1] = currentItem;
        }

        return allBets;
    }

    // Function to list all the registered users' details
    function listRegisteredUsers() public view returns (User[] memory) {
        uint totalUsers = FRDBettingContract.nextUserId();
        User[] memory userList = new User[](totalUsers);
        for (uint i = 1; i <= totalUsers; i++) {
            address userAddress = FRDBettingContract.userIdToAddress(i);
            User memory currentItem = FRDBettingContract.getUserRegistrationDetails(userAddress);
            userList[i - 1] = currentItem;
        }
        return userList;
    } 

}
