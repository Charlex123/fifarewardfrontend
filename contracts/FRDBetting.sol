// SPDX-License-Identifier: MIT

pragma solidity^0.8.9;

import "./FifaRewardToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract FRDBetting is ReentrancyGuard {

    error createTokenFirst();
    error biddingTimeHasPassed();
    error minimumbiddingAmount();
    error priceMustBeGreaterThanZero();
    error Unauthorized();
    error betParticipantComplete();
    error InvalidAmount();
    error BetClosed();
    
    using SafeMath for uint256;
    uint timeNow = block.timestamp;
    IERC20 public FifaRewardTokenContract;
    uint256 private _betIds;
    address private betdeployer;
    address[] private emptyArr;
    Bets[] betsArray;

    constructor(address _FifaRewardTokenAddress) {
        FifaRewardTokenContract = IERC20(_FifaRewardTokenAddress);
        betdeployer = msg.sender; 
    } 

    struct Bets {
        uint betId;
        uint matchId;
        string username;
        string matchfixture;
        address openedBy;
        address participant;
        uint betamount;
        uint totalbetparticipantscount;
        uint remainingparticipantscount;
        string prediction;
        string bettingteam;
        string betstatus;
        address[] participants;
        address[] betwinners;
        address[] betlosers;
    }

    mapping(address => uint256) private _balanceOf;
    mapping(uint256 => Bets) private Beter;
    mapping(address => Bets) private Bet;
    
    event OpenBets(address indexed betopener, address participant,string username, uint betamount, uint betId, uint matchId, string matchfixture, string prediction, string bettingteam);
    event JoinBett(address indexed betopener,address participant, string username, uint betamount, uint betId, uint matchId, string matchd, string prediction, string bettingteam);

    function myTokenBalance() public view returns(uint) {
        return _balanceOf[msg.sender];
    }
    
     // modifier to check if caller is owner
    modifier isOwner() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == betdeployer, "Caller is not owner");
        _;
    }

    // Function to update the reward rate (onlyOwner)
    function showcontractAddress() public view returns(address) {
        return address(this);
    }
    
    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function OpenBet(uint betamount, uint matchId,string memory username, string memory matchfixture, string memory prediction, string memory bettingteam, uint totalbetparticipantscount, uint remainingparticipantscount) external nonReentrant {
        
        if(msg.sender == address(0)) {
            revert Unauthorized();
        } 
        if(betamount <= 0) {
            revert InvalidAmount();
        }
        require(FifaRewardTokenContract.balanceOf(msg.sender) >= betamount, "Insufficient FifaRewardToken balance");

        _betIds += 1;
        uint256 betId = _betIds;
        address[] storage _participants = Bet[msg.sender].participants;
        _participants.push(msg.sender);

        Beter[betId] = Bets({
            betId : betId,
            matchId : matchId,
            username: username,
            matchfixture : matchfixture,
            openedBy : msg.sender,
            participant: msg.sender,
            betamount : betamount,
            totalbetparticipantscount: totalbetparticipantscount,
            remainingparticipantscount: remainingparticipantscount,
            prediction : prediction,
            bettingteam : bettingteam,
            betstatus : "open",
            participants: _participants,
            betwinners: emptyArr,
            betlosers: emptyArr

        });

        
        Bet[msg.sender].participants.push(msg.sender);

        _balanceOf[msg.sender] -= betamount;
        FifaRewardTokenContract.transferFrom(msg.sender, address(this), betamount);
        
        emit OpenBets(msg.sender,msg.sender,username, betamount, betId, matchId, matchfixture, prediction, bettingteam);
    }

    function JoinBet(uint betamount, uint matchId, string memory username, uint betId,address betopener, string memory matchfixture, string memory prediction, string memory bettingteam, uint totalbetparticipantscount) external nonReentrant {
        if(msg.sender == address(0)) {
            revert Unauthorized();
        } 
        if(betamount <= 0) {
            revert InvalidAmount();
        }

        require(FifaRewardTokenContract.balanceOf(msg.sender) >= betamount, "Insufficient FifaRewardToken balance");

        // get betparticipants array
        address[] storage _participants = Bet[betopener].participants;
        _participants.push(msg.sender);

        if(Beter[betId].remainingparticipantscount == 0) {
            revert betParticipantComplete();
        }else if(!compareStrings(Beter[betId].betstatus,"closed")){
            revert BetClosed();
        }else{
            uint256 remainingparticipantscount = Beter[betId].totalbetparticipantscount - 1;

            Beter[betId] = Bets({
                betId : betId,
                matchId : matchId,
                username: username,
                matchfixture : matchfixture,
                openedBy : betopener,
                participant: msg.sender,
                betamount : betamount,
                totalbetparticipantscount: totalbetparticipantscount,
                remainingparticipantscount: remainingparticipantscount,
                prediction : prediction,
                bettingteam : bettingteam,
                betstatus : Beter[betId].betstatus,
                participants: _participants,
                betwinners: emptyArr,
                betlosers: emptyArr

            });

            _balanceOf[msg.sender] -= betamount;
            FifaRewardTokenContract.transferFrom(msg.sender, address(this), betamount);
            
            emit JoinBett(betopener, msg.sender, username, betamount, betId, matchId, matchfixture, prediction, bettingteam);
        }
    }

    function getBetParticipants(uint betId) external  view returns (address[] memory) {
        return Beter[betId].participants;    
    }

    function loadAllBets() external view returns (Bets[] memory) {
        uint betsCount = _betIds;
        uint currentIndex = 0;

        Bets[] memory bets = new Bets[](betsCount);
        for (uint i = 0; i < betsCount; i++) {
            uint currentId = i + 1;
            Bets storage currentBet = Beter[currentId];
            bets[currentIndex] = currentBet;
            currentIndex += 1;
        }
        return bets;
    }
    
    // Function to display only the arrays of prediction and betting team of a given betId
    function getBetConditions(uint256 _betId) external  view returns (address, string memory, string memory, string memory) {
        // uint betsCount = _betIds;
        // uint searchbetCount = 0;
        // uint currentIndex = 0;

        // for(uint i=0; i< betsCount; i++) {
        //     if(Beter[_betId].betId == _betId && Beter[_betId].matchId == _matchId) {
        //         searchbetCount += 1;
        //     }
        // }
        address participant = Beter[_betId].participant;
        string memory username = Beter[_betId].username;
        string memory prediction = Beter[_betId].prediction;
        string memory bettingteam = Beter[_betId].bettingteam;
        return (participant, username, prediction, bettingteam);
    }

    function getUserBetCount() public view returns(uint) {
        uint totalBetIds = _betIds;
        uint betCount = 0;

        for(uint i = 0; i < totalBetIds; i++) {
            if(Beter[i+1].participant == msg.sender) {
                betCount += 1;
            }
        }
        return betCount;
    }

    function searchBetByAddress(address walletaddress) external view returns(Bets[] memory) {
        uint betsCount = _betIds;
        uint searchbetCount = 0;
        uint currentIndex = 0;

        for(uint i=0; i < betsCount; i++) {
            if(Beter[i+1].participant == walletaddress) {
                searchbetCount += 1;
            }
        }

        Bets[] memory bets = new Bets[](betsCount);
        for (uint i = 0; i < betsCount; i++) {
            uint currentId = i + 1;
            Bets storage currentBet = Beter[currentId];
            bets[currentIndex] = currentBet;
            currentIndex += 1;
        }
        return bets;
    } 

    function betListSearch() external {

    }

    function closeBet(uint _matchId) external {
        uint betsCount = _betIds;
        uint searchbetCount = 0;

        for(uint i=0; i < betsCount; i++) {
            if(Beter[i+1].matchId == _matchId) {
                searchbetCount += 1;
            }
        }

        for (uint i = 0; i < betsCount; i++) {
            Beter[i+1].betstatus = "closed";
        }
    }

    function filterByClosedBets() external view returns(Bets[] memory) {
        uint betsCount = _betIds;
        uint currentIndex = 0;

        Bets[] memory bets = new Bets[](betsCount);
        for (uint i = 0; i < betsCount; i++) {
            uint currentId = i + 1;
            if(compareStrings(Beter[currentId].betstatus, "closed")) {
                Bets storage currentBet = Beter[currentId];
                bets[currentIndex] = currentBet;
                currentIndex += 1;
            }
        }
        return bets;
    }

    function filterByOpenBets() external view returns(Bets[] memory){
        uint betsCount = _betIds;
        uint currentIndex = 0;

        Bets[] memory bets = new Bets[](betsCount);
        for (uint i = 0; i < betsCount; i++) {
            uint currentId = i + 1;
            if(compareStrings(Beter[currentId].betstatus, "open")) {
                Bets storage currentBet = Beter[currentId];
                bets[currentIndex] = currentBet;
                currentIndex += 1;
            }
        }
        return bets;
    }

    function filterByBetAmount(uint _betamount) external view returns(Bets[] memory) {
        uint betsCount = _betIds;
        uint currentIndex = 0;

        Bets[] memory bets = new Bets[](betsCount);
        for (uint i = 0; i < betsCount; i++) {
            uint currentId = i + 1;
            if(Beter[currentId].betamount >= _betamount) {
                Bets storage currentBet = Beter[currentId];
                bets[currentIndex] = currentBet;
                currentIndex += 1;
            }
        }
        return bets;
    }

    function getBetWinners (uint _matchId) external {
        uint betsCount = _betIds;
        uint searchbetCount = 0;

        for(uint i=0; i < betsCount; i++) {
            if(Beter[i+1].matchId == _matchId) {
                searchbetCount += 1;
            }
        }

        for (uint i = 0; i < betsCount; i++) {
            Beter[i+1].betstatus = "closed";
        }
    }

    function paybetWinners (uint _matchId) private {
        uint betsCount = _betIds;
        uint searchbetCount = 0;

        for(uint i=0; i < betsCount; i++) {
            if(Beter[i+1].matchId == _matchId) {
                searchbetCount += 1;
            }
        }

        for (uint i = 0; i < betsCount; i++) {
            Beter[i+1].betstatus = "closed";
        }
    }
}