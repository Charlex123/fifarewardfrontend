const hre = require("hardhat");

async function main() {
    // const NFTMKPlace = await hre.ethers.getContractFactory("FRDNFTMarketPlace");
    // const nftmkplace = await NFTMKPlace.deploy();
    const FRDToken = await hre.ethers.getContractFactory("FifaRewardToken");
    const frdToken = await FRDToken.deploy();
    console.log('FRD Contract Address',frdToken.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });