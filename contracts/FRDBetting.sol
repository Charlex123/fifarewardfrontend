// SPDX-License-Identifier: MIT

pragma solidity^0.8.9;

import "./FifaRewardToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract FRDBetting is ReentrancyGuard {

    using SafeMath for uint256;
    uint256 private openbetIds;
    uint timeNow = block.timestamp;
    IERC20 public FifaRewardTokenContract;
    address private betdeployer;
    address[] private emptyArr;
    Bets[] betsArray;

    constructor(address _FifaRewardTokenAddress) {
        FifaRewardTokenContract = IERC20(_FifaRewardTokenAddress);
        betdeployer = msg.sender; 
    } 

    struct Bets {
        uint256 openbetId;
        uint betId;
        uint matchId;
        string matchd;
        address openedBy;
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

    struct BetParticipants {
        uint256 betId;
        uint matchId;
        string matchd;
        address openedBy;
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
    mapping(address => BetParticipants) private Participants;
    
    event OpenBets(address indexed betopener, uint betamount, uint betId, uint matchId, string matchd, string prediction, string bettingteam);
    event JoinBett(address indexed betparticipant, uint betamount, uint betId, uint matchId, string matchd, string prediction, string bettingteam);

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

    function OpenBet(uint betamount, uint matchId, uint betId, string memory matchd, address betopener, string memory prediction, string memory bettingteam, uint totalbetparticipantscount, uint remainingparticipantscount) external nonReentrant {
        require(betopener != address(0), "User cannot be a zero address");
        require(betamount > 0, "Amount must be greater than 0");
        require(FifaRewardTokenContract.balanceOf(msg.sender) >= betamount, "Insufficient FifaRewardToken balance");

        openbetIds += 1;
        uint256 openbetId = openbetIds;
        address[] storage _participants = Bet[betopener].participants;
        _participants.push(betopener);

        Beter[openbetId] = Bets({
            openbetId : openbetId,
            betId : betId,
            matchId : matchId,
            matchd : matchd,
            openedBy : betopener,
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

        
        Bet[betopener].participants.push(betopener);

        _balanceOf[msg.sender] -= betamount;
        FifaRewardTokenContract.transferFrom(msg.sender, address(this), betamount);
        
        emit OpenBets(betopener, betamount, betId, matchId, matchd, prediction, bettingteam);
    }

    function JoinBet(uint betamount, uint matchId, uint betId, string memory matchd, address betparticipant, string memory prediction, string memory bettingteam) external nonReentrant {
        require(betparticipant != address(0), "User cannot be a zero address");
        require(betamount > 0, "Amount must be greater than 0");
        require(FifaRewardTokenContract.balanceOf(msg.sender) >= betamount, "Insufficient FifaRewardToken balance");

        openbetIds += 1;
        uint openbetId = openbetIds;

        Bet[betparticipant].openbetId = openbetId;
        Bet[betparticipant].betId = betId;
        Bet[betparticipant].matchId = matchId;
        Bet[betparticipant].matchd = matchd;
        Bet[betparticipant].betamount = betamount;
        Bet[betparticipant].openedBy = betparticipant;
        Bet[betparticipant].prediction = prediction;
        Bet[betparticipant].bettingteam = bettingteam;
        Bet[betparticipant].betstatus = "open";

        _balanceOf[msg.sender] -= betamount;
        FifaRewardTokenContract.transferFrom(msg.sender, address(this), betamount);
        
        emit JoinBett(betparticipant, betamount, betId, matchId, matchd, prediction, bettingteam);
     }

    function getBetParticipants(uint betId) public view returns (address[] memory) {

    }
}