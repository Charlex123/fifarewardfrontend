const hre = require("hardhat");

async function main() {
    const TAFAcontractAddress = "0x5ae155f89308ca9050f8ce1c96741badd342c26b";
    const Stake = await hre.ethers.getContractFactory("Stake");
    const stake = await Stake.deploy(TAFAcontractAddress);
    console.log('Stake Contract Address',stake.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });