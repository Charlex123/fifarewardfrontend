// SPDX-License-Identifier: MIT

pragma solidity^0.8.2;

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

import "./FifaRewardToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "hardhat/console.sol";


contract GuessFootBallHero is ReentrancyGuard {

    using SafeMath for uint256;
    uint256 private nextGameId;
    address admin;
    uint withFeePercent = 5;
    uint amtToWIthdraw;
    uint amtRemaining;
    address public adminwallet = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    uint uId;
    IERC20 public FifaRewardTokenContract;

    constructor(address _FifaRewardTokenAddress) {
        FifaRewardTokenContract = IERC20(_FifaRewardTokenAddress);
        admin = msg.sender; 
    } 

    struct WalletAddress {
        uint gameCount;
    }

    struct HeroGame {
        uint Id;
        uint gameId;
        uint amountplayed;
        uint rewardamount;
        uint time;
        uint played;
        uint level;
        uint wins;
        uint remaining;
        string status;
        string[] hint;
        address walletaddress;
    }

    struct LeaderboardEntry {
        address walletaddress;
        uint amountplayed;
        uint rewardamount;
    }

    mapping(address => HeroGame) private Games;
    mapping(uint256 => HeroGame) private GameIds;
    mapping(address => WalletAddress) private walletaddresses; // Mapping of user addresses to user data
    mapping(address => uint[]) private addressCreatedGameIds; // Mapping of user addresses to the betIds they created
    mapping(uint => address) private playerdToAddress;


    event GamePlayed(uint indexed Id,uint indexed gameId,address indexed walletaddress, uint amount);

    // modifier to check if caller is owner
    modifier isOwner() {
        if(msg.sender != admin)
            revert("Unauthorized");
        _;
    }
    
    function myWalletAddress() public view returns(address) {
        return msg.sender;
    }

    function getOwner() public view returns(address) {
        return admin;
    }

    function myTokenBalance() public view returns(uint) {
        return FifaRewardTokenContract.balanceOf(msg.sender);
    }

    function Play(uint gameId, uint amount, uint level, uint played, uint remaining, uint wins, string[] memory hint) public nonReentrant {
        nextGameId++;
        if(msg.sender == address(0))
            revert("Unauthorized");
        if(amount <= 0) 
            revert("invalid amount");
        require(FifaRewardTokenContract.balanceOf(msg.sender) >= amount, "Insufficient Token Balance");

        
        uint rewardamt = amount.mul(2);

        GameIds[nextGameId] = HeroGame({
            Id: nextGameId,
            gameId: gameId,
            amountplayed: amount,
            rewardamount: rewardamt,
            time: block.timestamp,
            played: played,
            level: level,
            wins: wins,
            remaining: remaining,
            status: "Win",
            hint: hint,
            walletaddress: msg.sender
        });

        // Map user address to the new stakeId
        addressCreatedGameIds[msg.sender].push(nextGameId);
        walletaddresses[msg.sender].gameCount = addressCreatedGameIds[msg.sender].length;
        // Perform the token transfer from staker to the contract
        require(FifaRewardTokenContract.transfer(msg.sender, rewardamt), "Token transfer failed");

        // Check if the user is a downline and reward the sponsor
        emit GamePlayed(nextGameId, gameId, msg.sender, rewardamt);
    }

    
    function getContractBalance() public view isOwner returns (uint256) {
        return address(this).balance;
    }

    function getContractTokenBalance() public view isOwner returns (uint256) {
        return FifaRewardTokenContract.balanceOf(address(this));
    }

    function loadGames() external view returns (HeroGame[] memory) {
        uint gamesCount = nextGameId;
        uint currentIndex = 0;

        HeroGame[] memory games = new HeroGame[](gamesCount);
        for (uint i = 0; i < gamesCount; i++) {
            uint currentId = i + 1;
            HeroGame storage currentGame = GameIds[currentId];
            games[currentIndex] = currentGame;
            currentIndex += 1;
        }
        return games;
    }

    
    function loadUserGames(address _useraddress) external view returns (HeroGame[] memory) {
        uint gamesCount = nextGameId;
        uint userGames = 0;
        uint currentIndex = 0;

        for(uint i = 0; i < gamesCount; i++) {
            if(GameIds[i+1].walletaddress == _useraddress) {
                userGames += 1;
            }
        }

        HeroGame[] memory games = new HeroGame[](userGames);
        for (uint i = 0; i < userGames; i++) {
            if(GameIds[i+1].walletaddress == _useraddress) {
                uint currentId = i + 1;
                HeroGame storage currentGame = GameIds[currentId];
                games[currentIndex] = currentGame;
                currentIndex += 1;
            }
        }
        return games;
    }

    function getWalletGameCount(address _useraddress) public view returns(uint) {
        return walletaddresses[_useraddress].gameCount;
    }

    function getLeaderboard() external view returns (LeaderboardEntry[] memory) {
        uint gamesCount = nextGameId;
        LeaderboardEntry[] memory leaderboard = new LeaderboardEntry[](gamesCount);

        for (uint i = 0; i < gamesCount; i++) {
            leaderboard[i] = LeaderboardEntry({
                walletaddress: GameIds[i + 1].walletaddress,
                amountplayed: GameIds[i + 1].amountplayed,
                rewardamount: GameIds[i + 1].rewardamount
            });
        }

        for (uint i = 0; i < gamesCount; i++) {
            for (uint j = i + 1; j < gamesCount; j++) {
                if (leaderboard[j].amountplayed > leaderboard[i].amountplayed) {
                    LeaderboardEntry memory temp = leaderboard[i];
                    leaderboard[i] = leaderboard[j];
                    leaderboard[j] = temp;
                }
            }
        }

        return leaderboard;
    }

}