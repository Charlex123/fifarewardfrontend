/* test/sample-test.js */
const { ethers } = require("hardhat");
const { expect } = require("chai");

const DEFAULT_URI = "https://www.mytokenlocation.com";
describe("NFT", async function() {

  let NFT, nft, nftContractAddress, ownerSigner, secondNFTSigner;

  console.log('getsign ethers',await ethers.getSigners());
  beforeEach(async function() {
    console.log('getsign ethers', ethers.getSigners());
    /* deploy the NFT contract */
    NFT = await ethers.getContractFactory("NFTMarketPlace");
    nft = await NFT.deploy();
    await nft.deployed();
    nftContractAddress = nft.address;
    console.log('market place address', nftContractAddress)
    /* Get users */
    [ownerSigner, secondNFTSigner] = await ethers.getSigners();
    console.log('owner signer',ownerSigner, 'sec signer', secondNFTSigner);
  })

  describe("createToken", function() {
    it("Emit NFTMinted event", async function() {
      [ownerSigner, secondNFTSigner] = await ethers.getSigners(); 
    console.log('owner signer',ownerSigner, 'sec signer', secondNFTSigner)
        await expect(nft.connect(ownerSigner).createToken(DEFAULT_URI)).to.emit(nft, 'MarketItemCreated').withArgs(1, DEFAULT_URI);

    })
    it("Should update the balances", async function() {

        await expect(() => nft.connect(ownerSigner).createToken(DEFAULT_URI))
          .to.changeTokenBalance(nft, ownerSigner, 1);

        await expect(() => nft.connect(secondNFTSigner).createToken(DEFAULT_URI))
          .to.changeTokenBalance(nft, secondNFTSigner, 1);

    })
  })
})