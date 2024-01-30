const hre = require("hardhat");

async function main() {
    const NFTMKPlace = await hre.ethers.getContractFactory("FRDNFTMarketPlace");
    const nftmkplace = await NFTMKPlace.deploy();
    console.log('NFT Marketplace Contract Address',nftmkplace.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });