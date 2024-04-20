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

    function getBetByAddress(address walletaddress) internal view returns(Bets[] memory) {
        uint betsCount = FRDBettingContract.getAllBetIdsCount();
        uint userbetCount = 0;
        uint currentIndex = 0;

        for(uint i=0; i < betsCount; i++) {
            if(FRDBettingContract.getBetsMapping(i+1).participant == walletaddress) {
                userbetCount += 1;
            }
        }

        Bets[] memory bets = new Bets[](userbetCount);
        for (uint i = 0; i < userbetCount; i++) {
            uint currentId = i + 1;
            Bets memory currentBet = FRDBettingContract.getBetsMapping(currentId);
            bets[currentIndex] = currentBet;
            currentIndex += 1;
        }
        return bets;
    }

    function loadAllBets() external view returns (Bets[] memory) {
        uint betsCount = FRDBettingContract.getAllBetIdsCount();
        uint currentIndex = 0;

        Bets[] memory bets = new Bets[](betsCount);
        for (uint i = 0; i < betsCount; i++) {
            uint currentId = i + 1;
            Bets memory currentBet = FRDBettingContract.getBetsMapping(currentId);
            bets[currentIndex] = currentBet;
            currentIndex += 1;
        }
        return bets;
    }
    
    function filterByBetStatus(string memory status) external view returns(Bets[] memory) {
        uint betsCount = FRDBettingContract.getAllBetIdsCount();
        uint currentIndex = 0;

        Bets[] memory bets = new Bets[](betsCount);
        for (uint i = 0; i < betsCount; i++) {
            uint currentId = i + 1;
            if(compareStrings(FRDBettingContract.getBetsMapping(currentId).betstatus, status)) {
                Bets memory currentBet = FRDBettingContract.getBetsMapping(currentId);
                bets[currentIndex] = currentBet;
                currentIndex += 1;
            }
        }
        return bets;
    }

    function filterByBetUsername(string memory username) external view returns(Bets[] memory) {
        uint betsCount = FRDBettingContract.getAllBetIdsCount();
        uint currentIndex = 0;

        Bets[] memory bets = new Bets[](betsCount);
        for (uint i = 0; i < betsCount; i++) {
            uint currentId = i + 1;
            if(compareStrings(FRDBettingContract.getBetsMapping(currentId).username, username)) {
                Bets memory currentBet = FRDBettingContract.getBetsMapping(currentId);
                bets[currentIndex] = currentBet;
                currentIndex += 1;
            }
        }
        return bets;
    }

    function closeBet(uint _betId) public {
        if(msg.sender != admin && msg.sender != address(0)) {
            revert Unauthorized();
        }
        FRDBettingContract.closeBet(_betId);
    }

    function searchBetByAddress(address walletaddress) external view returns(Bets[] memory) {
        return FRDBettingContract.getBetByAddress(walletaddress);
    }

    function getUserBets(address walletaddress) external view returns(Bets[] memory) {
        return FRDBettingContract.getBetByAddress(walletaddress);
    }

    function getUserBetCount(address _useraddress) external view returns(uint) {
        return FRDBettingContract.getCount(_useraddress);
    }

    function getUserRefCount(address _useraddress) external view returns(uint) {
        return FRDBettingContract.getCount(_useraddress);
    }

}
