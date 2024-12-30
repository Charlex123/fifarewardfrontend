const hre = require("hardhat");

async function main() {
    // const NFTMKPlace = await hre.ethers.getContractFactory("FRDNFTMarketPlace");
    // const nftmkplace = await NFTMKPlace.deploy();
    // const Dextro = await hre.ethers.getContractFactory("Dextro");
    // const dextro = await Dextro.deploy();
    // const FRDToken = await hre.ethers.getContractFactory("FifaRewardToken");
    // const frdToken = await FRDToken.deploy();
    // const GuessFootBallHero = await hre.ethers.getContractFactory("GuessFootBallHero");
    // const guessfootballhero = await GuessFootBallHero.deploy("0x344db0698433Eb0Ca2515d02C7dBAf21be07C295");
    // const FRDStaking = await hre.ethers.getContractFactory("FRDStaking");
    // const frdstaking = await FRDStaking.deploy("0x21cF31997A60D8015A9c1Fd3851C459DD0c73B12");
    // const FRDBetting = await hre.ethers.getContractFactory("FRDBetting");
    // const frdbetting = await FRDBetting.deploy("0x21cF31997A60D8015A9c1Fd3851C459DD0c73B12");
    const FRDBettingFeatures = await hre.ethers.getContractFactory("FRDBettingFeatures");
    const frdbettingfeatures = await FRDBettingFeatures.deploy("0x5Da7C937824908A101673d6e7182b60076031170");
    // const FRDNFTMarketPlaceFeatures = await hre.ethers.getContractFactory("FRDNFTMarketPlaceFeatures");
    // const frdnftmarketplacefeatures = await FRDNFTMarketPlaceFeatures.deploy("0x25d041896301A39aC45e0022cFCff9509C85299b");
    // console.log('Dextro Contract Address',dextro.address)
    // console.log('FRD Contract Address',frdToken.address)
    // console.log('Guess Footbal Hero Contract Address',guessfootballhero.address)
    // console.log('NFT Contract Address',nftmkplace.address)
    // console.log('Staking Contract Address',frdstaking.address)
    // console.log('Betting Contract Address',frdbetting.address)
    console.log('Betting Features Contract Address',frdbettingfeatures.address)
    // console.log('frdnftmarketplacefeatures Contract Address',frdnftmarketplacefeatures.address);
    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });