// contracts/Market.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.2;

/*
  88888888888888   888888         888888888888
  88888888888888   888  8888      88888888888888
  888              888    8888    888        88888
  888              888  8888      888         88888
  88888888888888   888888         888         88888
  88888888888888   8888888        888         88888
  888              888   8888     888        8888
  888              888    8888    88888888888888
  888              888      8888  888888888888
*/

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

error createTokenFirst();
error biddingTimeHasPassed();
error minimumbiddingAmount();
error priceMustBeGreaterThanZero();
error Unauthorized();

contract FRDNFTMarketPlace is ReentrancyGuard, ERC721URIStorage  {
  
  uint256 private _tokenIds;
  uint256 private _itemIds;
  uint private _biddingIds;
  uint256 private _itemsSold;
  uint256 private timenow = block.timestamp;
  address payable owner;
  uint256 private salesFeeBasisPoints = 250; // 2.5% in basis points (parts per 10,000) 250/100000
  uint256 private basisPointsTotal = 10000;

  constructor() ERC721("FIFAReward","FRD") {
    owner = payable(msg.sender);
  }

  struct AuctionItem {
    uint256 tokenId;
    uint itemId;
    string tokenURI;
    uint biddingduration;
    uint256 minbidamount;
    address payable creator;
    address payable owner;
    address payable reservedbuyer;
    uint256 price;
    bool sold;
  }

  struct NFTMints {
    uint256 tokenId;
    string tokenURI;
    address creator;
    bool hascreatedToken;
  }

  struct Bids {
    uint256 tokenId;
    uint itemId;
    string tokenURI;
    uint256 biddingId;
    uint256 biddingtime;
    address payable bidderaddress;
    address payable creator;
    address payable owner;
    uint256 biddingprice;
    bool biddingsuccess;
    string itembidstatus;
  }

  event NFTMinted(uint256 indexed tokenId, string tokenURI, address creator);

  event AuctionItemCreated (
      uint256 indexed tokenId,
      uint256 indexed itemId,
      string indexed tokenURI,
      uint biddingduration,
      uint256 minbidamount,
      address creator,
      address owner,
      uint256 price,
      bool sold
  );

  event Bidding (
      uint256 indexed tokenId,
      uint256 indexed itemId,
      string indexed tokenURI,
      uint256 biddingId,
      uint256 biddingtime,
      address bidderaddress,
      address creator,
      address owner,
      uint256 biddingprice,
      bool biddingsuccess,
      string itembidstatus
  );

  mapping(uint256 => AuctionItem) private idToAuctionItem;
  mapping(uint256 => Bids) private biddingItem;
  mapping(address => NFTMints) private MintedNFTs;
  mapping(uint256 => NFTMints) private MintedNFTIds;
  mapping(address => uint) private credits;

  /* Mints a token and lists it in the marketplace */
  function createToken(string memory tokenURI) public payable returns (uint) {
    _tokenIds += 1;
    uint256 newTokenId = _tokenIds;
    console.log('new token Id', newTokenId);
    MintedNFTIds[newTokenId] = NFTMints({
      tokenURI: tokenURI,
      creator: payable(msg.sender),
      tokenId: newTokenId,
      hascreatedToken: true 
    });
    MintedNFTs[msg.sender] = NFTMints({
      tokenURI: tokenURI,
      creator: payable(msg.sender),
      tokenId: newTokenId,
      hascreatedToken: true 
    });
    console.log("msg sender in token creation",msg.sender);
    console.log("nft created by",MintedNFTIds[newTokenId].creator);
    _mint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);
    emit NFTMinted(newTokenId, tokenURI, msg.sender);
    return newTokenId;
  }

  function checkTokenCreation() public view returns (bool) {
    return MintedNFTs[msg.sender].hascreatedToken;
  }

  function updateRewarsPercentage(uint rewardPercentage) public {
    require(owner == msg.sender, "Only marketplace owner can update reward percentage.");
    salesFeeBasisPoints = rewardPercentage;
  }

  function getMintedNfts() public view returns (NFTMints[] memory) {
    uint totalTokenIds = _tokenIds;
    uint nfttokenCount = 0;
    uint currentIndex = 0;

    for(uint i = 0; i < totalTokenIds; i++) {
      if(MintedNFTIds[i+1].creator == msg.sender) {
        nfttokenCount += 1;
      }
    }

    console.log("nft tokens count",nfttokenCount);
    console.log("nft creator address",MintedNFTIds[nfttokenCount].creator);

    NFTMints[] memory ntfscreated = new NFTMints[](nfttokenCount);
    for(uint i = 0; i < nfttokenCount; i++) {
      if(MintedNFTIds[i+1].creator == msg.sender) {
        NFTMints storage currentNFT = MintedNFTIds[i+1];
        ntfscreated[currentIndex] = currentNFT;
        currentIndex += 1;
      }
    }
    return ntfscreated;
  } 

  function createAuctionItem(
    uint256 tokenId_,
    uint256 price,uint biddingduration_,address reservedbuyer_,uint256 minbidamt
  ) public payable nonReentrant returns(uint) {
    // check if creator has created NFT token
    if(MintedNFTs[msg.sender].hascreatedToken == false) {
      revert createTokenFirst();
    }
    require(price > 0, "Price must be at least 1 wei");
    require(msg.sender != address(0), "Wallet address invalid");
    // require(msg.value == listingPrice, "Price must be equal to listing price");
    _itemIds += 1;
    uint256 itemId = _itemIds;
    string memory tokenurl = MintedNFTIds[tokenId_].tokenURI;
    idToAuctionItem[itemId] = AuctionItem({
      itemId : itemId,
      tokenId : tokenId_,
      tokenURI: tokenurl,
      biddingduration: biddingduration_,
      minbidamount: minbidamt,
      creator : payable(msg.sender),
      owner : payable(address(this)),
      reservedbuyer: payable (reservedbuyer_),
      price : price,
      sold : false
    });
    
    emit AuctionItemCreated(
      tokenId_,
      itemId,
      tokenurl,
      biddingduration_,
      minbidamt,
      msg.sender,
      address(this),
      price,
      false
    );
    _transfer(msg.sender, address(this), tokenId_);
    return itemId;
  }

  /**
    Credit the given address, using a "pull" payment strategy.
    https://fravoll.github.io/solidity-patterns/pull_over_push.html
    https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment 
  */

  function _allowForPull(address receiver, uint amount) private {
      credits[receiver] += amount;
  }

  function withdrawCredits() public {
      uint amount = credits[msg.sender];

      require(amount > 0, "There are no credits in this recipient address");
      require(address(this).balance >= amount, "There are no credits in this contract address");

      credits[msg.sender] = 0;

      payable(msg.sender).transfer(amount);
  }

  function getAddressCredits(address receiver) public view returns (uint) {
    return credits[receiver];
  }

  function getSalesFeeBasisPoints() public view returns (uint) {
    return salesFeeBasisPoints;
  }

  function bidNFT(uint256 tokenId_, uint256 itemId_,uint256 biddingprice_) external payable nonReentrant {
    uint256  minbidamnt = idToAuctionItem[itemId_].minbidamount;
    if(timenow > idToAuctionItem[itemId_].biddingduration) {
      revert biddingTimeHasPassed();
    }else if(biddingprice_ < minbidamnt) {
      revert minimumbiddingAmount();
    }else{
      _biddingIds += 1;
      uint256 biddingId_ = _biddingIds;
      string memory tokenurl = MintedNFTIds[tokenId_].tokenURI;
      address creator_ = idToAuctionItem[itemId_].creator;
      address owner_ = idToAuctionItem[itemId_].owner;
      biddingItem[itemId_] = Bids({
        itemId : itemId_,
        tokenId : tokenId_,
        tokenURI: tokenurl,
        biddingId: biddingId_,
        biddingtime: timenow,
        bidderaddress : payable(msg.sender),
        creator: payable(creator_),
        owner : payable(owner_),
        biddingprice : biddingprice_,
        biddingsuccess : true,
        itembidstatus: "unbought"
      });
      
      emit Bidding(
        tokenId_,
        itemId_,
        tokenurl,
        biddingId_,
        timenow,
        msg.sender,
        creator_,
        owner_,
        biddingprice_,
        true,
        "unbought"
      );
    }
    
  }

  /* Unlists an item previously listed for sale and transfer back to the creator */
  function unListAuctionItem(
    uint256 itemId
  ) public payable nonReentrant {
    uint tokenId = idToAuctionItem[itemId].tokenId;
    if(msg.sender != idToAuctionItem[itemId].creator) 
      revert Unauthorized();
    idToAuctionItem[itemId].owner = payable(msg.sender);
    _transfer(address(this), msg.sender, tokenId);

  }

/* Unlists an item previously listed for sale and transfer back to the creator */
  function ListBackAuctionItem(
    uint256 itemId
  ) public payable nonReentrant {
    uint tokenId = idToAuctionItem[itemId].tokenId;
    if(msg.sender != idToAuctionItem[itemId].creator) 
      revert Unauthorized();
    idToAuctionItem[itemId].owner = payable(address(this));
    _transfer(msg.sender, address(this), tokenId);

  }
  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  function createMarketSale(
      uint256 itemId,address bidder_buyer
      ) public payable nonReentrant {

      // check if item was bidded
      uint biddingCount = _biddingIds;
      uint unsoldItemCount = 0;
      // uint currentIndex = 0;

      for (uint i = 0; i < biddingCount; i++) {
        if (idToAuctionItem[i + 1].sold == false && idToAuctionItem[i + 1].owner == address(this)) {
          unsoldItemCount += 1;
        }
      }
      uint price = idToAuctionItem[itemId].price;
      uint tokenId = idToAuctionItem[itemId].tokenId;
      address creator = idToAuctionItem[itemId].creator;
      if(idToAuctionItem[itemId].owner != address(this)) 
        revert Unauthorized();
      require(msg.value == price, "Please submit the asking price in order to complete the purchase");

      uint marketPayment = (price * salesFeeBasisPoints)/basisPointsTotal;
      uint creatorPayment = price - marketPayment;

      _allowForPull(creator, creatorPayment);
      idToAuctionItem[itemId].owner = payable(bidder_buyer);
      idToAuctionItem[itemId].sold = true;
      // idToAuctionItem[tokenId].creator = payable(address(0));
      _itemsSold += 1;
      _allowForPull(payable(owner), marketPayment);
      _transfer(address(this), bidder_buyer, tokenId);
  }

  /* Returns all market items */
  function fetchAuctionItems() public view returns (AuctionItem[] memory) {
    uint itemCount = _tokenIds;
    uint currentIndex = 0;

    AuctionItem[] memory items = new AuctionItem[](itemCount);
    for (uint i = 0; i < itemCount; i++) {
      uint currentId = i + 1;
      AuctionItem storage currentItem = idToAuctionItem[currentId];
      items[currentIndex] = currentItem;
      currentIndex += 1;
    }
    return items;
  }

  /* Returns all unsold market items */
  function fetchUnSoldAuctionItems() public view returns (AuctionItem[] memory) {
    uint itemCount = _tokenIds;
    uint unsoldItemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < itemCount; i++) {
      if (idToAuctionItem[i + 1].sold == false && idToAuctionItem[i + 1].owner == address(this)) {
        unsoldItemCount += 1;
      }
    }

    AuctionItem[] memory items = new AuctionItem[](unsoldItemCount);
    for (uint i = 0; i < unsoldItemCount; i++) {
      if (idToAuctionItem[i + 1].owner == address(this)) {
        uint currentId = i + 1;
        AuctionItem storage currentItem = idToAuctionItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

function getUserNFTMintedCount() public view returns (uint) {
    uint totalTokenIds = _tokenIds;
    uint nfttokenCount = 0;

    for(uint i = 0; i < totalTokenIds; i++) {
      if(MintedNFTIds[i+1].creator == msg.sender) {
        nfttokenCount += 1;
      }
    }

    return nfttokenCount;
}
  /* Returns only items that a user has purchased */
  function fetchUserPurchasedNFTs() public view returns (AuctionItem[] memory) {
    uint totalItemCount = _itemIds;
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if(idToAuctionItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    AuctionItem[] memory items = new AuctionItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if(idToAuctionItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        AuctionItem storage currentItem = idToAuctionItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items a user has created */
  function fetchItemsCreated() public view returns (AuctionItem[] memory) {
    uint totalItemCount = _tokenIds;
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if(idToAuctionItem[i + 1].creator == msg.sender) {
        itemCount += 1;
      }
    }

    AuctionItem[] memory items = new AuctionItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToAuctionItem[i + 1].creator == msg.sender) {
        uint currentId = i + 1;
        AuctionItem storage currentItem = idToAuctionItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;


  }
}