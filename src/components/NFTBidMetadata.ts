import { BigNumber } from "ethers";

export interface NFTBidMetadata {
    tokenId: BigNumber,
    itemId: BigNumber,
    tokenURI: string,
    biddingId: BigNumber,
    biddingtime: BigNumber,
    bidderaddress: string,
    creator: string,
    owner: string,
    biddingprice: BigNumber,
    biddingsuccess: boolean;
    wasitempurchased: boolean
}