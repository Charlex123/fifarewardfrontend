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
    hascreatedToken: boolean,
    // following properties only exist if the NFT has been minted
    tokenId?: string,
    tokenURI?: string,
    // following properties only exist if the NFT is listed for sale
    price?: BigNumber,
    itemId?: string,
    biddingduration: BigNumber,
    minbidamount: BigNumber,
    sold: boolean
}