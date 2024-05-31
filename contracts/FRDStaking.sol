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

interface IBEP20 {
    function transfer(address _to, uint256 _value) external returns (bool);
}

contract FRDStaking is ReentrancyGuard {

    error createTokenFirst();
    error priceMustBeGreaterThanZero();
    error Unauthorized();
    error InvalidAmount();
    error AccountNotRegistered();
    error referralAlreadyExits();
    error referralrewardalreadyClaimed();
    error sponsorMustHaveActiveStakeToRefer();
    error stakedurationnotCompleted();
    error YouMustHaveActiveStakeToWithdraw();
    error AmountIsLessThanMinimumWithdrawAmount();
    error AmountIsMoreThanStakeReward();
    error downlinealreadyRegistered();
    error minWithdrawalTimeNotReached();

    using SafeMath for uint256;
    uint256 private nextStakeId;
    uint256 public nextReferralRewardId;
    uint256 private nextUserId;
    address stakedeployer;
    uint withFeePercent = 5;
    uint amtToWIthdraw;
    uint amtRemaining;
    address public feeWallet = 0xbCCEb2145266639E0C39101d48B79B6C694A84Dc;
    uint uId;
    IERC20 public FifaRewardTokenContract;

    constructor(address _FifaRewardTokenAddress) {
        FifaRewardTokenContract = IERC20(_FifaRewardTokenAddress);
        stakedeployer = msg.sender; 
    } 

    struct User {
        uint userId;
        bool hasStaked;
        uint stakeCount;
        bool hasActiveStake;
        uint refCount;
        bool registered;
        bool wasReferred;
        address sponsor;
        address walletaddress;
        address[] referrals;
    }

    struct Stake {
        uint stakeId;
        uint rewardTime;
        uint stakeDuration;
        uint stakeTime;
        uint profitpercent;
        uint stakeAmount;
        uint amountRemaining;
        uint amountWithdrawn;
        uint currentstakeReward;
        uint stakeRewardPerDay;
        uint stakeReward;
        uint totalReward;
        bool isActive; 
        address stakerAddress;
    }

    struct ReferralReward {
        uint refrewardId;
        uint stakeId;
        address sponsor;
        uint rewardamount;
        bool rewardrecieved;
    }

    mapping(uint256 => User) private userDetailsById;
    mapping(address => Stake) private MyStakes;
    mapping(uint256 => Stake) private MyStakeIds;
    mapping(address => uint[]) private userCreatedStakeIds; // Mapping of user addresses to the betIds they created
    mapping(uint => address) private userIdToAddress;
    mapping(address => User) private users; // Mapping of user addresses to user data
    mapping(uint => ReferralReward) private referralrewardIds; 
    mapping(address => ReferralReward) private referralrewards; 

    // Event to log when a referral reward is claimed
    event ReferralRewardClaimed(address indexed sponsor, uint amount);
    event UserRegistered(uint indexed userId, address useraddress);
    event StakedEvent(uint indexed stakeId,address indexed staker, uint stake_duration);
    event WithdrawlEvent(address indexed Withdrawer, uint withdrawAmount, uint withdrawTime, uint256 amountToWithdraw, uint256 amountRemaining);
    event AddReferral(uint indexed refId,uint sponsorUserId, uint referralUserId, address referral, address sponsor, address[] referrals);

    // modifier to check if caller is owner
    modifier isOwner() {
        if(msg.sender != stakedeployer)
            revert("Unauthorized");
        _;
    }
    
    function registerUser(bool hasstaked, uint stakeCount, bool hasactivestake, uint refCount, bool registered, bool wasReferred,address sponsor, address useraddress) internal {
        nextUserId++;
        users[useraddress] = User(nextUserId, hasstaked, stakeCount, hasactivestake, refCount, registered, wasReferred, sponsor, useraddress, new address[](0));
        userIdToAddress[nextUserId] = useraddress;
        // Emit event for user registration
        emit UserRegistered(nextUserId, msg.sender);
    }

    function hasStaked(address _useraddress) public view returns(bool) {
        return users[_useraddress].hasStaked;
    }

    function wasRef_errered(address _useraddress) public view returns(bool) {
        return users[_useraddress].wasReferred;
    }

    function myWalletAddress() public view returns(address) {
        return msg.sender;
    }

    function getOwner() public view returns(address) {
        return stakedeployer;
    }

    function hasActiveStake(address _useraddress) public view returns(bool) {
        return users[_useraddress].hasActiveStake;
    }

    function myTokenBalance(address wallet) public view returns(uint) {
        return FifaRewardTokenContract.balanceOf(wallet);
    }

    function addReferral(address sponsorAddress, address downlineAddress) public {
        // Ensure the sponsor is a registered user
        require(users[sponsorAddress].registered, "Sponsor is not a registered user");


        // Register user if not already registered
        if (users[downlineAddress].registered == true) {
            revert("downline already registered");
        }else {
            registerUser(false, 0, false, 0, true, true, sponsorAddress, downlineAddress);
        }
        // Ensure the downline is not already referred by the sponsor
        require(!isReferral(sponsorAddress, downlineAddress), "Downline is already referred by the sponsor");

        // Add downline address to the referrals array of the sponsor's User struct
        users[sponsorAddress].referrals.push(downlineAddress);
    }

    // Function to check if a user is already referred by a sponsor
    function isReferral(address sponsorAddress, address downlineAddress) internal view returns (bool) {
        address[] memory referrals = users[sponsorAddress].referrals;
        for (uint i = 0; i < referrals.length; i++) {
            if (referrals[i] == downlineAddress) {
                return true;
            }
        }
        return false;
    }


    function _rewardSponsorIfDownline(address user, uint stakeamount, uint stakeId) internal {
        address sponsor = users[user].sponsor;
        if (sponsor != address(0)) {
            // Calculate referral reward (2% of the stake amount)
            uint referralReward = (stakeamount * 2) / 100;
            // Transfer referral reward to the sponsor

            // Check if the contract has enough tokens to transfer the reward
            require(FifaRewardTokenContract.balanceOf(stakedeployer) >= referralReward, "Contract does not have enough tokens");
    
            // check if sponsor has received referral reward already
            if(referralrewards[user].rewardrecieved) {
                revert("referral reward already claimed");
            }

            nextReferralRewardId++;
            referralrewardIds[nextReferralRewardId] = ReferralReward(nextReferralRewardId, stakeId, sponsor, referralReward, true);
            uint balof = FifaRewardTokenContract.balanceOf(sponsor);
            balof += referralReward;
            // Assuming FifaRewardTokenContract has a transfer function
            FifaRewardTokenContract.transfer(sponsor,referralReward);
            // Emit event for referral reward claimed
            emit ReferralRewardClaimed(sponsor, referralReward);
        }
    }

    function getReferrals(address sponsor) public view returns(address[] memory) {
        return users[sponsor].referrals;
    }

    function getsponsorReferralRewards(address sponsor) public view returns(ReferralReward[] memory) {
        uint totalRefRewards = nextReferralRewardId;
        uint currentIndex = 0;

        ReferralReward[] memory sponsorRewards = new ReferralReward[](totalRefRewards);
        for (uint i = 1; i <= totalRefRewards; i++) {
            if(referralrewardIds[i + 1].sponsor == sponsor) {
                ReferralReward storage currentRefReward = referralrewardIds[i+1];
                sponsorRewards[i+1] = currentRefReward;
                currentIndex += 1;
            }
        }
        return sponsorRewards;
    }

    // Function to get user registration details using user's wallet address
    function getUserRegistrationDetails(address _user) public view returns (User memory) {
        return users[_user];
    }

    // Function to list all the registered users' details
    function listRegisteredUsers() public view returns (User[] memory) {
        User[] memory userList = new User[](nextUserId);
        for (uint i = 1; i <= nextUserId; i++) {
            address userAddress = userIdToAddress[i];
            userList[i - 1] = users[userAddress];
        }
        return userList;
    }

    function stake(uint stake_amount, uint stake_duration, uint profitpercent) public nonReentrant {
        nextStakeId++;
        if(msg.sender == address(0))
            revert("Unauthorized");
        if(stake_amount <= 0) 
            revert("invalid amount");
        require(FifaRewardTokenContract.allowance(msg.sender, address(this)) >= stake_amount,
             "Token transfer not approved");
        require(FifaRewardTokenContract.balanceOf(msg.sender) >= stake_amount, "Insufficient Token Balance");

        users[msg.sender].hasStaked = true;
        // check if user is already registered
        // Register user if not already registered
        if (!users[msg.sender].registered) {
            registerUser(true, 0, true, 0, true, false, address(0), msg.sender);
        }
        
        uint interest_RatePerDay = stake_amount.mul(profitpercent).div(1000);

        uint stake_reward = interest_RatePerDay.mul(stake_duration);
        uint total_reward = stake_amount.add(stake_reward);
        MyStakeIds[nextStakeId] = Stake({
            stakeId: nextStakeId,
            rewardTime: block.timestamp + (stake_duration * 1 minutes),
            stakeDuration: stake_duration * 1 minutes,
            stakeTime: block.timestamp,
            profitpercent: profitpercent,
            stakeAmount: stake_amount,
            amountRemaining: 0,
            amountWithdrawn: 0,
            currentstakeReward: stake_amount,
            stakeRewardPerDay: interest_RatePerDay,
            stakeReward: stake_reward,
            totalReward: total_reward,
            isActive: true,
            stakerAddress: msg.sender
        });

        // Map user address to the new stakeId
        userCreatedStakeIds[msg.sender].push(nextStakeId);
        users[msg.sender].stakeCount = userCreatedStakeIds[msg.sender].length;

        // Perform the token transfer from staker to the contract
        require(FifaRewardTokenContract.transferFrom(msg.sender, address(this), stake_amount), "Token transfer failed");

        // Check if the user is a downline and reward the sponsor
        _rewardSponsorIfDownline(msg.sender, stake_amount, nextStakeId);
        emit StakedEvent(nextStakeId, msg.sender, stake_duration );
    }

    function calcReward(uint _stakeId) public view returns (uint reward) {
        require(msg.sender != address(0),"Invalid addresses");
        
        // get userId
        if(users[msg.sender].registered == false) {
            revert("account not registered");
        }
       
        uint totalReward = 0;
        // get stake details of the user
        if(MyStakeIds[_stakeId].stakerAddress == msg.sender) {
            uint staketotalReward = MyStakeIds[_stakeId].stakeReward;
            totalReward = staketotalReward;
        }else {
            revert("Unauthorized");
        }
        
        return totalReward;
    }

    function EstimateReward(uint stakeamount, uint duration, uint profitpercent) public view returns (uint) {
        require(msg.sender != address(0),"Invalid address");
        uint estprof = stakeamount.mul(duration).mul(profitpercent).div(1000);
        return estprof;
        
    }

    function getMinWithdrawAmount(uint _stakeId) public view returns (uint) {
        require(msg.sender != address(0),"Invalid address");
        // get userId
        if(users[msg.sender].registered == false) {
            revert("account not registered");
        }
        uint minWithAmnt = 0;
        if(MyStakeIds[_stakeId].stakerAddress == msg.sender) {
            if(MyStakeIds[_stakeId].isActive) {
                uint profitperc = MyStakeIds[_stakeId].profitpercent;
                uint stakeAmt = MyStakeIds[_stakeId].stakeAmount;
                uint minstakedur = 180;
                minWithAmnt = stakeAmt.mul(minstakedur).mul(profitperc).div(1000);
            }
        }
        return minWithAmnt;
    }

    function getMaxWithdrawAmount(uint _stakeId) public view returns (uint) {
        require(msg.sender != address(0),"Invalid address");
        // get userId
        if(users[msg.sender].registered == false) {
            revert("account not registered");
        }
        uint maxWithAmnt = 0;
        if(MyStakeIds[_stakeId].stakerAddress == msg.sender) {
            if(MyStakeIds[_stakeId].isActive) {
                maxWithAmnt = MyStakeIds[_stakeId].totalReward;
            }
        }
        return maxWithAmnt;
    }

    function withdrawStake(uint _stakeId, uint _withdrawAmt) public nonReentrant {
        require(msg.sender != address(0),"Invlid addresses");
        
        // Check if the user exists and has referrals
        if(users[msg.sender].registered == false) {
            revert("account not registered");
        }

        // get stake details of the user
        if(MyStakeIds[_stakeId].stakerAddress == msg.sender) {
            if(MyStakeIds[_stakeId].isActive) {
                uint stakeReward = MyStakeIds[_stakeId].stakeReward;
                uint totalReward = MyStakeIds[_stakeId].totalReward;
                // uint stakeduration = MyStakeIds[_stakeId].stakeDuration;
                uint rewardtime = MyStakeIds[_stakeId].rewardTime;
                uint staketime = MyStakeIds[_stakeId].stakeTime;
                uint amtRem = MyStakeIds[_stakeId].amountRemaining;
                uint minstakedur = staketime + (180 * 1 minutes);
                // uint stakeremTime = stakeduration.sub(minstakedur);
                uint minwithAmt = getMinWithdrawAmount(_stakeId);
                uint withFee = _withdrawAmt.mul(withFeePercent).div(100);
                if(block.timestamp > minstakedur) {
                    if(_withdrawAmt < minwithAmt) {
                        revert("Amount Is Less Than Minimum Withdraw Amount");
                    }else {
                        if(_withdrawAmt > totalReward) {
                            revert("Amount Is More Than Stake Reward");
                        }
                        
                        if(block.timestamp > rewardtime) {
                            if(_withdrawAmt < totalReward) {
                                amtToWIthdraw = _withdrawAmt.sub(withFee);
                                amtRemaining = totalReward.sub(amtRem).sub(amtToWIthdraw);
                            }
                            if(_withdrawAmt == totalReward) {
                                amtRemaining = totalReward;
                                MyStakeIds[_stakeId].isActive = false;
                            }
                        }else {
                            if(_withdrawAmt == totalReward) {
                                revert("stake duration not Completed");
                            }else {
                                amtToWIthdraw = _withdrawAmt.sub(withFee);
                                amtRemaining = stakeReward.sub(amtRem).sub(amtToWIthdraw);
                            }
                        }

                        MyStakeIds[_stakeId].amountRemaining = amtRemaining;
                        MyStakeIds[_stakeId].amountWithdrawn = MyStakeIds[_stakeId].amountWithdrawn + amtToWIthdraw;
                        // update this stake details
                        // uint interest_RatePerDay = stake_amount.mul(profitpercent).div(1000);
                        // MyStakeIds[_stakeId].currentstakeReward = false;
                        // MyStakeIds[_stakeId].stakeRewardPerDay = false;
                        // MyStakeIds[_stakeId].totalstakeReward = false;
                        // MyStakeIds[_stakeId].totalReward = false;
                        
                        
                        FifaRewardTokenContract.transfer(msg.sender, amtToWIthdraw);
                        FifaRewardTokenContract.transfer(feeWallet, withFee);

                        emit WithdrawlEvent(msg.sender, amtToWIthdraw, block.timestamp,amtToWIthdraw, amtRemaining);
                    }
                    
                }else {
                    revert("min withdrawal time not reached");
                }
                
                
                // users[msg.sender].stakeCount--;
                // users[msg.sender].userStakes[msg.sender].Stakes--;
                

            }else {
                revert("You must have active stake to withdraw");
            } 
        }else {
            revert("Unauthorized");
        }
        
    }
    
    function getContractBalance() public view isOwner returns (uint256) {
        return address(this).balance;
    }

    function loadAllStakes() external view returns (Stake[] memory) {
        uint stakesCount = nextStakeId;
        uint currentIndex = 0;

        Stake[] memory stakes = new Stake[](stakesCount);
        for (uint i = 0; i < stakesCount; i++) {
            uint currentId = i + 1;
            Stake storage currentStake = MyStakeIds[currentId];
            stakes[currentIndex] = currentStake;
            currentIndex += 1;
        }
        return stakes;
    }

    
    function loadUserStakes(address _useraddress) external view returns (Stake[] memory) {
        uint stakesCount = nextStakeId;
        uint userStakes = 0;
        uint currentIndex = 0;

        for(uint i = 0; i < stakesCount; i++) {
            if(MyStakeIds[i+1].stakerAddress == _useraddress) {
                userStakes += 1;
            }
        }

        Stake[] memory stakes = new Stake[](userStakes);
        for (uint i = 0; i < userStakes; i++) {
            if(MyStakeIds[i+1].stakerAddress == _useraddress) {
                uint currentId = i + 1;
                Stake storage currentStake = MyStakeIds[currentId];
                stakes[currentIndex] = currentStake;
                currentIndex += 1;
            }
        }
        return stakes;
    }

    function getUserStakeCount(address _useraddress) public view returns(uint) {
        return users[_useraddress].stakeCount;
    }

    function getUserRefCount(address _useraddress) public view returns(uint) {
        return users[_useraddress].refCount;
    }

    function getStakeRemainingTime(uint stakeId) public view returns (uint) {
        uint currentTime = block.timestamp;
        uint rewardTime = MyStakeIds[stakeId].rewardTime;
        
        if (currentTime >= rewardTime) {
            return 0;
        } else {
            return rewardTime - currentTime;
        }
    }

    function transferToken(address receiver) external isOwner nonReentrant {
        uint tokenbal = FifaRewardTokenContract.balanceOf(address(this));
        FifaRewardTokenContract.transfer(receiver,tokenbal);
    }
}