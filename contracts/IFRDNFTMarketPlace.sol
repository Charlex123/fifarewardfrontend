// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

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

import "./FRDNFTMarketPlace.sol";

interface IFRDNFTMarketPlace {
    
    function getNFTMintsMapping(uint256 _tokenId) external view returns (NFTMints memory);

    function getBidsMapping(uint256 _bidId) external view returns (Bid memory);

    function getNFTAuctionItemsMapping(uint256 _bidId) external view returns (AuctionItem memory);

    function loadAllBids() external  view returns (Bid[] memory);

    function getAllBidIdsCount() external view returns (uint);

    function getAllNFTMintsCount() external view returns (uint);

    function getAllItemIdsCount() external view returns (uint);

}