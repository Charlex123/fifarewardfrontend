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

import "./SafeMath.sol";
import "./FRDNFTMarketPlace.sol";
import "./IFRDNFTMarketPlace.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract FRDNFTMarketPlaceFeatures is ReentrancyGuard {

    using SafeMath for uint256;
    IFRDNFTMarketPlace private FRDNFTMarketPlaceContract;
    address admin;
    address FRDMarketPlaceAddress;
    constructor(address _frdNFTMarketPlaceAddress) {
        FRDNFTMarketPlaceContract = IFRDNFTMarketPlace(_frdNFTMarketPlaceAddress);
        FRDMarketPlaceAddress = _frdNFTMarketPlaceAddress;
        admin = msg.sender;
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function getAllBids() external  view returns (Bid[] memory) {
        return FRDNFTMarketPlaceContract.loadAllBids();
    }

    function getBidsForItem(uint256 itemId) external view returns (Bid[] memory) {
        uint totalBids = FRDNFTMarketPlaceContract.getAllBidIdsCount();
        console.log("total bids",totalBids);
        uint itemBidsCount = 0;
        Bid[] memory itemBids = new Bid[](totalBids);

        for (uint i = 1; i <= totalBids; i++) {
            Bid memory bid = FRDNFTMarketPlaceContract.getBidsMapping(i);
            if (bid.itemId == itemId) {
                itemBids[itemBidsCount] = bid;
                itemBidsCount++;
            }
        }

        // Resize the array to remove any empty elements
        assembly {
            mstore(itemBids, itemBidsCount)
        }

        return itemBids;
    }

    function getUserNFTMintedCount() public view returns (uint) {
        uint totalTokenIds = FRDNFTMarketPlaceContract.getAllNFTMintsCount();
        uint nfttokenCount = 0;

        for(uint i = 0; i < totalTokenIds; i++) {
            if(FRDNFTMarketPlaceContract.getNFTMintsMapping(i+1).creator == msg.sender) {
            nfttokenCount += 1;
            }
        }
        return nfttokenCount;
    }

   
    /* Returns all unsold market items */
    function fetchUnSoldAuctionItems() public view returns (AuctionItem[] memory) {
        uint itemCount = FRDNFTMarketPlaceContract.getAllItemIdsCount();
        uint unsoldItemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < itemCount; i++) {
          if (FRDNFTMarketPlaceContract.getNFTAuctionItemsMapping(i+1).sold == false && FRDNFTMarketPlaceContract.getNFTAuctionItemsMapping(i+1).owner == FRDMarketPlaceAddress) {
            unsoldItemCount += 1;
          }
        }

        AuctionItem[] memory items = new AuctionItem[](unsoldItemCount);
        for (uint i = 0; i < unsoldItemCount; i++) {
          if (FRDNFTMarketPlaceContract.getNFTAuctionItemsMapping(i+1).owner == FRDMarketPlaceAddress) {
            uint currentId = i + 1;
            AuctionItem memory currentItem = FRDNFTMarketPlaceContract.getNFTAuctionItemsMapping(currentId);
            items[currentIndex] = currentItem;
            currentIndex += 1;
          }
        }
        return items;
    }
    
  /* Returns only items that a user has purchased */
    function fetchUserPurchasedNFTs() public view returns (AuctionItem[] memory) {
      uint totalItemCount = FRDNFTMarketPlaceContract.getAllItemIdsCount();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if(FRDNFTMarketPlaceContract.getNFTAuctionItemsMapping(i+1).owner == msg.sender) {
          itemCount += 1;
        }
      }

      AuctionItem[] memory items = new AuctionItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if(FRDNFTMarketPlaceContract.getNFTAuctionItemsMapping(i+1).owner == msg.sender) {
          uint currentId = i + 1;
          AuctionItem memory currentItem = FRDNFTMarketPlaceContract.getNFTAuctionItemsMapping(currentId);
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items a user has created */
    function fetchItemsCreated() public view returns (AuctionItem[] memory) {
      uint totalItemCount = FRDNFTMarketPlaceContract.getAllItemIdsCount();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if(FRDNFTMarketPlaceContract.getNFTAuctionItemsMapping(i+1).creator == msg.sender) {
          itemCount += 1;
        }
      }

      AuctionItem[] memory items = new AuctionItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (FRDNFTMarketPlaceContract.getNFTAuctionItemsMapping(i+1).creator == msg.sender) {
          uint currentId = i + 1;
          AuctionItem memory currentItem = FRDNFTMarketPlaceContract.getNFTAuctionItemsMapping(currentId);
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

}
