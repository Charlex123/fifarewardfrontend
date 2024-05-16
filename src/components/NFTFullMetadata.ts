import { BigNumber } from "ethers";

export interface NFTFullMetadata {
    name: string,
    image: string,
    description: string,
    traits: any,
    chainId: any,
    seller: string,
    creator: string,
    owner: any,
    // following properties only exist if the NFT has been minted
    tokenId?: BigNumber,
    tokenURI?: string,
    // following properties only exist if the NFT is listed for sale
    price?: BigNumber,
    itemId?: BigNumber,
    biddingduration: BigNumber,
    minbidamount: BigNumber
}