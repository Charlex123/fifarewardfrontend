// SPDX-License-Identifier: MIT

pragma solidity^0.8.9;

import "./FifaRewardToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract FRDStaking is ReentrancyGuard {

    using SafeMath for uint256;
    uint256 private stakeIds;
    address staker = msg.sender;
    address stakedeployer;
    uint timeNow = block.timestamp;
    IERC20 public FifaRewardTokenContract;
    
    constructor(address _FifaRewardTokenAddress) {
        FifaRewardTokenContract = IERC20(_FifaRewardTokenAddress);
        stakedeployer = msg.sender; 
    } 

    struct Users {
        bool hasStake;
        uint stakeCount;
        bool unStaked;
        uint refCount;
        bool wasReferred;
        mapping(address => Stakes) userStakes;
        mapping(address => Referrals) userReferrals;
    }

    struct Stakes {
        uint stakeId;
        uint rewardTime;
        uint stakeDuration;
        uint stakeAmount;
        uint currentstakeReward;
        uint stakeRewardPerDay;
        uint totalstakeReward;
        uint totalReward;
        bool isActive; 
        address stakerAddress;
    }

    struct Referrals {
        address referral;
        address referredby;
        address[] allreferrals;
        address[] firstgenReferrals;
        address[] secondgenReferrals;
        address[] thirdgenReferrals;
    }

    mapping(address => uint256) private _balanceOf;
    mapping(address => Users) private userDetails;
    mapping(address => Stakes) private MyStakes;
    mapping(address => Referrals) private referrals;
    address[] public userAddresses;
    mapping (address => bool) public stakedUsers;
    address[] private downlines;

    event StakedEvent(address indexed staker, uint stake_duration, uint stake_amount, uint stakerewardperDay, uint totalstakeReward, uint total_reward, bool isActive, bool hasStake);
    event WithdrawlEvent(address indexed Withdrawer, uint withdrawAmount, uint withdrawTime, uint256 totalReward, uint256 rewardAmount);
    event AddReferral(address indexed referral, address indexed sponsor);

    function hasStaked(address _staker) public view returns(bool) {
        return userDetails[_staker].hasStake;
    }

    function wasRef_errered(address _staker) public view returns(bool) {
        return userDetails[_staker].wasReferred;
    }

    function myWalletAddress() public view returns(address) {
        return msg.sender;
    }

    function getOwner() public view returns(address) {
        return stakedeployer;
    }
   
    function myTokenBalance() public view returns(uint) {
        return _balanceOf[msg.sender];
    }

    function checkifuserhasStaked(address user_addr) public view returns (bool) {
        return stakedUsers[user_addr];
    }
    
     // modifier to check if caller is owner
    modifier isOwner() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == stakedeployer, "Caller is not owner");
        _;
    }

    // Function to update the reward rate (onlyOwner)
    function showcontractAddress() public view returns(address) {
        return address(this);
    }

    function addReferrer(address _sponsor) public {
        require(_sponsor != address(0), "Sponsor cannot be a zero address");
        require(_sponsor != msg.sender, "You cannot refer yourself");
        
        // check if sponsor is registered already exists
        if(stakedUsers[_sponsor] == false) {
            revert("Sponsor must stake to be valid");
        }else {
            // check if referral already exists
            if(userDetails[msg.sender].userReferrals[msg.sender].referredby == _sponsor) {
                revert("Referral already exists");
            }else {
                // add referrer to sponsor first generation referrals
                userDetails[_sponsor].userReferrals[_sponsor].referral = msg.sender;
                userDetails[msg.sender].userReferrals[msg.sender].referredby = _sponsor;
                userDetails[msg.sender].wasReferred = true;
                userDetails[_sponsor].userReferrals[_sponsor].firstgenReferrals.push(msg.sender);
                userAddresses.push(msg.sender);
                userDetails[_sponsor].userReferrals[_sponsor].allreferrals.push(msg.sender);
                // check if sponsor has upline
                if(userDetails[_sponsor].wasReferred == true ) {
                    address sponsorupline = userDetails[_sponsor].userReferrals[_sponsor].referredby;
                    // add referral to sponsorupline second generation referrals
                    userDetails[sponsorupline].userReferrals[sponsorupline].secondgenReferrals.push(msg.sender);
                    if(userDetails[sponsorupline].wasReferred == true) {
                        address sponsorsponsorupline = userDetails[sponsorupline].userReferrals[sponsorupline].referredby;
                        // add sponsorupline third generation referrals
                        userDetails[sponsorsponsorupline].userReferrals[sponsorsponsorupline].thirdgenReferrals.push(msg.sender);
                    }else {

                    }
                }

                userDetails[_sponsor].refCount++;
                emit AddReferral(msg.sender,_sponsor);
            }
        }
        
    }

    function stake(uint stake_amount, uint stake_duration) external nonReentrant {
        require(staker != address(0), "Staker cannot be a zero address");
        require(stake_amount > 0, "Amount must be greater than 0");
        require(FifaRewardTokenContract.allowance(msg.sender, address(this)) >= stake_amount,
             "Token transfer not approved");
        require(FifaRewardTokenContract.balanceOf(msg.sender) >= stake_amount, "Insufficient FifaRewardToken balance");

        userDetails[msg.sender].hasStake = true;

        if(stake_duration == 30 || stake_duration == 90 || stake_duration == 365 || stake_duration == 1000) {
        
            uint interest_RatePerDay;

            if(stake_duration == 30) {
                interest_RatePerDay = stake_amount.mul(2).div(100);
            }
            else if(stake_duration == 90) {
                interest_RatePerDay = stake_amount.mul(22).div(1000);
            }
            else if(stake_duration == 365) {
                interest_RatePerDay = stake_amount.mul(3).div(100);
            }
            else if(stake_duration == 1000) {
                interest_RatePerDay = stake_amount.mul(35).div(1000);
            }

            stakeIds += 1;
            uint256 stakeId = stakeIds;

            MyStakes[staker] = Stakes({
                stakeId: stakeId,
                rewardTime: timeNow + stake_duration * 1 days,
                stakeDuration: stake_duration,
                stakeAmount: stake_amount,
                currentstakeReward: stake_amount,
                stakeRewardPerDay: interest_RatePerDay,
                totalstakeReward: interest_RatePerDay.mul(stake_duration),
                totalReward: stake_amount.add(userDetails[msg.sender].userStakes[msg.sender].totalstakeReward),
                isActive: true,
                stakerAddress: msg.sender
            });

            userDetails[msg.sender].stakeCount++;
            userDetails[msg.sender].hasStake = true;
            
            uint stakerewardperDay = userDetails[msg.sender].userStakes[msg.sender].stakeRewardPerDay;
            uint total_reward = userDetails[msg.sender].userStakes[msg.sender].totalReward;
            uint totalstake_reward = userDetails[msg.sender].userStakes[msg.sender].totalstakeReward;
            userDetails[msg.sender].stakeCount++;
            stakedUsers[msg.sender] = true;
            userAddresses.push(msg.sender);
            
            // transfer tokens to contract
            FifaRewardTokenContract.transferFrom(msg.sender, address(this), stake_amount);
            // updateusertokenbalance
            _balanceOf[msg.sender] += stake_amount;
            
            emit StakedEvent(staker, stake_duration, stake_amount, stakerewardperDay, totalstake_reward, total_reward, true, true);
        }else {
            revert("invalid stake period");
        }

        
     }

    function getuserCount() public view returns (uint) {
        return userAddresses.length;
    }

    function calcReward() public view returns (uint totaluserreward_) {
        require(msg.sender != address(0),"Zero addresses are not accepted");
        
        if(hasStaked(msg.sender) == false){
         revert("No active stake found");
        }else {
            // get user stake duration 
            uint userstakereward = userDetails[msg.sender].userStakes[msg.sender].totalReward;
            uint totaluserreward;
            // check if user has referrals
            if(userDetails[msg.sender].userReferrals[msg.sender].allreferrals.length > 0) {
                // get sum of ref bonuses
                uint totalfirstgenrefbonus = 0;
                uint totalsecondgenrefbonus = 0;
                uint totalthirdgenrefbonus = 0;

                if(userDetails[msg.sender].userReferrals[msg.sender].firstgenReferrals.length > 0) {
                // check for first level generation referrals
                    for(uint8 i = 0; i <= userDetails[msg.sender].userReferrals[msg.sender].firstgenReferrals.length; i++) {
                        address firstgenref = userDetails[msg.sender].userReferrals[msg.sender].firstgenReferrals[i];
                        // check if referral has active stake
                        if(userDetails[firstgenref].hasStake == true) {
                            // get referral stake amount
                            uint256 firstgenrefstakeAmt = userDetails[firstgenref].userStakes[msg.sender].stakeAmount;
                            uint firstgenrefbonus = firstgenrefstakeAmt.mul(5).div(1000);
                            totalfirstgenrefbonus += firstgenrefbonus;
                        }
                    }
                }
                if(userDetails[msg.sender].userReferrals[msg.sender].secondgenReferrals.length > 0) {
                // check for first level generation referrals
                    for(uint8 i = 0; i <= userDetails[msg.sender].userReferrals[msg.sender].secondgenReferrals.length; i++) {
                        address secondgenref = userDetails[msg.sender].userReferrals[msg.sender].secondgenReferrals[i];
                        // check if referral has active stake
                        if(userDetails[secondgenref].hasStake == true) {
                            // get referral stake amount
                            uint256 secondgenrefstakeAmt = userDetails[secondgenref].userStakes[msg.sender].stakeAmount;
                            uint secondgenrefbonus = secondgenrefstakeAmt.mul(5).div(1000);
                            totalsecondgenrefbonus += secondgenrefbonus;
                        }
                    }
                }
                if(userDetails[msg.sender].userReferrals[msg.sender].thirdgenReferrals.length > 0) {
                // check for first level generation referrals
                    for(uint8 i = 0; i <= userDetails[msg.sender].userReferrals[msg.sender].thirdgenReferrals.length; i++) {
                        address thirdgenref = userDetails[msg.sender].userReferrals[msg.sender].thirdgenReferrals[i];
                        // check if referral has active stake
                        if(userDetails[thirdgenref].hasStake == true) {
                            // get referral stake amount
                            uint256 thirdgenrefstakeAmt = userDetails[thirdgenref].userStakes[msg.sender].stakeAmount;
                            uint thirdgenrefbonus = thirdgenrefstakeAmt.mul(5).div(1000);
                            totalthirdgenrefbonus += thirdgenrefbonus;
                        }
                    }
                }
            totaluserreward = userstakereward.add(totalfirstgenrefbonus).add(totalsecondgenrefbonus).add(totalthirdgenrefbonus);
            totaluserreward_ = totaluserreward;
            uint tRewards = totaluserreward_;
            return tRewards;
            }else {
                return  userstakereward;
            }
        }
    }

    function withdrawStake() external nonReentrant {
        if(hasStaked(msg.sender) == false) {
            revert("You must have stake to withdraw");
        }else {
                
            if(timeNow >= userDetails[msg.sender].userStakes[msg.sender].rewardTime) {
                uint userstakereward = userDetails[msg.sender].userStakes[msg.sender].totalReward;
                uint WithdrawTime = timeNow;
                address Withdrawer = msg.sender;
                
                uint totaluserreward;
                // check if user has referrals
                if(userDetails[msg.sender].userReferrals[msg.sender].allreferrals.length > 0) {
                    uint totalfirstgenrefbonus = 0;
                    uint totalsecondgenrefbonus = 0;
                    uint totalthirdgenrefbonus = 0;

                    if(userDetails[msg.sender].userReferrals[msg.sender].firstgenReferrals.length > 0) {
                    // check for first level generation referrals
                        for(uint8 i = 0; i <= userDetails[msg.sender].userReferrals[msg.sender].firstgenReferrals.length; i++) {
                            address firstgenref = userDetails[msg.sender].userReferrals[msg.sender].firstgenReferrals[i];
                            // check if referral has active stake
                            if(userDetails[firstgenref].hasStake == true) {
                                // get referral stake amount
                                uint256 firstgenrefstakeAmt = userDetails[firstgenref].userStakes[msg.sender].stakeAmount;
                                uint firstgenrefbonus = firstgenrefstakeAmt.mul(5).div(1000);
                                totalfirstgenrefbonus += firstgenrefbonus;
                            }
                        }
                    }
                    if(userDetails[msg.sender].userReferrals[msg.sender].secondgenReferrals.length > 0) {
                    // check for first level generation referrals
                        for(uint8 i = 0; i <= userDetails[msg.sender].userReferrals[msg.sender].secondgenReferrals.length; i++) {
                            address secondgenref = userDetails[msg.sender].userReferrals[msg.sender].secondgenReferrals[i];
                            // check if referral has active stake
                            if(userDetails[secondgenref].hasStake == true) {
                                // get referral stake amount
                                uint256 secondgenrefstakeAmt = userDetails[secondgenref].userStakes[msg.sender].stakeAmount;
                                uint secondgenrefbonus = secondgenrefstakeAmt.mul(5).div(1000);
                                totalsecondgenrefbonus += secondgenrefbonus;
                            }
                        }
                    }
                    if(userDetails[msg.sender].userReferrals[msg.sender].thirdgenReferrals.length > 0) {
                    // check for first level generation referrals
                        for(uint8 i = 0; i <= userDetails[msg.sender].userReferrals[msg.sender].thirdgenReferrals.length; i++) {
                            address thirdgenref = userDetails[msg.sender].userReferrals[msg.sender].thirdgenReferrals[i];
                            // check if referral has active stake
                            if(userDetails[thirdgenref].hasStake == true) {
                                // get referral stake amount
                                uint256 thirdgenrefstakeAmt = userDetails[thirdgenref].userStakes[msg.sender].stakeAmount;
                                uint thirdgenrefbonus = thirdgenrefstakeAmt.mul(5).div(1000);
                                totalthirdgenrefbonus += thirdgenrefbonus;
                            }
                        }
                    }
                totaluserreward = userstakereward.add(totalfirstgenrefbonus).add(totalsecondgenrefbonus).add(totalthirdgenrefbonus);
                
                }else {
                    totaluserreward = userstakereward;
                }

                uint stake_Amount = userDetails[msg.sender].userStakes[msg.sender].stakeAmount;
                uint rewardAmount = totaluserreward - stake_Amount;
                
                // userDetails[msg.sender].stakeCount--;
                // userDetails[msg.sender].userStakes[msg.sender].Stakes--;
                userDetails[msg.sender].userStakes[msg.sender].isActive = false;

                FifaRewardTokenContract.transfer(msg.sender, stake_Amount);
                FifaRewardTokenContract.transfer(msg.sender, rewardAmount);

                emit WithdrawlEvent(Withdrawer, totaluserreward, WithdrawTime,totaluserreward, totaluserreward);
            }else {
                uint userstakereward = userDetails[msg.sender].userStakes[msg.sender].totalReward;
                uint WithdrawTime = timeNow;
                address Withdrawer = msg.sender;
                
                uint totaluserreward;
                // check if user has referrals
                if(userDetails[msg.sender].userReferrals[msg.sender].allreferrals.length > 0) {
                    uint totalfirstgenrefbonus = 0;
                    uint totalsecondgenrefbonus = 0;
                    uint totalthirdgenrefbonus = 0;

                    if(userDetails[msg.sender].userReferrals[msg.sender].firstgenReferrals.length > 0) {
                    // check for first level generation referrals
                        for(uint8 i = 0; i <= userDetails[msg.sender].userReferrals[msg.sender].firstgenReferrals.length; i++) {
                            address firstgenref = userDetails[msg.sender].userReferrals[msg.sender].firstgenReferrals[i];
                            // check if referral has active stake
                            if(userDetails[firstgenref].hasStake == true) {
                                // get referral stake amount
                                uint256 firstgenrefstakeAmt = userDetails[firstgenref].userStakes[msg.sender].stakeAmount;
                                uint firstgenrefbonus = firstgenrefstakeAmt.mul(5).div(100);
                                totalfirstgenrefbonus += firstgenrefbonus;
                            }
                        }
                    }
                    if(userDetails[msg.sender].userReferrals[msg.sender].secondgenReferrals.length > 0) {
                    // check for first level generation referrals
                        for(uint8 i = 0; i <= userDetails[msg.sender].userReferrals[msg.sender].secondgenReferrals.length; i++) {
                            address secondgenref = userDetails[msg.sender].userReferrals[msg.sender].secondgenReferrals[i];
                            // check if referral has active stake
                            if(userDetails[secondgenref].hasStake == true) {
                                // get referral stake amount
                                uint256 secondgenrefstakeAmt = userDetails[secondgenref].userStakes[msg.sender].stakeAmount;
                                uint secondgenrefbonus = secondgenrefstakeAmt.mul(5).div(100);
                                totalsecondgenrefbonus += secondgenrefbonus;
                            }
                        }
                    }
                    if(userDetails[msg.sender].userReferrals[msg.sender].thirdgenReferrals.length > 0) {
                    // check for first level generation referrals
                        for(uint8 i = 0; i <= userDetails[msg.sender].userReferrals[msg.sender].thirdgenReferrals.length; i++) {
                            address thirdgenref = userDetails[msg.sender].userReferrals[msg.sender].thirdgenReferrals[i];
                            // check if referral has active stake
                            if(userDetails[thirdgenref].hasStake == true) {
                                // get referral stake amount
                                uint256 thirdgenrefstakeAmt = userDetails[thirdgenref].userStakes[msg.sender].stakeAmount;
                                uint thirdgenrefbonus = thirdgenrefstakeAmt.mul(5).div(100);
                                totalthirdgenrefbonus += thirdgenrefbonus;
                            }
                        }
                    }
                totaluserreward = userstakereward.add(totalfirstgenrefbonus).add(totalsecondgenrefbonus).add(totalthirdgenrefbonus);
                
                }else {
                    totaluserreward = userstakereward;
                }

                uint twentyfivepercentwithdrawal = totaluserreward.mul(25).div(100);
                uint256 totalAmount = totaluserreward.sub(twentyfivepercentwithdrawal);
                uint stake_Amount = userDetails[msg.sender].userStakes[msg.sender].stakeAmount;
                uint rewardAmount = totalAmount - stake_Amount;
                
                // userDetails[msg.sender].stakeCount--;
                // userDetails[msg.sender].userStakes[msg.sender].Stakes--;
                userDetails[msg.sender].userStakes[msg.sender].isActive = false;

                FifaRewardTokenContract.transfer(msg.sender, stake_Amount);
                FifaRewardTokenContract.transfer(msg.sender, rewardAmount);

                // update userBalance
                _balanceOf[msg.sender] -= stake_Amount;

                emit WithdrawlEvent(Withdrawer, stake_Amount, WithdrawTime,totaluserreward,rewardAmount);
                
            }
            
        }           
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }



}