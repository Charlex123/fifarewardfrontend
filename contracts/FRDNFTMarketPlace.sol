// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.2;

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

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract FRDNFTMarketPlace is ReentrancyGuard, ERC721URIStorage  {
  
  error createTokenFirst();
  error biddingTimeHasPassed();
  error minimumbiddingAmount();
  error priceMustBeGreaterThanZero();
  error Unauthorized();
  error royaltyPercentageMustBeLessThan500();
  error adminfeePercentageMustBeLessThan500();

  uint256 private _tokenIds;
  uint256 private _itemIds;
  uint private _biddingIds;
  uint256 private _itemsSold;
  uint256 private timenow = block.timestamp;
  address payable owner;
  address private zeroAddress = 0x0000000000000000000000000000000000000000;
  uint256 private adminfeeBasisPoints = 500; // 5% in basis points (parts per 10,000) 250/100000
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
    uint256 sellingprice;
    uint salesroyaltyFeeBasisPoints;
    address payable seller;
    address payable creator;
    address payable owner;
    address payable reservedbuyer;
    uint purchasemethod;
    bool sold;
  }

  struct NFTMints {
    uint256 tokenId;
    string tokenURI;
    address creator;
    address owner;
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
    bool wasitempurchased;
  }


  event NFTMinted(uint256 indexed tokenId, string tokenURI, address creator, address owner);

  event updateBiddingPrice(uint256 indexed tokenId, uint256 indexed itemId, uint256 newminbidamount, uint256 newsellingprice);

  event AuctionItemCreated (
      uint256 indexed tokenId,
      uint256 indexed itemId,
      string indexed tokenURI,
      uint biddingduration,
      uint256 minbidamount,
      uint256 sellingprice,
      address seller,
      address creator,
      address owner,
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
      bool wasitempurchased
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
    MintedNFTIds[newTokenId] = NFTMints({
      tokenId: newTokenId,
      tokenURI: tokenURI,
      creator: payable(msg.sender),
      owner: payable(msg.sender),
      hascreatedToken: true 
    });
    MintedNFTs[msg.sender] = NFTMints({
      tokenId: newTokenId,
      tokenURI: tokenURI,
      creator: payable(msg.sender),
      owner: payable(msg.sender),
      hascreatedToken: true 
    });
    _mint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);
    emit NFTMinted(newTokenId, tokenURI, msg.sender,msg.sender);
    return newTokenId;
  }

  function setitemRoyaltyFeePercent(uint256 itemId,uint royaltyPercentage) public {
    address creator_ = idToAuctionItem[itemId].creator;
    address owner_ = idToAuctionItem[itemId].owner;

    if(msg.sender != creator_ && msg.sender != owner_)
      revert Unauthorized();
    if(royaltyPercentage > 500)
      revert royaltyPercentageMustBeLessThan500();
    idToAuctionItem[itemId].salesroyaltyFeeBasisPoints = royaltyPercentage;
  }

  function setAdminFeePercent(uint adminfeePercentage) public {
    if(msg.sender != owner) 
      revert Unauthorized();
    if(adminfeePercentage > 500)
      revert adminfeePercentageMustBeLessThan500();
    adminfeeBasisPoints = adminfeePercentage;
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
    uint256 sellingprice_,
    uint biddingduration_,
    address reservedbuyer_,
    uint256 minbidamt,
    uint salesroyaltyFeeBasisPoints_
  ) public payable nonReentrant returns(uint) {
    // check if creator has created NFT token
    address creator_ = MintedNFTIds[tokenId_].creator;

    if(MintedNFTs[msg.sender].hascreatedToken == false) {
      revert createTokenFirst();
    }
    if(sellingprice_ <= 0) {
      revert priceMustBeGreaterThanZero();
    }
    if(msg.sender == address(0)) {
      revert Unauthorized();
    }
    // require(sellingprice_ > 0, "Price must be at least 1 wei");
    // require(msg.sender != address(0), "Wallet address invalid");
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
      sellingprice : sellingprice_,
      salesroyaltyFeeBasisPoints: salesroyaltyFeeBasisPoints_,
      seller : payable(msg.sender),
      creator : payable(creator_),
      owner : payable(address(this)),
      reservedbuyer: payable (reservedbuyer_),
      purchasemethod: 0,
      sold : false
    });
    
    emit AuctionItemCreated(
      tokenId_,
      itemId,
      tokenurl,
      biddingduration_,
      minbidamt,
      sellingprice_,
      msg.sender,
      creator_,
      address(this),
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
      if(msg.sender != owner) {
        revert Unauthorized();
      }
      uint amount = credits[msg.sender];

      require(amount > 0, "There are no credits in this recipient address");
      require(address(this).balance >= amount, "There are no credits in this contract address");

      credits[msg.sender] = 0;

      payable(msg.sender).transfer(amount);
  }

  // function getAddressCredits(address receiver) public view returns (uint) {
  //   return credits[receiver];
  // }

  // function getsalesroyaltyFeeBasisPoints() public view returns (uint) {
  //   return salesroyaltyFeeBasisPoints;
  // }

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
        wasitempurchased: false
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
        false
      );
    }
    
  }

  /* Unlists an item previously listed for sale and transfer back to the creator */
  function unListAuctionItem(
    uint256 itemId
  ) public payable nonReentrant {
    uint tokenId = idToAuctionItem[itemId].tokenId;
    if(msg.sender != idToAuctionItem[itemId].owner) 
      revert Unauthorized();
    idToAuctionItem[itemId].sold = false;
    idToAuctionItem[itemId].owner = payable(msg.sender);
    // idToAuctionItem[itemId].seller = payable(msg.sender);
    _transfer(address(this), msg.sender, tokenId);

  }

/* Unlists an item previously listed for sale and transfer back to the creator */
  function ListBackAuctionItem(
    uint256 itemId
  ) public payable nonReentrant {
    uint tokenId = idToAuctionItem[itemId].tokenId;
    if(msg.sender != idToAuctionItem[itemId].owner) 
      revert Unauthorized();
    idToAuctionItem[itemId].sold = false;
    idToAuctionItem[itemId].owner = payable(address(this));
    _transfer(msg.sender, address(this), tokenId);

  }

  /* Unlists an item previously listed for sale and transfer back to the creator */
  function changeItemAuctionPrice(
    uint256 itemId, 
    uint256 newminbidamount, 
    uint256 newsellingprice
  ) public payable nonReentrant {
    uint tokenId = idToAuctionItem[itemId].tokenId;
    if(msg.sender != idToAuctionItem[itemId].owner) 
      revert Unauthorized();
    idToAuctionItem[itemId].minbidamount = newminbidamount;
    idToAuctionItem[itemId].sellingprice = newsellingprice;
    idToAuctionItem[itemId].owner = payable(address(this));
    _transfer(msg.sender, address(this), tokenId);
    emit updateBiddingPrice(tokenId, itemId, newminbidamount, newsellingprice);
  }


  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  function createMarketSale(
      uint256 itemId,address bidder_buyer, uint purchasemethod_
      ) public payable nonReentrant {
      
      uint price = idToAuctionItem[itemId].sellingprice;
      uint tokenId = idToAuctionItem[itemId].tokenId;
      address creator = idToAuctionItem[itemId].creator;
      if(idToAuctionItem[itemId].owner != address(this)) 
        revert Unauthorized();
      require(msg.value == price, "invalid price");

      uint creatorRoyalty = (price * idToAuctionItem[itemId].salesroyaltyFeeBasisPoints)/basisPointsTotal;
      uint adminFee = (price * adminfeeBasisPoints)/basisPointsTotal;
      uint totalFee = creatorRoyalty + adminFee;
      uint sellerPayment = price - totalFee;
      _allowForPull(creator, creatorRoyalty);
      idToAuctionItem[itemId].owner = payable(bidder_buyer);
      idToAuctionItem[itemId].seller = payable(bidder_buyer);
      idToAuctionItem[itemId].sold = true;
      idToAuctionItem[itemId].purchasemethod = purchasemethod_;
      
      // idToAuctionItem[tokenId].creator = payable(address(0));
      _itemsSold += 1;
      _allowForPull(payable(owner), adminFee);
      _allowForPull(payable(bidder_buyer), sellerPayment);
      _transfer(address(this), bidder_buyer, tokenId);
  }

  /* Returns all market items */
  function adminremoveAuctionItem(uint itemId) public {
    if(msg.sender != owner) {
      revert Unauthorized();
    }
    // get item
    idToAuctionItem[itemId].owner = payable (zeroAddress);
    idToAuctionItem[itemId].sold = true;
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