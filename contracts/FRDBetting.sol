// SPDX-License-Identifier: MIT

pragma solidity^0.8.9;

import "./FifaRewardToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "hardhat/console.sol";

struct Users {
        uint userId;
        bool hasplacedBet;
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

    contract FRDBetting is ReentrancyGuard {

        error priceMustBeGreaterThanZero();
        error Unauthorized();
        error betParticipantComplete();
        error InvalidAmount();
        error referralAlreadyExits();
        error sponsorMustHaveActiveBetToRefer();
        error BetClosed();
        error AccountNotRegistered();
        error DuplicateBetNotAllowed();
        
        using SafeMath for uint256;
        uint timeNow = block.timestamp;
        IERC20 public FifaRewardTokenContract;
        uint256 private _betIds;
        uint256 private _refIds;
        uint256 private _userIds;
        address private betdeployer;
        string creationType;
        address[] private emptyArr;
        address public feeWallet = 0xbCCEb2145266639E0C39101d48B79B6C694A84Dc;
        uint uId;
        uint256 bId;
        Bets[] betsArray;

        constructor(address _FifaRewardTokenAddress) {
            FifaRewardTokenContract = IERC20(_FifaRewardTokenAddress);
            betdeployer = msg.sender; 
        } 

        mapping(address => uint256) private _balanceOf;
        mapping(uint256 => Bets) private BetIds;
        mapping(address => Bets) private Bet;
        mapping(address => Users) private userDetails;
        mapping(uint256 => Users) private userDetailsById;
        mapping(address => Referrals) private referrals;
        mapping(uint256 => Referrals) private referralsbyId;
        
        event RegisterUser(uint indexed userId, bool registered, bool wasReferred, address walletaddress);
        event BetEvent(address indexed betopener,address participant, string username, uint betamount, uint betId, uint matchId, string matchd, string prediction, string bettingteam, string creationtype);
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
            require(msg.sender == betdeployer, "Invalid");
            _;
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

        function getuserbetIds(address _useraddress) public view returns(uint[] memory) {
            uint allbetsCount = _betIds;
            if(_useraddress == address(0)) {
                revert Unauthorized();
            }else {
                uint[] memory bet_Ids = new uint[](allbetsCount);
                uint currentIndex = 0;
                for(uint i = 0; i < allbetsCount; i++) {
                    if(BetIds[i+1].participant == _useraddress) {
                        bet_Ids[currentIndex] = i+1;
                        currentIndex++;
                    }
                }
                return bet_Ids;
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
            uint refId = getuserRefId(userReferrals[j]);
            uint[] memory refbetIds = getuserbetIds(userReferrals[j]);
            for(uint refbet = 0; refbet < refbetIds.length; refbet++) {
                if (compareStrings(BetIds[refbet + 1].betstatus,"open")) {
                    betAmounts[j] = BetIds[refbet + 1].betamount;
                    _refbonus_[j] = referralsbyId[refId].refbonus;
                    _refBonus = betAmounts[j].mul(_refbonus_[j]);

                    totalrefBonus += _refBonus;
                }
            }
            
            
        }
        return totalrefBonus;
    }

        function addReferrer(address _sponsor, uint _refbonus) external nonReentrant {
            require(_sponsor != address(0), "Invalid");
            require(_sponsor != msg.sender, "YCRY");
            
            
            uint _sponsoruserId = getUserId(_sponsor);
            uint _user_refId = getuserRefIdBySponsor(msg.sender,_sponsor);
            // check if user has been referred by this sponsor before
            if(referralsbyId[_user_refId].sponsor == _sponsor) {
                revert referralAlreadyExits();
            }else {
                address[] storage  _referrals = referralsbyId[_user_refId].referrals;
                _referrals.push(msg.sender);
                // check if user is already registered
                uint _referraluserId;
                if(userDetails[msg.sender].registered == true ) {
                    // user is already registered, do nothing
                    uId = getUserId(msg.sender);
                    userDetailsById[uId].refCount = userDetailsById[uId].refCount++;
                    userDetails[msg.sender].refCount = userDetailsById[uId].refCount++;
                    _referraluserId = userDetailsById[uId].userId;

                }else {
                    // user is not registered, register user and add address to User struct
                    _userIds += 1;
                    uId = _userIds; 
                    userDetailsById[uId] = Users({
                        userId:uId,
                        hasplacedBet: false,
                        betCount:0,
                        hasActiveBet:false,
                        refCount:0,
                        registered: true,
                        wasReferred: true,
                        walletaddress: msg.sender
                    });
                    userDetails[msg.sender].registered = true;
                    // _referraluserId = _userId;
                }
                console.log(" user ref counts",userDetailsById[uId].refCount++);
                _refIds += 1;
                uint _refId = _refIds;
                // add referrer to referrals struct
                referralsbyId[_refId] = Referrals({
                    refId:_refId,
                    sponsorUserId:_sponsoruserId,
                    referralUserId:_referraluserId,
                    referral:msg.sender,
                    sponsor:_sponsor,
                    refbonus:_refbonus.mul(1000),
                    referrals:_referrals
                });

                userDetailsById[_sponsoruserId].refCount++;
                
                emit RegisterUser(_referraluserId, true, true, msg.sender);

                emit AddReferral(_refId,_sponsoruserId,_referraluserId,msg.sender,_sponsor,_referrals);
            }
            
        }

        function checkDuplicateBet(uint _betId) internal view returns(bool) {
            for(uint i = 0; i < BetIds[_betId].participants.length; i++) {
                if(BetIds[_betId].participants[i] == msg.sender) {
                    return true;
                }
            }
            return false;
        }

        function PlaceBet(uint betamount, uint matchId, string memory username, uint _betId, address betopener, string memory matchfixture, string memory prediction, string memory bettingteam, uint totalbetparticipantscount, uint remainingparticipantscount) external nonReentrant {
            
            if(msg.sender == address(0)) {
                revert Unauthorized();
            } 
            if(betamount <= 0) {
                revert InvalidAmount();
            }
            require(FifaRewardTokenContract.balanceOf(msg.sender) >= betamount, "IFB");
            
            userDetails[msg.sender].hasplacedBet = true;
            // check if user is already registered
            _betIds += 1;
            
            if(_betId != 0) {
                bId = _betId;
                if(checkDuplicateBet(_betId)) {
                    revert DuplicateBetNotAllowed();
                }
                creationType = "JoinBet";
            }else {
                bId = _betIds;
                creationType = "OpenBet";
            }

            if(userDetails[msg.sender].registered == true ) {
                // user is already registered, continue with staking
                // get userId
                uId = getUserId(msg.sender);
                userDetailsById[uId].betCount = userDetailsById[uId].betCount++;
                userDetails[msg.sender].betCount = userDetailsById[uId].betCount++;
                userDetailsById[uId].hasplacedBet = true;
            }else {
                // user is not registered, register user and add address to User struct and proceed with staking
                _userIds += 1;
                uId = _userIds;
                userDetailsById[uId] = Users({
                    userId:uId,
                    hasplacedBet: true,
                    betCount: userDetailsById[uId].betCount++,
                    hasActiveBet:true,
                    refCount:userDetailsById[uId].refCount++,
                    registered: true,
                    wasReferred: false,
                    walletaddress: msg.sender
                });
                userDetails[msg.sender].registered = true;
                emit RegisterUser(uId, true, true, msg.sender);
            }

            address[] storage _participants = BetIds[bId].participants;
            _participants.push(msg.sender);

            BetIds[bId] = Bets({
                betId : bId,
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
                betstatus : "open",
                participants: _participants,
                betwinners: emptyArr,
                betlosers: emptyArr

            });
            
            
            _balanceOf[msg.sender] += betamount;
            FifaRewardTokenContract.transferFrom(msg.sender, address(this), betamount);
            emit BetEvent(betopener, msg.sender, username, betamount, bId, matchId, matchfixture, prediction, bettingteam, creationType);
            // emit OpenBets(msg.sender,msg.sender,username, betamount, betId, matchId, matchfixture, prediction, bettingteam);
        }

        function getBetParticipants(uint betId) external  view returns (address[] memory) {
            return BetIds[betId].participants;    
        }

        // function getBetsArray() external view returns (Bets[] memory) {
        //     uint betsCount = _betIds;
        //     Bets[] memory _betsArray = new Bets[](betsCount);

        //     for (uint i = 0; i < betsCount; i++) {
        //         uint currentId = i + 1;
        //         _betsArray[i] = BetIds[currentId];
        //     }

        //     return _betsArray;
        // }

        // Function to retrieve Referrals by ID
        function getBetsMapping(uint256 _betId) external view returns (Bets memory) {
            return BetIds[_betId];
        }

        // Function to retrieve Referrals by ID
        function getReferralsMapping(uint256 _referralId) external view returns (Referrals memory) {
            return referralsbyId[_referralId];
        }

        function getBetDetails(uint _betId) external view returns (Bets[] memory) {
            Bets[] memory betDetails = new Bets[](1);
            betDetails[0] = BetIds[_betId];
            return betDetails;
        }
        
        function getCount(address _useraddress) internal view returns (uint){
            uint _uId = getUserId(_useraddress);
            return userDetailsById[_uId].betCount;
        }

        function getAllBetIdsCount() external view returns (uint) {
            return _betIds;
        }

        function getAllRefIdsCount() external view returns (uint) {
            return _refIds;
        }

        function getAllUserIdsCount() external view returns (uint) {
            return _userIds;
        }

        function closeBet(uint _betId) external {
            BetIds[_betId].betstatus = "closed";
        }

        function getBetWinners (uint _betId) external view returns (address[] memory){
            return BetIds[_betId].betwinners;
        }

        function findbetWinners (uint _matchId, string memory betresult) external nonReentrant {
            uint betsCount = _betIds;
            // uint currentIndex = 0;
            // address[] memory betwinners = new address[](betsCount);
            for (uint i = 0; i < betsCount; i++) {
                uint currentId = i + 1;
                if(compareStrings(BetIds[currentId].betstatus, "open")) {
                    if(BetIds[currentId].remainingparticipantscount != 0) {
                        refundBet (currentId,BetIds[currentId].participants);
                    }else {
                        if(BetIds[currentId].matchId == _matchId) {
                            if(compareStrings(BetIds[currentId].prediction, betresult)) {
                                BetIds[currentId].betwinners.push(BetIds[currentId].participant);
                                paybetWinners(currentId,BetIds[currentId].betwinners,20);
                            }else {
                                BetIds[currentId].betlosers.push(BetIds[currentId].participant);
                            }
                        }
                    }
                }
            }
        }

        function refundBet (uint _betId,address[] memory betpartners) internal nonReentrant {
            if(msg.sender == address(0)) {
                revert Unauthorized();
            }
            uint _betamount = BetIds[_betId].betamount;
            for(uint p = 0; p < betpartners.length; p++) {
                address betP = BetIds[_betId].participants[p];
                _balanceOf[betP] -= _betamount;
                FifaRewardTokenContract.transferFrom( address(this),betP, _betamount);
            }

            uint betsCount = _betIds;

            for(uint i=0; i < betsCount; i++) {
                if(BetIds[i+1].betId == _betId) {
                    BetIds[i+1].betstatus = "closed";
                }
            }
            
        }

        function paybetWinners (uint _betId,address[] memory betwinners, uint paypercent) public nonReentrant {
            if(msg.sender == address(0)) {
                revert Unauthorized();
            }
            uint _betamount = BetIds[_betId].betamount;
            uint payfee = _betamount * paypercent.div(100);
            uint winnerPay = _betamount - payfee;
            uint mulitWinnersPay = winnerPay.div(3);

            if(BetIds[_betId].totalbetparticipantscount == 2) {
                for(uint bw = 0; bw < betwinners.length; bw++) {
                    address betWinner = BetIds[_betId].betwinners[bw];
                    _balanceOf[betWinner] -= winnerPay;
                    FifaRewardTokenContract.transferFrom( address(this),betWinner, winnerPay);
                }
            }else {
                for(uint bw = 0; bw < betwinners.length; bw++) {
                    BetIds[_betId].betwinners[bw];
                    address betWinner = BetIds[_betId].betwinners[bw];
                    _balanceOf[betWinner] -= mulitWinnersPay;
                    FifaRewardTokenContract.transferFrom( address(this),betWinner, mulitWinnersPay);
                }
            }
            
            uint betsCount = _betIds;

            for(uint i=0; i < betsCount; i++) {
                if(BetIds[i+1].betId == _betId) {
                    BetIds[i+1].betstatus = "closed";
                }
            }
        }
    }