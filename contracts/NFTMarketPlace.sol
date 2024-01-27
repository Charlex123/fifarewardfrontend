// contracts/Market.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarketPlace is ReentrancyGuard, ERC721URIStorage  {
  
  uint256 private _tokenIds;
  uint256 private _itemsSold;

  address payable owner;
  uint256 private salesFeeBasisPoints = 250; // 2.5% in basis points (parts per 10,000) 250/100000
  uint256 private basisPointsTotal = 10000;

  event MarketItemCreated (
      uint256 indexed tokenId,
      address seller,
      address owner,
      uint256 price,
      bool sold
  );

  constructor() ERC721("FIFAReward","FRD") {
    owner = payable(msg.sender);
  }

  struct MarketItem {
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }

  mapping(uint256 => MarketItem) private idToMarketItem;
  mapping(address => uint) private credits;

  /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
      _tokenIds += 1;
      uint256 newTokenId = _tokenIds;

      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);
      createMarketItem(newTokenId, price);
      return newTokenId;
    }

  function updateRewarsPercentage(uint rewardPercentage) public {
    require(owner == msg.sender, "Only marketplace owner can update reward percentage.");
    salesFeeBasisPoints = rewardPercentage;
  }
  
  function createMarketItem(
    uint256 tokenId,
    uint256 price
  ) private {
    require(price > 0, "Price must be at least 1 wei");
    // require(msg.value == listingPrice, "Price must be equal to listing price");

    idToMarketItem[tokenId] =  MarketItem(
      tokenId,
      payable(msg.sender),
      payable(address(this)),
      price,
      false
    );

    _transfer(msg.sender, address(this), tokenId);
    emit MarketItemCreated(
      tokenId,
      msg.sender,
      address(this),
      price,
      false
    );
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

  /* Unlists an item previously listed for sale and transfer back to the seller */
  function unListMarketItem(
    uint256 tokenId
  ) public payable nonReentrant {

    require(msg.sender == idToMarketItem[tokenId].seller, "Only seller may unlist an item");
    idToMarketItem[tokenId].owner = payable(msg.sender);
    transferFrom(address(this), msg.sender, tokenId);

  }

  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  function createMarketSale(
      uint256 tokenId
      ) public payable {
      uint price = idToMarketItem[tokenId].price;
      address seller = idToMarketItem[tokenId].seller;
      require(msg.value == price, "Please submit the asking price in order to complete the purchase");

      uint marketPayment = (price * salesFeeBasisPoints)/basisPointsTotal;
      uint sellerPayment = price - marketPayment;

      _allowForPull(seller, sellerPayment);
      idToMarketItem[tokenId].owner = payable(msg.sender);
      idToMarketItem[tokenId].sold = true;
      // idToMarketItem[tokenId].seller = payable(address(0));
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
    uint totalItemCount = _tokenIds;
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
      if (idToMarketItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;


  }
}