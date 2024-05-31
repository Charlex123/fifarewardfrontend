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
    import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
    import "./SafeMath.sol";
    import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
    import "hardhat/console.sol";

    struct User {
        uint userId;
        string username;
        uint betCount;
        bool hasActiveBet;
        uint refCount;
        bool registered;
        bool wasReferred;
        address sponsor;
        address useraddress;
        address[] referrals;
    }

    struct Bet {
        uint betId;
        uint matchId;
        uint uniquebetId;
        uint betamount;
        string matchfixture;
        address openedBy;
        string betstatus;
        uint totalbetparticipantscount;
        uint remainingparticipantscount;
        address[] participants;
        address[] betwinners;
        address[] betlosers;
    }

    struct PredictionCount {
        uint count;
        mapping(address => bool) participants;
    }

    struct ReferralReward {
        uint refrewardId;
        uint betId;
        address sponsor;
        uint rewardamount;
        bool rewardrecieved;
    }

    struct ParticipantsBetDetails {
        string username;
        uint betamount;
        uint predictioncount;
        bool hasjoinedthisbet;
        string prediction;
        string bettingteam;
    }

    error priceMustBeGreaterThanZero();
    error unauthorized();
    error betParticipantComplete();
    error invalidAmount();
    error referralAlreadyExits();
    error maxbetparticipantsReached();
    error sponsorMustHaveActiveBetToRefer();
    error predictionCountReached();
    error betClosed();
    error referralrewardalreadyClaimed();
    error downlinealreadyRegistered();
    error duplicateBetNotAllowed();


    contract FRDBetting is ReentrancyGuard {

        using SafeMath for uint256;
        uint timeNow = block.timestamp;
        IERC20 public FifaRewardTokenContract;
        uint256 public nextBetId;
        uint256 public nextReferralRewardId;
        uint256 public nextUserId;
        uint remainingparticipantscount;
        address private betdeployer;
        address[] private emptyArr;
        address public feeWallet = 0xbCCEb2145266639E0C39101d48B79B6C694A84Dc;
        // Bet[] betsArray;

        constructor(address _FifaRewardTokenAddress) {
            FifaRewardTokenContract = IERC20(_FifaRewardTokenAddress);
            betdeployer = msg.sender;
        }


        // Add mappings to store count of participants for each _bettingteam and _prediction
        mapping(uint => mapping(string => uint)) private bettingTeamCount;
        mapping(uint => mapping(string => uint)) private predictionCount;
        mapping(uint => Bet) private bets;
        mapping(uint => mapping(string => mapping(string => PredictionCount))) private predictionCounts;
        mapping(uint => mapping(address => ParticipantsBetDetails)) private participantsbetDetails;
        mapping(uint => address) public userIdToAddress;
        mapping(address => uint) private userBetIds; // Mapping of user addresses to the betId they betted on
        mapping(address => uint[]) private userCreatedBetIds; // Mapping of user addresses to the betIds they created
        mapping(address => uint[]) private userJoinedBetIds; // Mapping of user addresses to the betIds they joined
        mapping(address => User) private users; // Mapping of user addresses to user data
        mapping(uint => ReferralReward) private referralrewardIds; 
        mapping(address => ReferralReward) private referralrewards; 
        mapping(uint => mapping(address => bool)) private userBetStatus; // Mapping to track if a user has an active bet
        
        // Event to log when a user submits their prediction
        event PredictionSubmitted(uint betId, address user, string prediction, string team);

        // Event to log when a new bet is created
        event BetCreated(uint betId, uint matchId, address openedBy);

        // Event to log when a referral reward is claimed
        event ReferralRewardClaimed(address indexed sponsor, uint amount);

        // Event to log when a user registers
        event UserRegistered(uint userId, address indexed user, address[] referrals);

        function myTokenBalance(address wallet) public view returns(uint) {
            return FifaRewardTokenContract.balanceOf(wallet);
        }

        // modifier to check if caller is owner
        modifier isOwner() {
            require(msg.sender == betdeployer, "Unauthorized");
            _;
        }

        modifier isvalidWallet() {
            require(msg.sender != address(0), "invalid wallet");
            _;
        }

        // Function to update the count of participants with the same prediction and betting team
        function updatepredictionCount(uint _betId, string memory _bettingteam, string memory _prediction, address participant) internal {
            PredictionCount storage count = predictionCounts[_betId][_bettingteam][_prediction];
            count.count++;
            count.participants[participant] = true;
        }

        // Function to get count of participants with the same _bettingteam and _prediction
        function getPredictionCount(uint _betId, string memory _bettingteam, string memory _prediction) public view returns (uint) {
            return predictionCounts[_betId][_bettingteam][_prediction].count;
        }

        function compareStrings(string memory a, string memory b) internal pure returns (bool) {
            return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
        }

        function registerUser(string memory username, uint betCount, bool hasActiveBet, uint refCount, bool registered, bool wasReferred, address sponsor, address useraddress) internal {
            nextUserId++;
            users[useraddress] = User(nextUserId, username, betCount, hasActiveBet, refCount, registered, wasReferred, sponsor, useraddress, new address[](0));
            userIdToAddress[nextUserId] = useraddress;
            // Emit event for user registration
            emit UserRegistered(nextUserId, msg.sender, users[msg.sender].referrals);
        }

        function closeBet(uint _betId) internal {
            bets[_betId].betstatus = "closed";
        }

        function getbetParticipantsCount(uint _betId) public view returns (uint) {
            return bets[_betId].participants.length;
        }
        
        function getbetParticipants(uint _betId) public view returns (address[] memory) {
            return bets[_betId].participants;
        }

        function addReferral(address sponsorAddress, address downlineAddress, string memory username) public {
            // Ensure the sponsor is a registered user
            require(users[sponsorAddress].registered, "Sponsor is not a registered user");


            // Register user if not already registered
            if (users[downlineAddress].registered == true) {
                revert("downline already registered");
            }else {
                registerUser(username, 0, false, 0, true, true, sponsorAddress, downlineAddress);
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

        function addPrediction(uint betId, string memory username, uint betamount, string memory prediction, string memory bettingteam) internal {
            
            users[msg.sender].betCount = userCreatedBetIds[msg.sender].length.add(userJoinedBetIds[msg.sender].length);

            ParticipantsBetDetails storage details = participantsbetDetails[betId][msg.sender];
            details.username = username;
            details.betamount = betamount; // Assign appropriate default value
            details.hasjoinedthisbet = true; // Assign appropriate default value
            details.prediction = prediction; // Assign appropriate default value
            details.bettingteam = bettingteam; // Assign appropriate default value

            // Register user if not already registered
            if (!users[msg.sender].registered) {
                registerUser(username, 0, true, 0, true, false, address(0), msg.sender);
            }
            // Update count of participants with the same _bettingteam and _prediction
            updatepredictionCount(nextBetId, bettingteam, prediction, msg.sender);
        }

        function validateBet(uint betamount, uint betId) internal view {
            
            if(betamount <= 0) {
                revert("invalid Amount");
            }
            
            if(FifaRewardTokenContract.balanceOf(msg.sender) < betamount) {
                revert("Insufficient FRD");
            }
            require(FifaRewardTokenContract.allowance(msg.sender, address(this)) >= betamount,
             "transfer not approved");
            
            // Check if the user has already placed a bet on this betId
            if(participantsbetDetails[betId][msg.sender].hasjoinedthisbet == true) {
                revert("Duplicate Bet Not Allowed");
            }
        }

        
    // Function to create a new bet
    function createBet(
        uint betamount, 
        string memory prediction, 
        string memory bettingteam, 
        string memory username, 
        uint _matchId, 
        uint _uniquebetId, 
        string memory _matchfixture, 
        address openedby, 
        uint _totalbetparticipantscount
    ) 
        public 
        isvalidWallet nonReentrant {
        // Increment betId
        nextBetId++;

        // Validate bet
        validateBet(betamount, nextBetId);

        // Initialize and update participants array
        address[] storage betparticipants = bets[nextBetId].participants;
        betparticipants.push(msg.sender);

        // Calculate remaining participants count
        remainingparticipantscount = _totalbetparticipantscount - betparticipants.length;

        // Create a new bet
        bets[nextBetId] = Bet(
            nextBetId,
            _matchId,
            _uniquebetId,
            betamount,
            _matchfixture,
            openedby,
            "open",
            _totalbetparticipantscount,
            remainingparticipantscount,
            betparticipants,
            emptyArr,
            emptyArr
        );

        // Map user address to the new betId
        userCreatedBetIds[msg.sender].push(nextBetId);
        // Add user to participantsBetDetails struct
        addPrediction(nextBetId, username, betamount, prediction, bettingteam);

        // Check if the user is a downline and reward the sponsor
        _rewardSponsorIfDownline(msg.sender, betamount, nextBetId);

        // Emit event for bet creation
        emit BetCreated(nextBetId, _matchId, msg.sender);

        // Transfer tokens
        bool success = FifaRewardTokenContract.transferFrom(msg.sender, address(this), betamount);
        require(success, "Token transfer failed");

    }


        // Function for users to submit their predictions and predicted teams for a specific bet
        function submitPrediction(
            uint _betId,
            uint betamount,
            string memory username,
            string memory _prediction,
            string memory _team
        )
            public
            isvalidWallet
            nonReentrant
        {
            // Ensure the bet exists
            Bet storage bet = bets[_betId];
            require(bet.betId == _betId, "Bet does not exist");
            require(bet.betamount == betamount, "Invalid bet amount");

            validateBet(betamount, _betId);

            uint limit = bet.totalbetparticipantscount / 2;

            if (getPredictionCount(_betId, _team, _prediction) == limit) {
                revert("Prediction count reached");
            }

            if (bet.remainingparticipantscount == 0) {
                revert("Max bet participants reached");
            }

            // Update count of participants with the same _bettingteam and _prediction
            updatepredictionCount(_betId, _team, _prediction, msg.sender);

            // Map user address to the new betId
            userJoinedBetIds[msg.sender].push(_betId);

            address[] storage betParticipants = bet.participants;
            betParticipants.push(msg.sender);

            // Update remaining bet participants count
            remainingparticipantscount = bet.totalbetparticipantscount - betParticipants.length;
            bet.remainingparticipantscount = remainingparticipantscount;

            // Assign values to ParticipantsBetDetails in storage
            addPrediction(_betId, username, betamount, _prediction, _team);

            // Map user address to the betId they betted on
            userBetIds[msg.sender] = _betId;

            // Check if the user is a downline and reward the sponsor
            _rewardSponsorIfDownline(msg.sender, betamount, _betId);

            // Emit an event
            emit PredictionSubmitted(_betId, msg.sender, _prediction, _team);

            // Transfer tokens
            bool success = FifaRewardTokenContract.transferFrom(msg.sender, address(this), betamount);
            require(success, "Token transfer failed");
        }

        function _rewardSponsorIfDownline(address user, uint betamount, uint betId) internal {
            address sponsor = users[user].sponsor;
            if (sponsor != address(0)) {
                // Calculate referral reward (2% of the bet amount)
                uint referralReward = (betamount * 2) / 100;
                // Transfer referral reward to the sponsor

                // Check if the contract has enough tokens to transfer the reward
                require(FifaRewardTokenContract.balanceOf(address(this)) >= referralReward, "Contract does not have enough tokens");

                // check if sponsor has received referral reward already
                if(referralrewards[user].rewardrecieved) {
                    revert("referral reward already claimed");
                }

                nextReferralRewardId++;
                referralrewardIds[nextReferralRewardId] = ReferralReward(nextReferralRewardId, betId, sponsor, referralReward, true);
                
                // Assuming FifaRewardTokenContract has a transfer function
                FifaRewardTokenContract.transfer(sponsor ,referralReward);
                // Emit event for referral reward claimed
                emit ReferralRewardClaimed(sponsor, referralReward);
            }
        }

        function updateUsername(string memory username) public {
            users[msg.sender].username = username;
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

        // Function to retrieve all predictions and predicted teams for a specific betId
        function getPredictions(uint _betId) public view returns (ParticipantsBetDetails[] memory) {
            // Ensure the bet exists
            require(bets[_betId].betId == _betId, "Bet does not exist");

            // Get the number of participants
            uint participantsCount = bets[_betId].participants.length;

            // Initialize array to store participants' bet details
            ParticipantsBetDetails[] memory predictions = new ParticipantsBetDetails[](participantsCount);

            // Populate array with participants' bet details
            for (uint i = 0; i < participantsCount; i++) {
                address participant = bets[_betId].participants[i];
                predictions[i] = participantsbetDetails[_betId][participant];
            }

            // Return array of participants' bet details
            return predictions;
        }

        // Function to retrieve the addresses of winners for a specific betId
        function getWinners(uint _betId) public view returns (address[] memory) {
            // Ensure the bet exists
            require(bets[_betId].betId == _betId, "Bet does not exist");
            
            // Return the array of winners
            return bets[_betId].betwinners;
        }

        // // Function to retrieve the addresses of losers for a specific betId
        function getLosers(uint _betId) public view returns (address[] memory) {
            // Ensure the bet exists
            require(bets[_betId].betId == _betId, "Bet does not exist");
            
            // Return the array of losers
            return bets[_betId].betlosers;
        }

        // Function to get all the betIds created by a particular address
        function getBetIdsCreatedByUser(address _user) public view returns (uint[] memory) {
            return (userCreatedBetIds[_user]);
        }

        // Function to get all the betIds created by a particular address
        function getBetIdsCreatedByUserCount(address _user) public view returns (uint) {
            return (userCreatedBetIds[_user].length);
        }

        // Function to get all the betIds created by a particular address
        function getBetIdsUserJoined(address _user) public view returns (uint[] memory) {
            return (userJoinedBetIds[_user]);
        }

        // Function to get all the betIds created by a particular address
        function getBetIdsUserJoinedCount(address _user) public view returns (uint) {
            return (userJoinedBetIds[_user].length);
        }

        // Function to pay bet winners participants
        function payWinners(uint _betId, address[] memory _betwinners) internal {
            // Ensure the bet exists
            require(bets[_betId].betId == _betId, "Bet does not exist");

            // Calculate the total bet amount for this bet
            uint totalBetAmount = 0;
            for (uint i = 0; i < bets[_betId].participants.length; i++) {
                totalBetAmount += participantsbetDetails[_betId][bets[_betId].participants[i]].betamount;
            }

            // Calculate the reward per winner
            uint rewardPerWinner = totalBetAmount * 80 / (_betwinners.length * 100);

            // Pay each winner
            for (uint j = 0; j < _betwinners.length; j++) {
                // Transfer reward to the winner
                FifaRewardTokenContract.transfer(_betwinners[j], rewardPerWinner);
            }

            // Mark the bet as closed
            closeBet(_betId);
        }

        // Function to process match results and determine winners and losers
        function processMatchResults(uint _matchId, string memory _result, string memory _bettingteam) public nonReentrant {
            for (uint i = 1; i <= nextBetId; i++) {
                address[] storage winners =  bets[i].betwinners;
                address[] storage losers =  bets[i].betlosers;
                if(compareStrings(bets[i].betstatus, "open")) {
                    if (bets[i].matchId == _matchId) {
                        Bet storage bet = bets[i];
                        for (uint j = 0; j < bet.participants.length; j++) {
                            address participant = bet.participants[j];
                            if (compareStrings(participantsbetDetails[i][participant].prediction, _result) &&
                                compareStrings(participantsbetDetails[i][participant].bettingteam, _bettingteam)) {
                                // Participant predicted correctly
                                winners.push(participant);
                            } else {
                                // Participant predicted incorrectly
                                losers.push(participant);
                            }
                        }
                    }
                }
                bets[i].betwinners = winners;
                bets[i].betlosers = losers;
                payWinners(bets[i].betId, winners);
                // markWinnersAndLosers(nextBetId, winners, losers);
            }
        }

        // Function to get user registration details using user's wallet address
        function getUserRegistrationDetails(address _user) public view returns (User memory) {
            return users[_user];
        }

        // Function to retrieve NFTMints by ID
        function getBetsMapping(uint256 _betId) external view returns (Bet memory) {
            return bets[_betId];
        }

        function getAllBetIdsCount() external view returns (uint) {
            return nextBetId;
        }   

        function transferToken(address receiver) external isOwner nonReentrant {
            uint tokenbal = FifaRewardTokenContract.balanceOf(address(this));
            FifaRewardTokenContract.transfer(receiver,tokenbal);
        }
        
    }