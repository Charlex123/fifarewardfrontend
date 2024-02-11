// contracts/Market.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

error createTokenFirst();

contract FRDNFTMarketPlace is ReentrancyGuard, ERC721URIStorage  {
  
  uint256 private _tokenIds;
  uint256 private _itemIds;
  uint256 private _itemsSold;

  address payable owner;
  uint256 private salesFeeBasisPoints = 250; // 2.5% in basis points (parts per 10,000) 250/100000
  uint256 private basisPointsTotal = 10000;

  event MarketItemCreated (
      uint256 indexed tokenId,
      uint256 indexed itemId,
      address creator,
      address owner,
      uint256 price,
      bool sold
  );

  constructor() ERC721("FIFAReward","FRD") {
    owner = payable(msg.sender);
  }

  struct MarketItem {
    uint itemId;
    uint256 tokenId;
    address payable creator;
    address payable owner;
    uint256 price;
    bool sold;
  }

  struct NFTMints {
    string tokenURI;
    address creator;
    uint256 tokenId;
    bool hascreatedToken;
  }

  event NFTMinted(string tokenURI, uint256 indexed tokenId, address creator);

  mapping(uint256 => MarketItem) private idToMarketItem;
  mapping(address => NFTMints) private MintedNFTs;
  mapping(address => uint) private credits;

  /* Mints a token and lists it in the marketplace */
  function createToken(string memory tokenURI, uint price) public payable returns (uint) {
    _tokenIds += 1;
    uint256 newTokenId = _tokenIds;
    console.log('new token Id', newTokenId);
    MintedNFTs[msg.sender].hascreatedToken = true;
    _mint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);
    createMarketItem(newTokenId,price);
    emit NFTMinted(tokenURI, newTokenId, msg.sender);
    return newTokenId;
  }

  function checkTokenCreation() public view returns (bool) {
    return MintedNFTs[msg.sender].hascreatedToken;
  }

  function updateRewarsPercentage(uint rewardPercentage) public {
    require(owner == msg.sender, "Only marketplace owner can update reward percentage.");
    salesFeeBasisPoints = rewardPercentage;
  }

  function createMarketItem(
    uint256 tokenId_,
    uint256 price
  ) public payable nonReentrant returns(uint) {
    // check if creator has created NFT token
    if(MintedNFTs[msg.sender].hascreatedToken == false) {
      revert createTokenFirst();
    }
    require(price > 0, "Price must be at least 1 wei");
    // require(msg.value == listingPrice, "Price must be equal to listing price");
    _itemIds += 1;
    uint256 itemId = _itemIds;
    idToMarketItem[itemId] = MarketItem({
      itemId : itemId,
      tokenId : tokenId_,
      creator : payable(msg.sender),
      owner : payable(address(this)),
      price : price,
      sold : false
    });
    
    console.log("creator addr",idToMarketItem[itemId].creator);
    console.log(" item Id 2222222--", itemId);

    emit MarketItemCreated(
      tokenId_,
      itemId,
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

  function getOwnerOfItem(uint itemId) public view returns(address) {
    return idToMarketItem[itemId].owner;
  }

  /* Unlists an item previously listed for sale and transfer back to the creator */
  function unListMarketItem(
    uint256 itemId
  ) public payable nonReentrant {
    console.log("creator _address",idToMarketItem[itemId].creator);
    console.log("market place owner",idToMarketItem[itemId].owner);
    console.log("msg.sender _address",msg.sender);
    console.log("token Id",itemId);
    uint tokenId = idToMarketItem[itemId].tokenId;
    require(msg.sender == idToMarketItem[itemId].creator, "Only creator may unlist an item");
    idToMarketItem[itemId].owner = payable(msg.sender);
    _transfer(address(this), msg.sender, tokenId);

  }

/* Unlists an item previously listed for sale and transfer back to the creator */
  function ListBackMarketItem(
    uint256 itemId
  ) public payable nonReentrant {
    console.log("creator _address",idToMarketItem[itemId].creator);
    console.log("market place owner",idToMarketItem[itemId].owner);
    console.log("msg.sender _address",msg.sender);
    console.log("token Id",itemId);
    uint tokenId = idToMarketItem[itemId].tokenId;
    require(msg.sender == idToMarketItem[itemId].creator, "Only creator may unlist an item");
    idToMarketItem[itemId].owner = payable(address(this));
    _transfer(msg.sender, address(this), tokenId);

  }
  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  function createMarketSale(
      uint256 itemId
      ) public payable nonReentrant {

      uint price = idToMarketItem[itemId].price;
      uint tokenId = idToMarketItem[itemId].tokenId;
      address creator = idToMarketItem[itemId].creator;
      console.log("item owner addr",idToMarketItem[itemId].owner);
      require(idToMarketItem[itemId].owner == address(this), "This item is not available for sale");
      require(msg.value == price, "Please submit the asking price in order to complete the purchase");

      uint marketPayment = (price * salesFeeBasisPoints)/basisPointsTotal;
      uint creatorPayment = price - marketPayment;

      _allowForPull(creator, creatorPayment);
      idToMarketItem[itemId].owner = payable(msg.sender);
      idToMarketItem[itemId].sold = true;
      // idToMarketItem[tokenId].creator = payable(address(0));
      _itemsSold += 1;
      _allowForPull(payable(owner), marketPayment);
      _transfer(address(this), msg.sender, tokenId);
  }

  /* Returns all market items */
  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint itemCount = _tokenIds;
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < itemCount; i++) {
      uint currentId = i + 1;
      MarketItem storage currentItem = idToMarketItem[currentId];
      items[currentIndex] = currentItem;
      currentIndex += 1;
    }
    return items;
  }

  /* Returns all unsold market items */
  function fetchUnSoldMarketItems() public view returns (MarketItem[] memory) {
    uint itemCount = _tokenIds;
    uint unsoldItemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < itemCount; i++) {
      if (!idToMarketItem[i + 1].sold && idToMarketItem[i + 1].owner == address(this)) {
        unsoldItemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      uint currentId = i + 1;
      if (idToMarketItem[currentId].owner == address(this)) {
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
      }
    }
    return items;
  }

  /* Returns only items that a user has purchased */
  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds;
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items a user has created */
  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    uint totalItemCount = _tokenIds;
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].creator == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].creator == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;


  }
}