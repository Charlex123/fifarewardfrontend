import { BigNumber } from "ethers";

export interface NFTMetadata {
    name: string,
    image: string,
    description: string,
    traits: any,
    chainId: any,
    creator: string,
    decimalplaces: BigNumber;
    owner: any,
    hascreatedToken: boolean,
    // following properties only exist if the NFT has been minted
    tokenId?: BigNumber,
    tokenURI?: string,
    // following properties only exist if the NFT is listed for sale
    price?: BigNumber,
    seller?: string,
    itemId?: BigNumber
}