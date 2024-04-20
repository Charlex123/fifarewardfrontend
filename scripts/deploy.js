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
    // const FRDNFTMarketPlaceFeatures = await hre.ethers.getContractFactory("FRDNFTMarketPlaceFeatures");
    // const frdnftmarketplacefeatures = await FRDNFTMarketPlaceFeatures.deploy("0x6F723caaD34F25a7B443361823FbfBb87dADA6b9");
    const FRDBettingFeatures = await hre.ethers.getContractFactory("FRDBettingFeatures");
    const frdbettingfeatures = await FRDBettingFeatures.deploy("0xB4D1b032ab0fA60Dea9F3C8e5a4c61Fe254D5eD6");
    // const AirDrop = await hre.ethers.getContractFactory("FRDAirDrop");
    // const airdrop = await AirDrop.deploy();
    // console.log('FRD Contract Address',frdToken.address)
    // console.log('NFT Contract Address',nftmkplace.address)
    // console.log('Staking Contract Address',frdstaking.address)
    // console.log('Betting Contract Address',frdbetting.address)
    // console.log('frdnftmarketplacefeatures Contract Address',frdnftmarketplacefeatures.address)
    // console.log('Airdrop Contract Address',airdrop.address)
    console.log('frdbettingfeatures Contract Address',frdbettingfeatures.address)
    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });