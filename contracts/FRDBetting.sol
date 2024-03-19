// SPDX-License-Identifier: MIT

pragma solidity^0.8.9;

import "./FifaRewardToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract FRDBetting is ReentrancyGuard {

    error createTokenFirst();
    error biddingTimeHasPassed();
    error minimumbiddingAmount();
    error priceMustBeGreaterThanZero();
    error Unauthorized();
    error betParticipantComplete();
    error InvalidAmount();
    error referralAlreadyExits();
    error sponsorMustHaveActiveBetToRefer();
    error BetClosed();
    error AccountNotRegistered();
    
    using SafeMath for uint256;
    uint timeNow = block.timestamp;
    IERC20 public FifaRewardTokenContract;
    uint256 private _betIds;
    uint256 private _refIds;
    uint256 private _userIds;
    address private betdeployer;
    address[] private emptyArr;
    Bets[] betsArray;

    constructor(address _FifaRewardTokenAddress) {
        FifaRewardTokenContract = IERC20(_FifaRewardTokenAddress);
        betdeployer = msg.sender; 
    } 

    struct Users {
        uint userId;
        bool hasbetd;
        uint betCount;
        bool hasActiveBet;
        uint refCount;
        bool registered;
        bool wasReferred;
        address walletaddress;
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

    struct Referrals {
        uint refId;
        uint sponsorUserId;
        uint referralUserId;
        address referral;
        address sponsor;
        uint refbonus;
        address[] referrals;
    }

    mapping(address => uint256) private _balanceOf;
    mapping(uint256 => Bets) private BetIds;
    mapping(address => Bets) private Bet;
    mapping(address => Users) private userDetails;
    mapping(uint256 => Users) private userDetailsById;
    mapping(address => Referrals) private referrals;
    mapping(uint256 => Referrals) private referralsbyId;
    
    event OpenBets(address indexed betopener, address participant,string username, uint betamount, uint betId, uint matchId, string matchfixture, string prediction, string bettingteam);
    event JoinBett(address indexed betopener,address participant, string username, uint betamount, uint betId, uint matchId, string matchd, string prediction, string bettingteam);
    event AddReferral(uint indexed refId,uint sponsorUserId, uint referralUserId, address referral, address sponsor, address[] referrals);

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
    
    function getUserId(address _useraddress) public view returns(uint) {
        uint allusersCount = _userIds;
        if(_useraddress == address(0)) {
            revert Unauthorized();
        }else {
            uint _uId;
            for(uint i = 0; i < allusersCount; i++) {
                if(userDetailsById[i+1].walletaddress == _useraddress) {
                    _uId = userDetailsById[i+1].userId;
                }
            }
            return _uId;
        }
    }

    function getuserRefIdBySponsor(address _useraddress, address _sponsor) public view returns(uint) {
        uint allrefsCount = _refIds;
        if(_useraddress == address(0)) {
            revert Unauthorized();
        }else {
            uint _refId;
            for(uint i = 0; i < allrefsCount; i++) {
                if(referralsbyId[i+1].referral == _useraddress && referralsbyId[i+1].sponsor == _sponsor) {
                    _refId = referralsbyId[i+1].refId;
                }
            }
            return _refId;
        }
    }

    function getuserRefId(address _useraddress) public view returns(uint) {
        uint allrefsCount = _refIds;
        if(_useraddress == address(0)) {
            revert Unauthorized();
        }else {
            uint _refId;
            for(uint i = 0; i < allrefsCount; i++) {
                if(referralsbyId[i+1].referral == _useraddress) {
                    _refId = referralsbyId[i+1].refId;
                }
            }
            return _refId;
        }
    }

    function getuserReferrals(address _useraddress) public view returns (address[] memory) {
        
        // get userId
        uint _userId = getUserId(_useraddress);
        //get user refId
        // uint _refId = getuserRefId(_useraddress);

        // Check if the user exists and has referrals
        if(userDetailsById[_userId].registered == false) {
            revert AccountNotRegistered();
        }

        // if(userDetailsById[_userId].refCount )
        uint allrefCount = _refIds;
        uint refCount = userDetailsById[_userId].refCount;
        // uint currentIndex = 0;
        
        address[] memory userReferrals = new address[](refCount);

        uint currentIndex = 0;

        // Iterate through all referrals to find the ones related to the user
        for(uint i = 0; i < allrefCount; i++) {
            if(referralsbyId[i+1].sponsor == _useraddress) {
                userReferrals[currentIndex] = referralsbyId[i+1].referral;
                currentIndex++;
            }
        }

        return userReferrals;
    }

    function getuserbetId(address _useraddress) public view returns(uint) {
        uint allbetsCount = _betIds;
        if(_useraddress == address(0)) {
            revert Unauthorized();
        }else {
            uint _betId;
            for(uint i = 0; i < allbetsCount; i++) {
                if(BetIds[i+1].participant == _useraddress) {
                    _betId = BetIds[i+1].betId;
                }
            }
            return _betId;
        }
    }

    function getuserRefBonus(address _useraddress) public view returns(uint totalrefbonus) {
        // get user referrals
        address[] memory userReferrals = getuserReferrals(_useraddress);
        uint refCount = userReferrals.length;
        uint[] memory betAmounts = new uint[](refCount);
        uint[] memory _refbonus_ = new uint[](refCount);
        // Check active bets for each referral and sum their bet amounts
        uint totalrefBonus = 0;
        uint _refBonus = 0;
        for(uint j = 0; j < refCount; j++) {
            // get user bet & referral Id 
            uint refbetId = getuserbetId(userReferrals[j]);
            uint refId = getuserRefId(userReferrals[j]);
            if (compareStrings(BetIds[refbetId].betstatus,"open")) {
                betAmounts[j] = BetIds[refbetId].betamount;
                _refbonus_[j] = referralsbyId[refId].refbonus;
                _refBonus = betAmounts[j].mul(_refbonus_[j]);

                totalrefBonus += _refBonus;
            }
        }
        return totalrefBonus;
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

        BetIds[betId] = Bets({
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

        
        _balanceOf[msg.sender] += betamount;
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

        if(BetIds[betId].remainingparticipantscount == 0) {
            revert betParticipantComplete();
        }else if(!compareStrings(BetIds[betId].betstatus,"closed")){
            revert BetClosed();
        }else{
            uint256 remainingparticipantscount = BetIds[betId].totalbetparticipantscount - 1;

            BetIds[betId] = Bets({
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
                betstatus : BetIds[betId].betstatus,
                participants: _participants,
                betwinners: emptyArr,
                betlosers: emptyArr

            });

            _balanceOf[msg.sender] += betamount;
            FifaRewardTokenContract.transferFrom(msg.sender, address(this), betamount);
            
            emit JoinBett(betopener, msg.sender, username, betamount, betId, matchId, matchfixture, prediction, bettingteam);
        }
    }

    function getBetParticipants(uint betId) external  view returns (address[] memory) {
        return BetIds[betId].participants;    
    }

    function loadAllBets() external view returns (Bets[] memory) {
        uint betsCount = _betIds;
        uint currentIndex = 0;

        Bets[] memory bets = new Bets[](betsCount);
        for (uint i = 0; i < betsCount; i++) {
            uint currentId = i + 1;
            Bets storage currentBet = BetIds[currentId];
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
        //     if(BetIds[_betId].betId == _betId && BetIds[_betId].matchId == _matchId) {
        //         searchbetCount += 1;
        //     }
        // }
        address participant = BetIds[_betId].participant;
        string memory username = BetIds[_betId].username;
        string memory prediction = BetIds[_betId].prediction;
        string memory bettingteam = BetIds[_betId].bettingteam;
        return (participant, username, prediction, bettingteam);
    }

    function getUserBetCount() public view returns(uint) {
        uint totalBetIds = _betIds;
        uint betCount = 0;

        for(uint i = 0; i < totalBetIds; i++) {
            if(BetIds[i+1].participant == msg.sender) {
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
            if(BetIds[i+1].participant == walletaddress) {
                searchbetCount += 1;
            }
        }

        Bets[] memory bets = new Bets[](betsCount);
        for (uint i = 0; i < betsCount; i++) {
            uint currentId = i + 1;
            Bets storage currentBet = BetIds[currentId];
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
            if(BetIds[i+1].matchId == _matchId) {
                searchbetCount += 1;
            }
        }

        for (uint i = 0; i < betsCount; i++) {
            BetIds[i+1].betstatus = "closed";
        }
    }

    function filterByClosedBets() external view returns(Bets[] memory) {
        uint betsCount = _betIds;
        uint currentIndex = 0;

        Bets[] memory bets = new Bets[](betsCount);
        for (uint i = 0; i < betsCount; i++) {
            uint currentId = i + 1;
            if(compareStrings(BetIds[currentId].betstatus, "closed")) {
                Bets storage currentBet = BetIds[currentId];
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
            if(compareStrings(BetIds[currentId].betstatus, "open")) {
                Bets storage currentBet = BetIds[currentId];
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
            if(BetIds[currentId].betamount >= _betamount) {
                Bets storage currentBet = BetIds[currentId];
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
            if(BetIds[i+1].matchId == _matchId) {
                searchbetCount += 1;
            }
        }

        for (uint i = 0; i < betsCount; i++) {
            BetIds[i+1].betstatus = "closed";
        }
    }

    function paybetWinners (uint _matchId) private {
        uint betsCount = _betIds;
        uint searchbetCount = 0;

        for(uint i=0; i < betsCount; i++) {
            if(BetIds[i+1].matchId == _matchId) {
                searchbetCount += 1;
            }
        }

        for (uint i = 0; i < betsCount; i++) {
            BetIds[i+1].betstatus = "closed";
        }
    }
}