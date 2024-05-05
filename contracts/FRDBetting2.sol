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
        uint bId;
        uint matchId;
        uint betId;
        string username;
        string matchfixture;
        address openedBy;
        string creationType;
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

    error priceMustBeGreaterThanZero();
        error Unauthorized();
        error betParticipantComplete();
        error InvalidAmount();
        error referralAlreadyExits();
        error sponsorMustHaveActiveBetToRefer();
        error BetClosed();
        error AccountNotRegistered();
        error DuplicateBetNotAllowed();


    contract FRDBetting is ReentrancyGuard {


        using SafeMath for uint256;
        uint timeNow = block.timestamp;
        IERC20 public FifaRewardTokenContract;
        uint256 private _bIds;
        uint256 private _refIds;
        uint256 private _userIds;
        uint remainingparticipantscount;
        address private betdeployer;
        address[] private emptyArr;
        address public feeWallet = 0xbCCEb2145266639E0C39101d48B79B6C694A84Dc;
        uint uId;
        uint256 __bId;
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
        event BetEvent(address indexed betopener,address participant,string username, uint betamount, uint betId, uint matchId);
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

        function _getUserId(address _useraddress) internal view returns(uint) {
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

        function getUserId(address _useraddress) public  view returns(uint) {
            return _getUserId(_useraddress);
        }

        function _getuserRefIdBySponsor(address _useraddress, address _sponsor) internal view returns(uint) {
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

        function getuserRefIdBySponsor(address _useraddress, address _sponsor) public view returns(uint) {
            return _getuserRefIdBySponsor(_useraddress,_sponsor);
        }

        function _getuserRefId(address _useraddress) internal view returns(uint) {
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

        function getuserRefId(address _useraddress) public view returns(uint) {
            return _getuserRefId(_useraddress);
        }

        function _getuserReferrals(address _useraddress) internal view returns (address[] memory) {

            // get userId
            uint _userId = _getUserId(_useraddress);
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
            uint allbetsCount = _bIds;
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

        function getuserReferrals(address _useraddress) public view returns (address[] memory) {
            return _getuserReferrals(_useraddress);   
        }

        function getuserRefBonus(address _useraddress) public view returns(uint totalrefbonus) {
            // get user referrals
            address[] memory userReferrals = _getuserReferrals(_useraddress);
            uint refCount = userReferrals.length;
            uint[] memory betAmounts = new uint[](refCount);
            uint[] memory _refbonus_ = new uint[](refCount);
            // Check active bets for each referral and sum their bet amounts
            uint totalrefBonus = 0;
            uint _refBonus = 0;
            for(uint j = 0; j < refCount; j++) {
                // get user bet & referral Id
                uint refId = _getuserRefId(userReferrals[j]);
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

        function registerNewUser(address useraddress, uint betcount, uint refcount, bool hasplacedbet, bool hasactivebet, bool wasreferred) internal {
            _userIds += 1;
            uId = _userIds;
            userDetailsById[uId] = Users({
                userId:uId,
                hasplacedBet: hasplacedbet,
                betCount:betcount,
                hasActiveBet:hasactivebet,
                refCount:refcount,
                registered: true,
                wasReferred: wasreferred,
                walletaddress: useraddress
            });
            userDetails[useraddress].registered = true;
            emit RegisterUser(uId, true, true, msg.sender);
        }

        function addReferrer(address _sponsor, uint _refbonus) external nonReentrant {
            require(_sponsor != address(0), "Invalid");
            require(_sponsor != msg.sender, "YCRY");


            uint _sponsoruserId = _getUserId(_sponsor);
            uint _user_refId = _getuserRefIdBySponsor(msg.sender,_sponsor);
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
                    uId = _getUserId(msg.sender);
                    userDetailsById[uId].refCount = userDetailsById[uId].refCount++;
                    userDetails[msg.sender].refCount = userDetailsById[uId].refCount++;
                    _referraluserId = userDetailsById[uId].userId;

                }else {
                    // user is not registered, register user and add address to User struct
                    registerNewUser(msg.sender,0,0,false,false,true);
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
            uint betsCount = _bIds;

            for(uint i=0; i < betsCount; i++) {
                if(BetIds[i+1].betId == _betId) {
                    if(BetIds[i+1].participant == msg.sender) {
                        console.log("part ",BetIds[i+1].participant);
                        return true;
                    }
                }
            }
            return false;
        }


        function addBet(uint betamount, uint matchId, string memory username, string memory creationtype,uint _betId, address betopener, string memory matchfixture, string memory prediction, string memory bettingteam, uint totalbetparticipantscount ) internal {

            address[] storage _participants = BetIds[_betId].participants;
            _participants.push(msg.sender);

            remainingparticipantscount = totalbetparticipantscount - _participants.length;

            _bIds += 1;
            __bId = _bIds;
            // if(_betId != 0) {
            //     __bId = _betId;
            //     betcreationType = "OpenBet";
            //     // if(checkDuplicateBet(_betId)) {
            //     //     revert DuplicateBetNotAllowed();
            //     // }
            // }else {
            //     __bId = _betIds;
            //     betcreationType = "JoinedBet";
            // }


            BetIds[__bId] = Bets({
                bId : __bId,
                matchId : matchId,
                betId: _betId,
                username: username,
                matchfixture : matchfixture,
                openedBy : betopener,
                creationType: creationtype,
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

            if(_balanceOf[msg.sender] < betamount) {
                _balanceOf[msg.sender] += betamount;
                FifaRewardTokenContract.transferFrom(msg.sender, address(this), betamount);
            }

            emit BetEvent(betopener, msg.sender, username, betamount, __bId, matchId);
            // emit OpenBets(msg.sender,msg.sender,username, betamount, betId, matchId, matchfixture, prediction, bettingteam);

        }

        function PlaceBet(uint betamount, uint matchId, string memory username, string memory creationtype, uint _betId, address betopener, string memory matchfixture, string memory prediction, string memory bettingteam, uint totalbetparticipantscount) external nonReentrant {

            if(msg.sender == address(0)) {
                revert Unauthorized();
            }
            if(betamount <= 0) {
                revert InvalidAmount();
            }
            if(_balanceOf[msg.sender] < betamount) {
                require(FifaRewardTokenContract.balanceOf(msg.sender) >= betamount, "IFB");
            }

            userDetails[msg.sender].hasplacedBet = true;
            // check if user is already registered

            if(userDetails[msg.sender].registered == true ) {
                // user is already registered, continue with staking
                // get userId
                uId = _getUserId(msg.sender);
                userDetailsById[uId].betCount = userDetailsById[uId].betCount++;
                userDetails[msg.sender].betCount = userDetailsById[uId].betCount++;
                userDetailsById[uId].hasplacedBet = true;
            }else {
                // user is not registered, register user and add address to User struct and proceed with betting
                registerNewUser(msg.sender,userDetailsById[uId].betCount++,userDetailsById[uId].refCount++,true,true,false);
            }
            addBet(betamount, matchId, username, creationtype, _betId, betopener, matchfixture, prediction, bettingteam, totalbetparticipantscount);

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
        function getBetsMapping(uint256 _betId) internal view returns (Bets memory) {
            return BetIds[_betId];
        }

        // Function to retrieve Referrals by ID
        function getReferralsMapping(uint256 _referralId) internal view returns (Referrals memory) {
            return referralsbyId[_referralId];
        }

        // Function to retrieve Referrals by ID
        function getUsersMapping(uint256 _userId) internal view returns (Users memory) {
            return userDetailsById[_userId];
        }

        function getAllBetIdsCount() external view returns (uint) {
            return _bIds;
        }

        function getAllRefIdsCount() external view returns (uint) {
            return _refIds;
        }

        function getAllUserIdsCount() external view returns (uint) {
            return _userIds;
        }

        function closeBet(uint _betId) internal {
            uint betsCount = _bIds;

            for(uint i=0; i < betsCount; i++) {
                if(BetIds[i+1].betId == _betId) {
                    BetIds[i+1].betstatus = "closed";
                }
            }
        }

        function getBetWinners (uint _betId) external view returns (address[] memory){
            return BetIds[_betId].betwinners;
        }

        function findbetWinners (uint _matchId, string memory betresult) external nonReentrant {
            uint betsCount = _bIds;
            // uint currentIndex = 0;
            // address[] memory betwinners = new address[](betsCount);
            for (uint i = 0; i < betsCount; i++) {
                uint currentId = i + 1;
                if(compareStrings(BetIds[currentId].betstatus, "open")) {
                    if(BetIds[currentId].remainingparticipantscount != 0) {
                        closeBet(currentId);
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

        function paybetWinners (uint _betId,address[] memory betwinners, uint paypercent) public nonReentrant {
            if(msg.sender == address(0)) {
                revert Unauthorized();
            }
            uint betwinnercount = betwinners.length;
            uint _betamount = BetIds[_betId].betamount;
            uint payfee = _betamount * paypercent.div(100);
            uint winnerPay = _betamount - payfee;
            uint mulitWinnersPay = winnerPay.div(betwinnercount);

            if(BetIds[_betId].totalbetparticipantscount == 2) {
                for(uint bw = 0; bw < betwinners.length; bw++) {
                    address betWinner = BetIds[_betId].betwinners[bw];
                    _balanceOf[betWinner] -= winnerPay;
                    FifaRewardTokenContract.transferFrom(address(this),betWinner, winnerPay);
                }
            }else {
                for(uint bw = 0; bw < betwinners.length; bw++) {
                    BetIds[_betId].betwinners[bw];
                    address betWinner = BetIds[_betId].betwinners[bw];
                    _balanceOf[betWinner] -= mulitWinnersPay;
                    FifaRewardTokenContract.transferFrom(address(this),betWinner, mulitWinnersPay);
                }
            }

            closeBet(_betId);
        }
    }