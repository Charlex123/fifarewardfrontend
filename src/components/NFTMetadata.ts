import { BigNumber } from "ethers";

export interface NFTMetadata {
    name: string,
    image: string,
    description: string,
    traits: any,
    chainId: any,
    creator: string,
    owner: any,
    hascreatedToken: boolean,
    // following properties only exist if the NFT has been minted
    tokenId?: string,
    tokenURI?: string,
    // following properties only exist if the NFT is listed for sale
    price?: BigNumber,
    seller?: string,
    itemId?: string,
    listed: boolean
}