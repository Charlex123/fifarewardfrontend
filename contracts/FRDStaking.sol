// SPDX-License-Identifier: MIT

pragma solidity^0.8.9;

import "./FifaRewardToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract FRDStaking is ReentrancyGuard {

    error createTokenFirst();
    error biddingTimeHasPassed();
    error minimumbiddingAmount();
    error priceMustBeGreaterThanZero();
    error Unauthorized();
    error InvalidAmount();
    error AccountNotRegistered();
    error referralAlreadyExits();
    error sponsorMustHaveActiveStakeToRefer();
    error YouMustHaveActiveStakeToWithdraw();
    error AmountIsLessThanMinimumWithdrawAmount();

    using SafeMath for uint256;
    uint256 private _stakeIds;
    uint256 private _refIds;
    uint256 private _userIds;
    address staker = msg.sender;
    address stakedeployer;
    uint withFeePercent = 5;
    uint amtToWIthdraw;
    uint amtRemaining;
    
    uint timeNow = block.timestamp;
    IERC20 public FifaRewardTokenContract;

    constructor(address _FifaRewardTokenAddress) {
        FifaRewardTokenContract = IERC20(_FifaRewardTokenAddress);
        stakedeployer = msg.sender; 
    } 

    struct Users {
        uint userId;
        bool hasStaked;
        uint stakeCount;
        bool hasActiveStake;
        uint refCount;
        bool registered;
        bool wasReferred;
        address walletaddress;
    }

    struct Stakes {
        uint stakeId;
        uint rewardTime;
        uint stakeDuration;
        uint profitpercent;
        uint stakeAmount;
        uint currentstakeReward;
        uint stakeRewardPerDay;
        uint totalstakeReward;
        uint totalReward;
        bool isActive; 
        address stakerAddress;
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
    mapping(address => Users) private userDetails;
    mapping(uint256 => Users) private userDetailsById;
    mapping(address => Stakes) private MyStakes;
    mapping(uint256 => Stakes) private MyStakeIds;
    mapping(address => Referrals) private referrals;
    mapping(uint256 => Referrals) private referralsbyId;

    event RegisterUser(uint indexed userId, bool registered, bool wasReferred, address walletaddress);
    event StakedEvent(uint indexed stakeId,address indexed staker, uint stake_duration, uint stake_amount, uint stakerewardperDay, uint totalstakeReward, uint total_reward, bool isActive, bool hasStaked);
    event WithdrawlEvent(address indexed Withdrawer, uint withdrawAmount, uint withdrawTime, uint256 totalReward, uint256 rewardAmount);
    event AddReferral(uint indexed refId,uint sponsorUserId, uint referralUserId, address referral, address sponsor, address[] referrals);

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

    function getuserStakeId(address _useraddress) public view returns(uint) {
        uint allstakesCount = _stakeIds;
        if(_useraddress == address(0)) {
            revert Unauthorized();
        }else {
            uint _stakeId;
            for(uint i = 0; i < allstakesCount; i++) {
                if(MyStakeIds[i+1].stakerAddress == _useraddress) {
                    _stakeId = MyStakeIds[i+1].stakeId;
                }
            }
            return _stakeId;
        }
    }

    function getuserRefBonus(address _useraddress) public view returns(uint totalrefbonus) {
        // get user referrals
        address[] memory userReferrals = getuserReferrals(_useraddress);
        uint refCount = userReferrals.length;
        uint[] memory stakeAmounts = new uint[](refCount);
        uint[] memory _refbonus_ = new uint[](refCount);
        // Check active stakes for each referral and sum their stake amounts
        uint totalrefBonus = 0;
        uint _refBonus = 0;
        for(uint j = 0; j < refCount; j++) {
            // get user stake & referral Id 
            uint refStakeId = getuserStakeId(userReferrals[j]);
            uint refId = getuserRefId(userReferrals[j]);
            if (MyStakeIds[refStakeId].isActive) {
                stakeAmounts[j] = MyStakeIds[refStakeId].stakeAmount;
                _refbonus_[j] = referralsbyId[refId].refbonus;
                _refBonus = stakeAmounts[j].mul(_refbonus_[j]);

                totalrefBonus += _refBonus;
            }
        }
        return totalrefBonus;
    }

    function hasStaked(address _useraddress) public view returns(bool) {
        uint _userId = getUserId(_useraddress);
        return userDetailsById[_userId].hasStaked;
    }

    function wasRef_errered(address _useraddress) public view returns(bool) {
        uint _userId = getUserId(_useraddress);
        return userDetailsById[_userId].wasReferred;
    }

    function myWalletAddress() public view returns(address) {
        return msg.sender;
    }

    function getOwner() public view returns(address) {
        return stakedeployer;
    }

    // function sendToken(
    //     address _to,
    //     address _ca,
    //     uint256 _amount
    // ) external isOwner {
    //     IBEP20 token = IBEP20(_ca);
    //     token.transfer(_to, _amount);
    // }
   
    function myTokenBalance() public view returns(uint) {
        return _balanceOf[msg.sender];
    }

    // function checkifuserhasStaked(address user_addr) public view returns (bool) {
    //     return stakedUsers[user_addr];
    // }
    
     // modifier to check if caller is owner
    modifier isOwner() {
        if(msg.sender == stakedeployer)
            revert Unauthorized();
        _;
    }

    function addReferrer(address _sponsor, uint _refbonus) external nonReentrant {
        require(_sponsor != address(0), "Sponsor cannot be a zero address");
        require(_sponsor != msg.sender, "You cannot refer yourself");
        
         
        uint _sponsoruserId = getUserId(_sponsor);
        uint _user_refId = getuserRefIdBySponsor(msg.sender,_sponsor);
        // check if sponsor is has an active stake 
        if(MyStakeIds[_sponsoruserId].isActive == false) {
            revert sponsorMustHaveActiveStakeToRefer();
        }else {
            // check if user has been referred by this sponsor before
            if(referralsbyId[_user_refId].sponsor == _sponsor) {
                revert referralAlreadyExits();
            }else {
                address[] storage  _referrals = referrals[_sponsor].referrals;
                _referrals.push(msg.sender);
                // check if user is already registered
                uint _referraluserId;
                if(userDetails[msg.sender].registered == true ) {
                    // user is already registered, do nothing
                     _referraluserId = userDetails[msg.sender].userId;
                }else {
                    // user is not registered, register user and add address to User struct
                    _userIds += 1;
                    uint _userId = _userIds; 
                    userDetailsById[_userId] = Users({
                        userId:_userId,
                        hasStaked: false,
                        stakeCount:0,
                        hasActiveStake:false,
                        refCount:0,
                        registered: true,
                        wasReferred: true,
                        walletaddress: msg.sender
                    });

                    _referraluserId = _userId;
                }

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
        
    }

    function stake(uint stake_amount, uint stake_duration, uint profitpercent) external nonReentrant {
        if(staker == address(0))
            revert Unauthorized();
        if(stake_amount <= 0) 
            revert InvalidAmount();
        require(FifaRewardTokenContract.allowance(msg.sender, address(this)) >= stake_amount,
             "Token transfer not approved");
        require(FifaRewardTokenContract.balanceOf(msg.sender) >= stake_amount, "Insufficient FifaRewardToken balance");

        userDetails[msg.sender].hasStaked = true;
        // check if user is already registered
        if(userDetails[msg.sender].registered == true ) {
            // user is already registered, continue with staking
            // get userId
            uint u_Id = getUserId(msg.sender);
            userDetailsById[u_Id].stakeCount++;
            userDetailsById[u_Id].hasStaked = true;
        }else {
            // user is not registered, register user and add address to User struct and proceed with staking
            _userIds += 1;
            uint _userId = _userIds;
            uint _stakeCount = userDetailsById[_userId].stakeCount++;
            uint _refCount = userDetailsById[_userId].refCount++;
            console.log("user Id +++",_stakeCount);
            console.log("ref Id +++",userDetailsById[_userId].refCount++);
            userDetailsById[_userId] = Users({
                userId:_userId,
                hasStaked: true,
                stakeCount: _stakeCount,
                hasActiveStake:true,
                refCount:_refCount,
                registered: true,
                wasReferred: false,
                walletaddress: msg.sender
            });
            emit RegisterUser(_userId, true, true, msg.sender);
        }
        

        
        uint interest_RatePerDay = stake_amount.mul(profitpercent).div(1000);

        _stakeIds += 1;
        uint256 stakeId = _stakeIds;

        uint totalstake_reward = interest_RatePerDay.mul(stake_duration);
        uint total_reward = stake_amount.add(totalstake_reward);
        MyStakeIds[stakeId] = Stakes({
            stakeId: stakeId,
            rewardTime: timeNow + (stake_duration * 1 days),
            stakeDuration: stake_duration,
            profitpercent: profitpercent.div(1000),
            stakeAmount: stake_amount,
            currentstakeReward: stake_amount,
            stakeRewardPerDay: interest_RatePerDay,
            totalstakeReward: totalstake_reward,
            totalReward: total_reward,
            isActive: true,
            stakerAddress: msg.sender
        });

        // updateusertokenbalance
        _balanceOf[msg.sender] += stake_amount;
        
        // transfer tokens to contract
        FifaRewardTokenContract.transferFrom(msg.sender, address(this), stake_amount);
        
        emit StakedEvent(stakeId, staker, stake_duration ,stake_amount, interest_RatePerDay, totalstake_reward, total_reward, true, true);
    }

    
    function calcReward(uint _stakeId) public view returns (uint reward) {
        require(msg.sender != address(0),"Zero addresses are not accepted");
        
        // get userId
        uint _userId = getUserId(msg.sender);
        // Check if the user exists and has referrals
        if(userDetailsById[_userId].registered == false) {
            revert AccountNotRegistered();
        }
       
        uint totalReward = 0;
        // get stake details of the user
        if(MyStakeIds[_stakeId].stakerAddress == msg.sender) {
            uint refCount = userDetailsById[_userId].refCount;
            uint staketotalReward = MyStakeIds[_stakeId].totalReward;
            if(refCount > 0) {
                uint refbonus = getuserRefBonus(msg.sender);
                totalReward = staketotalReward.add(refbonus);
            }else {
                totalReward = staketotalReward;
            }
        }else {
            revert Unauthorized();
        }
        
        return totalReward;
    }

    function EstimateReward(uint stakeamount, uint duration, uint profitpercent) public view returns (uint) {
        require(msg.sender != address(0),"Invalid address");
        uint estprof = stakeamount.mul(duration).mul(profitpercent).div(1000);
        return stakeamount.add(estprof);
        
    }

    function getMinWithdrawAmount(uint _stakeId) public view returns (uint) {
        require(msg.sender != address(0),"Invalid address");
        // get userId
        uint _userId = getUserId(msg.sender);
        // Check if the user exists and has referrals
        if(userDetailsById[_userId].registered == false) {
            revert AccountNotRegistered();
        }
        uint minWithAmnt = 0;
        if(MyStakeIds[_stakeId].stakerAddress == msg.sender) {
            if(MyStakeIds[_stakeId].isActive) {
                uint profitperc = MyStakeIds[_stakeId].profitpercent;
                uint stakeAmt = MyStakeIds[_stakeId].stakeAmount;
                uint minstakedur = 180 * 1 days;
                minWithAmnt = stakeAmt.mul(minstakedur).mul(profitperc);
            }
        }
        return minWithAmnt;
    }

    function withdrawStake(uint _stakeId, uint _withdrawAmt) external nonReentrant {
        require(msg.sender != address(0),"Zero addresses are not accepted");
        
        // get userId
        uint _userId = getUserId(msg.sender);
        // Check if the user exists and has referrals
        if(userDetailsById[_userId].registered == false) {
            revert AccountNotRegistered();
        }

        uint totalReward = 0;
        // get stake details of the user
        if(MyStakeIds[_stakeId].stakerAddress == msg.sender) {
            if(MyStakeIds[_stakeId].isActive) {
                uint refCount = userDetailsById[_userId].refCount;
                uint stakeReward = MyStakeIds[_stakeId].totalstakeReward;
                uint totalstakeReward = MyStakeIds[_stakeId].totalReward;
                uint minstaketime = 180 * 1 days;
                uint stakeduration = MyStakeIds[_stakeId].stakeDuration;
                uint minstakedur = timeNow.add(minstaketime);
                uint minwithAmt = getMinWithdrawAmount(_stakeId);
                uint withFee = withFeePercent.div(100);
                if(timeNow > minstakedur && timeNow < stakeduration) {
                    if(_withdrawAmt < minwithAmt) {
                        revert AmountIsLessThanMinimumWithdrawAmount();
                    }else {
                        
                        if(refCount > 0) {
                            uint refbonus = getuserRefBonus(msg.sender);
                            totalReward = stakeReward.add(refbonus);
                            amtToWIthdraw = _withdrawAmt.sub(withFee);
                            amtRemaining = stakeReward.sub(amtToWIthdraw);
                        }else {
                            amtToWIthdraw = _withdrawAmt.sub(withFee);
                            amtRemaining = stakeReward.sub(amtToWIthdraw);
                        }
                    }
                }else if(timeNow > stakeduration) {
                    // amtToWIthdraw = 
                    if(refCount > 0) {
                        uint refbonus = getuserRefBonus(msg.sender);
                        totalReward = totalstakeReward.add(refbonus);
                    }else {
                        totalReward = totalstakeReward;
                    }
                }
                
            }else {
                revert YouMustHaveActiveStakeToWithdraw();
            }
        }else {
            revert Unauthorized();
        }
        
    }

    function getContractBalance() public view isOwner returns (uint256) {
        return address(this).balance;
    }

    function loadAllStakes() external view returns (Stakes[] memory) {
        uint stakesCount = _stakeIds;
        uint currentIndex = 0;

        Stakes[] memory stakes = new Stakes[](stakesCount);
        for (uint i = 0; i < stakesCount; i++) {
            uint currentId = i + 1;
            Stakes storage currentStake = MyStakeIds[currentId];
            stakes[currentIndex] = currentStake;
            currentIndex += 1;
        }
        return stakes;
    }

    function GetAllUsers() external view returns (Users[] memory) {
        uint usersCount = _userIds;
        uint currentIndex = 0;

        Users[] memory users = new Users[](usersCount);
        for (uint i = 0; i <usersCount; i++) {
            uint currentId = i + 1;
            Users storage currentUser = userDetailsById[currentId];
            users[currentIndex] = currentUser;
            currentIndex += 1;
        }
        return users;
    }

    function GetAllReferrals() external view returns (Referrals[] memory) {
        uint refCount = _refIds;
        uint currentIndex = 0;

        Referrals[] memory _referrals = new Referrals[](refCount);
        for (uint i = 0; i <refCount; i++) {
            uint currentId = i + 1;
            Referrals storage currentRef = referralsbyId[currentId];
            _referrals[currentIndex] = currentRef;
            currentIndex += 1;
        }
        return _referrals;
    }

    function getUserStakeCount() public view returns(uint) {
        uint totalStakeIds = _stakeIds;
        uint stakeCount = 0;

        for(uint i = 0; i < totalStakeIds; i++) {
            if(MyStakeIds[i+1].stakerAddress == msg.sender) {
            stakeCount += 1;
            }
        }
        return stakeCount;
    }

}