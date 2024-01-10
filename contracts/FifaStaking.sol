// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
contract FifaStaking is
    Initializable,
    ContextUpgradeable,
    OwnableUpgradeable
    
{
    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;
    IERC20Upgradeable public token;
    uint256 public totalStakes;
    uint256 public totalRewards;
    uint256 public minStakingPeriod;
    string public name;
    uint256 public totalDividends;
    uint256 public round;
     struct FEES {
        uint256 unstakingFee;
        uint256 terminationFee;
        uint256 stakingFee;
    }

    struct USER {
        uint256 stakedTokens;
        uint256 round;
        uint256 startTime;
    }

    FEES public fee;
    mapping(address => USER) public stakers;
    mapping(uint256 => uint256) public payouts;
    event STAKED(address indexed staker, uint256 stake, uint256 reward);
    event UNSTAKED(
        address indexed staker,
        address destination,
        uint256 tokens,
        uint256 rewards,
        uint256 fee
    );
    event PAYOUT(uint256 round, uint256 tokens, address sender);
    event CLAIMEDREWARD(
        address indexed staker,
        address destination,
        uint256 reward
    );
    event refPayout(
        address indexed ref,
        address indexed user,
        uint256 amount,
        uint256 time
    );

    error AmountCannotBeZero();
    error RewardAlreadyClaimed();
    error NoRewardsAreCurrentlyAvailable();
    error ThereAreNoStakerYet();
    error YouHaveNotStaked();
    error InvalidWithdrawAmount();

    /**
     * protects the proxy from initialization!
     */

    constructor() {
        _disableInitializers();
    }

    /**
     * initializes the clone
     * @param _owner address of the admin
     * @param _token The token to be staked
     *
     */

    function initialize(
        address _owner,
        address _token,
        string calldata _name,
        FEES memory _fees
    ) external initializer {
        token = IERC20Upgradeable(_token);
        fee = _fees;
        round = 1;
        __Context_init();
        __Ownable_init();
        transferOwnership(_owner);
        name = _name;
        minStakingPeriod = 14;
    }

    /**
     * Update the staking fees
     * @param _fees The fees paid when staking
     *
     */

    function updateFees(FEES memory _fees) external onlyOwner {
        fee = _fees;
    }
/**
     * Update the staking fees
     * @param _days The fees paid when staking
     *
     */

    function updateMinPeriod(uint256 _days) external onlyOwner {
        minStakingPeriod = _days;
    }

    /**
     * Token holders can stake their tokens using this function
     * @param amount the number of tokens to stake
     * @param ref the address that referred this buyer.
     */
    function stake(uint256 amount, address ref) external {
        token.safeTransferFrom(_msgSender(), address(this), amount);
        USER storage user = stakers[_msgSender()];
        // add pending rewards to stake
        uint256 owing = pendingReward(_msgSender());
        uint256 fees = fee.stakingFee > 0
            ? MathUpgradeable.mulDiv(fee.stakingFee, amount, 100 ether)
            : 0;
        uint256 total = owing.add(amount).sub(fees);
        if (total <= 0) revert AmountCannotBeZero();
        if (fees > 0) sendFees(fees);
        user.stakedTokens = total.add(user.stakedTokens);
        user.round = round;
        user.startTime = block.timestamp;
        totalStakes = totalStakes.add(total);
        if (ref != address(0) && amount > 0) {
            uint256 refAmt = MathUpgradeable.mulDiv(5 ether, amount, 100 ether);
            token.safeTransfer(ref, refAmt);
            // track refs vie events
            emit refPayout(ref, _msgSender(), refAmt, block.timestamp);
        }
        emit STAKED(_msgSender(), amount, owing);
    }

    function sendFees(uint256 amount) internal {
        token.safeTransfer(owner(), amount);
    }

    /**
     * Anyone can add token rewards.
     * @param amount The amount of rewards
     */
    function addRewards(uint256 amount) external {
        addPayout(amount);
        token.safeTransferFrom(_msgSender(), address(this), amount);
    }

    /**
     * internal function to add Rewards
     * @param amount Amount of reward to be distributed
     */
    function addPayout(uint256 amount) internal {
        // remainders should be negligable at 10**18 scale
        if (totalStakes <= 0) revert ThereAreNoStakerYet();
        if (amount <= 0) revert AmountCannotBeZero();
        uint256 dividendPerToken = MathUpgradeable.mulDiv(
            amount,
            10e18,
            totalStakes
        );
        totalDividends = totalDividends.add(dividendPerToken);
        payouts[round] = payouts[round - 1].add(dividendPerToken);
        emit PAYOUT(round, amount, _msgSender());
        round++;
        totalRewards = totalRewards.add(amount);
    }

    /**
     * Stakers can claim their pending rewards using this function
     * @param to  address to send the reward to
     */
    function claimReward(address to) external {
        USER storage user = stakers[_msgSender()];
        if (user.round >= round) revert RewardAlreadyClaimed();
        uint256 owing = pendingReward(_msgSender());
        if (owing <= 0) revert NoRewardsAreCurrentlyAvailable();
        user.round = round; // update the round
        emit CLAIMEDREWARD(_msgSender(), to, owing);
        token.safeTransfer(to, owing);
    }

    /**
     * @dev get the pending reward for a user;
     * @param staker The users address;
     *
     */

    function pendingReward(address staker) public view returns (uint256) {
        USER storage user = stakers[staker];
        if (user.stakedTokens == 0 || totalDividends == 0) return 0;
        uint256 amount = MathUpgradeable.mulDiv(
            totalDividends.sub(payouts[user.round - 1]),
            user.stakedTokens,
            10e18
        );
        return amount;
    }

    /**
     * Stakers can un stake the staked tokens using this function
     * Any reward will be collected and added to final amount
     *
     * @param tokens the number of staked tokens to withdraw
     * @param to address to send the reward to
     */
    function withdraw(uint256 tokens, address to) external {
        USER storage user = stakers[_msgSender()];
        require((user.startTime + ( minStakingPeriod * 1 days) ) <= block.timestamp, 'Not Matured' );
        if (user.stakedTokens < tokens || tokens <= 0)
            revert InvalidWithdrawAmount();
        //5%
        uint256 _unstakingFee = fee.unstakingFee > 0
            ? MathUpgradeable.mulDiv(fee.unstakingFee, tokens, 100 ether)
            : 0;
        uint256 owing = pendingReward(_msgSender());
        uint256 available = owing.add(tokens).sub(_unstakingFee);
        user.stakedTokens = user.stakedTokens.sub(tokens);
        user.round = round;
        totalStakes = totalStakes.sub(tokens);
        if (_unstakingFee > 0) sendFees(_unstakingFee);
        emit UNSTAKED(_msgSender(), to, tokens, owing, _unstakingFee);
        token.safeTransfer(to, available);
    }

    function emergency(address to) external {
        USER storage user = stakers[_msgSender()];
        if (user.stakedTokens <= 0) revert YouHaveNotStaked();
        uint256 fees = fee.terminationFee > 0
            ? MathUpgradeable.mulDiv(
                fee.terminationFee,
                user.stakedTokens,
                100 ether
            )
            : 0;
        uint256 available = user.stakedTokens.sub(fees);
        totalStakes = totalStakes.sub(user.stakedTokens);
        emit UNSTAKED(_msgSender(), to, user.stakedTokens, 0, fees);
        user.stakedTokens = 0;
        user.round = round;
        if (fees > 0) sendFees(fees);
        token.safeTransfer(to, available);
    }
}