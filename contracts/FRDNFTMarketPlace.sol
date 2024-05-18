// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

error Unauthorized();
error invalidAmount();

struct AuctionItem {
    uint256 tokenId;
    uint itemId;
    uint decimalplaces;
    uint autionTime;
    string tokenURI;
    uint biddingduration;
    uint bidduration;
    uint creatorsalesroyalty;
    uint256 minbidamount;
    uint256 sellingprice;
    address payable seller;
    address payable creator;
    address payable owner;
  }

  struct NFTMints {
    uint256 tokenId;
    string tokenURI;
    address creator;
    address owner;
    bool hascreatedToken;
  }

  struct Bid {
    uint256 biddingtime;
    address payable bidderaddress;
    uint256 biddingprice;
    bool biddingsuccess;
    bool wasitempurchased;
  }

contract FRDNFTMarketPlace is ReentrancyGuard, ERC721URIStorage {
    uint256 private _tokenIds;
    uint256 private _itemIds;
    uint private _biddingIds;
    uint256 private _itemsSold;
    address payable owner;
    address payable creator;
    address payable seller;
    uint256 private adminfeeBasisPoints = 500; // 5% in basis points (parts per 10,000) 250/100000
    address feeAddress = 0xbCCEb2145266639E0C39101d48B79B6C694A84Dc;


    mapping(uint256 => AuctionItem) private idToAuctionItem;
    mapping(uint256 => mapping(address => Bid)) private escrow;
    mapping(uint256 => Bid[]) private itemBids; // Mapping from item ID to an array of Bids
    mapping(address => NFTMints) private MintedNFTs;
    mapping(uint256 => NFTMints) private MintedNFTIds;

    event NFTMinted(uint256 indexed tokenId, string tokenURI, address creator);

    event AuctionItemCreated (
        uint256 indexed tokenId,
        uint256 indexed itemId,
        string indexed tokenURI
    );

    event BidPlaced (
        uint256 indexed itemId,
        address bidderaddress,
        uint256 biddingprice
    );

    event ItemSold (
        uint256 indexed itemId,
        address bidderaddress,
        uint256 amount
    );

    event ItemTransferred (
        uint256 indexed itemId,
        address receiver
    );

    event BidRefunded(
        uint256 indexed itemId,
        address bidderaddress,
        uint256 amount
    );

  event updateBiddingPrice(uint256 indexed tokenId, uint256 indexed itemId, uint256 newminbidamount, uint256 newsellingprice);


    constructor() ERC721("FIFAReward", "FRD") {
        owner = payable(msg.sender);
    }

// modifier to check if caller is owner
    modifier onlyOwner() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == owner, "Unauthorized");
        _;
    }
    
    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        MintedNFTIds[newTokenId] = NFTMints(
            newTokenId,
            tokenURI,
            msg.sender,
            msg.sender,
            true
        );
        MintedNFTs[msg.sender] = MintedNFTIds[newTokenId];
        return newTokenId;
    }

    function createAuctionItem(
        uint256 tokenId,
        uint256 sellingprice,
        uint duration,
        uint256 minbidamount,
        uint creatorsalesroyalty,
        uint dcp
    ) public {
        require(MintedNFTIds[tokenId].hascreatedToken, "invalid");
        _itemIds++;
        uint256 ItemId = _itemIds;
        address creator_ = MintedNFTIds[tokenId].creator;

        idToAuctionItem[ItemId] = AuctionItem(
            tokenId,
            ItemId,
            dcp,
            block.timestamp,
            MintedNFTIds[tokenId].tokenURI,
            block.timestamp + (duration * 1 days),
            duration,
            creatorsalesroyalty,
            minbidamount,
            sellingprice,
            payable(msg.sender),
            payable(creator_),
            payable(address(this))
        );
        MintedNFTIds[tokenId].owner = payable(address(this));
        MintedNFTs[msg.sender].owner = payable(address(this));
        _transfer(msg.sender, address(this), tokenId);
        emit AuctionItemCreated (tokenId, ItemId, MintedNFTIds[tokenId].tokenURI);
    }

    function setcreatorSalesRoyalty(uint newsalesroyalty, uint itemId) external nonReentrant {
        AuctionItem storage item = idToAuctionItem[itemId];
        if(msg.sender != item.seller) {
            revert("Unauthorized");
        }
        item.creatorsalesroyalty = newsalesroyalty;
    }

    function bidOnNFT( uint256 itemId,uint256 biddingprice_) external payable nonReentrant {
        
        AuctionItem storage item = idToAuctionItem[itemId];
        
        if(msg.sender == item.seller || msg.sender == item.creator || msg.sender == address(0)) {
            revert("Unauthorized");
        }
        require(item.owner == address(this), "Already sold");
        require(block.timestamp <= item.biddingduration, "Bidding has ended");
        if(msg.value < biddingprice_) {
            revert("invalid amount");
        }
        
        Bid[] storage bids = itemBids[itemId];
        if (bids.length > 0) {
            Bid storage lastBid = bids[bids.length - 1];
            require(msg.value > lastBid.biddingprice, "higher bid found.");
            payable(lastBid.bidderaddress).transfer(lastBid.biddingprice); // Refund the last bidder
        }
        
        itemBids[itemId].push(Bid(
            block.timestamp,
            payable(msg.sender),
            msg.value,
            true,
            false
        ));

        // escrow[itemId][msg.sender].biddingId = biddingId;
        escrow[itemId][msg.sender].bidderaddress = payable (msg.sender);
        escrow[itemId][msg.sender].biddingprice += msg.value;
        emit BidPlaced(itemId, msg.sender, msg.value);
    }
    
    function acceptHighestBid(uint256 itemId) external payable nonReentrant {
        AuctionItem storage item = idToAuctionItem[itemId];
        Bid[] storage bids = itemBids[itemId];
        require(msg.sender == idToAuctionItem[itemId].seller, "unauthorized");
        if (bids.length > 0) {
            Bid storage lastBid = bids[bids.length - 1];
            require(lastBid.bidderaddress != address(0), "No bids");

            item.sellingprice = lastBid.biddingprice;
            _saleNFT(itemId, lastBid.biddingprice,lastBid.bidderaddress);
        }
        
    }

    function transferNFT(address receiver, uint itemId) public payable nonReentrant {
        if(msg.sender == owner && receiver != address(0)) {
            directNFTTransfer(itemId, receiver);
        }else {
            revert("Unauthorized");
        }
    } 

    function directNFTTransfer(uint itemId, address receiver) internal {
        AuctionItem storage item = idToAuctionItem[itemId];
        item.seller = payable (receiver);
        item.owner = payable (receiver);
        uint tokenId = item.tokenId;
        MintedNFTIds[tokenId].owner = payable(receiver);
        MintedNFTs[msg.sender].owner = payable(receiver);

        _transfer(address(this), receiver, item.tokenId);
        emit ItemTransferred(itemId, receiver);
    }

    function DirectNFTSale(uint256 itemId, uint amount) public payable nonReentrant {
        AuctionItem storage item = idToAuctionItem[itemId];
        if(msg.sender == item.seller || msg.sender == item.creator || item.seller == address(0)) {
            revert("Unauthorized");
        }
        // require(block.timestamp > item.biddingduration, "Auction not ended");
        if(msg.value < amount || msg.value < item.sellingprice) {
            revert("invalid amount");
        }
        require(msg.sender != address(0), "invalid");

        _saleNFT(itemId, msg.value,msg.sender);
    }

    function _saleNFT(uint256 itemId, uint amount, address buyer) internal {
        AuctionItem storage item = idToAuctionItem[itemId];
        
        uint256 adminFee = (amount * adminfeeBasisPoints) / 10000;
        uint256 creatorFee = (amount * item.creatorsalesroyalty) / 10000;
        uint256 payout = amount - (adminFee + creatorFee);

        payable(feeAddress).transfer(adminFee);
        payable(item.creator).transfer(creatorFee);
        payable(item.seller).transfer(payout);
        item.seller = payable (buyer);
        item.owner = payable (buyer);
        uint tokenId = item.tokenId;
        MintedNFTIds[tokenId].owner = payable(buyer);
        MintedNFTs[msg.sender].owner = payable(buyer);
        item.sellingprice = amount;

        _transfer(address(this), buyer, item.tokenId);
        emit ItemSold(itemId, buyer, amount);
    }

    function withdrawFunds() external onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    // Function to retrieve Items by ID
    function getNFTAuctionItemsMapping(uint256 _itemId) external view returns (AuctionItem memory) {
        return idToAuctionItem[_itemId];
    }

    // Function to retrieve NFTMints by ID
    function getNFTMintsMapping(uint256 _tokenId) external view returns (NFTMints memory) {
        return MintedNFTIds[_tokenId];
    }

    function getAllItemIdsCount() external view returns (uint) {
        return _itemIds;
    }

    function getAllNFTMintsCount() external view returns (uint) {
        return _tokenIds;
    }

    function removeToken(uint tokenId) external nonReentrant {
        if(msg.sender != owner) {
            revert("Unauthorized");
        }
        // get current owner
        address cowner =  MintedNFTIds[tokenId].owner;
        MintedNFTIds[tokenId].owner = payable(address(0));
        _transfer(cowner, address(0), tokenId);
    }

    function removeItem(uint itemId) external nonReentrant {
        if(msg.sender != owner) {
            revert("Unauthorized");
        }
        AuctionItem storage item = idToAuctionItem[itemId];
        uint tokenId = item.tokenId;
        item.owner = payable(address(this));
        MintedNFTIds[tokenId].owner = payable(address(this));
        _transfer(address(this), address(this), itemId);
    }

    // Function to retrieve all bids of a specific item
    function getContractAddress() public view returns (address ) {
        return address(this);
    }

    // Function to retrieve all bids of a specific item
    function getAllBidsForItem(uint256 itemId) public view returns (Bid[] memory) {
        return itemBids[itemId];
    }

    function resetbiddingdurtion(uint _itemId) external nonReentrant {
        AuctionItem storage item = idToAuctionItem[_itemId];
        uint currentTime = block.timestamp;
        uint biddingduration = item.biddingduration;
        uint bidduration = item.bidduration;
        
        if (currentTime >= biddingduration) {
            item.biddingduration = currentTime + (bidduration * 1 days);
        } 
    }

    /* Unlists an item previously listed for sale and transfer back to the creator */
    function unListAuctionItem(
      uint256 itemId
    ) public payable nonReentrant {
      uint tokenId = idToAuctionItem[itemId].tokenId;
      if(msg.sender != idToAuctionItem[itemId].seller) {
        revert("Unauthorized");
      }
      idToAuctionItem[itemId].owner = payable(msg.sender);
      MintedNFTIds[tokenId].owner = payable(msg.sender);
      MintedNFTs[msg.sender].owner = payable(msg.sender);
      
      _transfer(address(this), msg.sender, tokenId);
    }

  /* Unlists an item previously listed for sale and transfer back to the creator */
    function ListBackAuctionItem(
      uint256 itemId
    ) public payable nonReentrant {
      uint tokenId = idToAuctionItem[itemId].tokenId;
      if(msg.sender != idToAuctionItem[itemId].seller) 
        revert("Unauthorized");
      idToAuctionItem[itemId].owner = payable(address(this));
      MintedNFTIds[tokenId].owner = payable(address(this));
      MintedNFTs[msg.sender].owner = payable(address(this));
      _transfer(msg.sender, address(this), tokenId);
    }

    // /* Unlists an item previously listed for sale and transfer back to the creator */
    function updateAuctionItem(
      uint256 itemId, 
      uint newduration,
      uint256 newminbidamount, 
      uint256 newsellingprice
    ) public nonReentrant {
      uint tokenId = idToAuctionItem[itemId].tokenId;
      if(msg.sender != idToAuctionItem[itemId].seller) {
        revert("Unauthorized");
      }
        
      idToAuctionItem[itemId].minbidamount = newminbidamount;
      idToAuctionItem[itemId].sellingprice = newsellingprice;
      idToAuctionItem[itemId].biddingduration = newduration;
      
      emit updateBiddingPrice(tokenId, itemId, newminbidamount, newsellingprice);
    }

}
