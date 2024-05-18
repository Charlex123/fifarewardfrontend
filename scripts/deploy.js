const hre = require("hardhat");

async function main() {
    // const NFTMKPlace = await hre.ethers.getContractFactory("FRDNFTMarketPlace");
    // const nftmkplace = await NFTMKPlace.deploy();
    // const FRDToken = await hre.ethers.getContractFactory("FifaRewardToken");
    // const frdToken = await FRDToken.deploy();
    // const FRDStaking = await hre.ethers.getContractFactory("FRDStaking");
    // const frdstaking = await FRDStaking.deploy("0x344db0698433Eb0Ca2515d02C7dBAf21be07C295");
    // const FRDBetting = await hre.ethers.getContractFactory("FRDBetting");
    // const frdbetting = await FRDBetting.deploy("0x344db0698433Eb0Ca2515d02C7dBAf21be07C295");
    const FRDBettingFeatures = await hre.ethers.getContractFactory("FRDBettingFeatures");
    const frdbettingfeatures = await FRDBettingFeatures.deploy("0x5672029384d1ca4433d3A656C9a9911E92aAcE1E");
    const FRDNFTMarketPlaceFeatures = await hre.ethers.getContractFactory("FRDNFTMarketPlaceFeatures");
    const frdnftmarketplacefeatures = await FRDNFTMarketPlaceFeatures.deploy("0x05dcD8B98DcBeD60B71cbF242C56074058D4Df94");
    // console.log('FRD Contract Address',frdToken.address)
    // console.log('NFT Contract Address',nftmkplace.address)
    // console.log('Staking Contract Address',frdstaking.address)
    // console.log('Betting Contract Address',frdbetting.address)
    console.log('Betting Features Contract Address',frdbettingfeatures.address)
    console.log('frdnftmarketplacefeatures Contract Address',frdnftmarketplacefeatures.address);
    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });