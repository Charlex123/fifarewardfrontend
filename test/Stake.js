
// const { ethers } = "hardhat";
// const { expect } = "chai";


// describe("TAFA Staking", () => {
    
//     let owner;
//     let alice;
//     let bob;
//     let res;
//     let stakeContract_;
//     let tafaToken;

//     beforeEach(async() => {
//         const TAFAToken = await ethers.getContractFactory("TAFA");
//         const StakeContract = await ethers.getContractFactory("Stake");
//         // const MockDai = await ethers.getContractFactory("MockERC20");
//         // mockDai = await MockDai.deploy("MockDai", "mDAI");
//         [owner, alice, bob] = await ethers.getSigners();
//         await Promise.all([
//             TAFAToken.mint(owner.address, 1980000),
//             TAFAToken.mint(alice.address, 10000),
//             TAFAToken.mint(bob.address, 10000)
//         ]);
//         tafaToken = await TAFAToken.deploy(2000000,"TAFA","TATA");
//         stakeContract_ = await StakeContract.deploy(tafaToken.address);
//     })

    
//     describe("Stake", async() => {
//         it("should accept DAI and update mapping", async() => {
//             let toTransfer = ethers.parseEther(100)
//         //     await mockDai.connect(alice).approve(pmknFarm.address, toTransfer)

//         //     expect(await pmknFarm.isStaking(alice.address))
//         //         .to.eq(false)
            
//         //     expect(await pmknFarm.connect(alice).stake(toTransfer))
//         //         .to.be.ok

//         //     expect(await pmknFarm.stakingBalance(alice.address))
//         //         .to.eq(toTransfer)
            
//         //     expect(await pmknFarm.isStaking(alice.address))
//         //         .to.eq(true)
//         })

//         // it("should update balance with multiple stakes", async() => {
//         //     let toTransfer = ethers.utils.parseEther("100")
//         //     await mockDai.connect(alice).approve(pmknFarm.address, toTransfer)
//         //     await pmknFarm.connect(alice).stake(toTransfer)

//         //     await mockDai.connect(alice).approve(pmknFarm.address, toTransfer)
//         //     await pmknFarm.connect(alice).stake(toTransfer)

//         //     expect(await pmknFarm.stakingBalance(alice.address))
//         //         .to.eq(ethers.utils.parseEther("200"))
//         // })

//         // it("should revert with not enough funds", async() => {
//         //     let toTransfer = ethers.utils.parseEther("1000000")
//         //     await mockDai.approve(pmknFarm.address, toTransfer)

//         //     await expect(pmknFarm.connect(bob).stake(toTransfer))
//         //         .to.be.revertedWith("You cannot stake zero tokens")
//         // })
//     })

//     // describe("Unstake", async() => {
//     //     beforeEach(async() => {
//     //         let toTransfer = ethers.utils.parseEther("100")
//     //         await mockDai.connect(alice).approve(pmknFarm.address, toTransfer)
//     //         await pmknFarm.connect(alice).stake(toTransfer)
//     //     })

//     //     it("should unstake balance from user", async() => {
//     //         let toTransfer = ethers.utils.parseEther("100")
//     //         await pmknFarm.connect(alice).unstake(toTransfer)

//     //         res = await pmknFarm.stakingBalance(alice.address)
//     //         expect(Number(res))
//     //             .to.eq(0)

//     //         expect(await pmknFarm.isStaking(alice.address))
//     //             .to.eq(false)
//     //     })
//     // })

//     // describe("WithdrawYield", async() => {

//     //     beforeEach(async() => {
//     //         await pmknToken._transferOwnership(pmknFarm.address)
//     //         let toTransfer = ethers.utils.parseEther("10")
//     //         await mockDai.connect(alice).approve(pmknFarm.address, toTransfer)
//     //         await pmknFarm.connect(alice).stake(toTransfer)
//     //     })

//     //     it("should return correct yield time", async() => {
//     //         let timeStart = await pmknFarm.startTime(alice.address)
//     //         expect(Number(timeStart))
//     //             .to.be.greaterThan(0)

//     //         // Fast-forward time
//     //         await time.increase(86400)

//     //         expect(await pmknFarm.calculateYieldTime(alice.address))
//     //             .to.eq((86400))
//     //     })

//     //     it("should mint correct token amount in total supply and user", async() => { 
//     //         await time.increase(86400)

//     //         let _time = await pmknFarm.calculateYieldTime(alice.address)
//     //         let formatTime = _time / 86400
//     //         let staked = await pmknFarm.stakingBalance(alice.address)
//     //         let bal = staked * formatTime
//     //         let newBal = ethers.utils.formatEther(bal.toString())
//     //         let expected = Number.parseFloat(newBal).toFixed(3)

//     //         await pmknFarm.connect(alice).withdrawYield()

//     //         res = await pmknToken.totalSupply()
//     //         let newRes = ethers.utils.formatEther(res)
//     //         let formatRes = Number.parseFloat(newRes).toFixed(3).toString()

//     //         expect(expected)
//     //             .to.eq(formatRes)

//     //         res = await pmknToken.balanceOf(alice.address)
//     //         newRes = ethers.utils.formatEther(res)
//     //         formatRes = Number.parseFloat(newRes).toFixed(3).toString()

//     //         expect(expected)
//     //             .to.eq(formatRes)
//     //     })

//     //     it("should update yield balance when unstaked", async() => {
//     //         await time.increase(86400)
//     //         await pmknFarm.connect(alice).unstake(ethers.utils.parseEther("5"))

//     //         res = await pmknFarm.pmknBalance(alice.address)
//     //         expect(Number(ethers.utils.formatEther(res)))
//     //             .to.be.approximately(10, .001)
//     //     })

//     // })
// })


// Import necessary libraries and Hardhat plugins
// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const { hre } = require("hardhat");

// describe("Stake and TAFA Contracts", function () {
//   let TAFA, Stake, tafa, stake, owner, addr1, addr2;

//   beforeEach(async function () {
//     // Deploy TAFA contract
//     TAFA = await ethers.getContractFactory("TAFA");
//     tafa = await TAFA.deploy(1000000, "TAFA", "TAFA");

//     // Deploy Stake contract and pass the TAFA contract as an argument
//     Stake = await ethers.getContractFactory("Stake");
//     stake = await Stake.deploy(tafa.address);

//     // Get accounts from Hardhat
//     [owner, addr1, addr2] = await ethers.getSigners();
//   });

//   it("Should get msg.sender address", async function () {
//     // Connect TAFA contract to the owner
//     tafa = tafa.connect(owner.address);

//     // Ensure that the address is now addr1
//     expect(await tafa.getOwner()).to.equal(owner.address);
//   });
  
//   it("Should receive token", async function () {
//     // Send some TAFA tokens to addr1 and addr2
//     await tafa.transfer(addr1.address, 300000);
//     await tafa.transfer(addr2.address, 200000);

//     // Connect the contracts to the signers
//     tafa = tafa.connect(addr1);
//     stake = stake.connect(addr1);

//     tafa = tafa.connect(addr1);
//     stake = stake.connect(addr2);

//     const address1Balance = await tafa.balanceOf(addr1.address);
//     expect(address1Balance).to.be.gt(0);
//   });

//   it("Should allow staking and calculate rewards", async function () {
//     // Send some TAFA tokens to addr1 and addr2
//     console.log('addresses',owner.address, addr1.address,addr2.address)
//     await tafa.transfer(addr1.address, 30);
//     await tafa.transfer(addr2.address, 20);

//     // Connect the contracts to the signers
//     tafa = tafa.connect(addr1);
//     stake = stake.connect(addr1);

//     tafa = tafa.connect(addr1);
//     stake = stake.connect(addr2);

//     // // Add addr1 as a referral
//     // await stake.addReferrer(owner.address);

//     // // Stake 100 TAFA tokens for 30 days
//     await stake.stake(100, 30);

//     // // Increase time to simulate 30 days passing
//     await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
//     await ethers.provider.send("evm_mine");

//     // // Withdraw staked amount and calculate rewards
//     const initialBalance = await tafa.balanceOf(addr1.address);
//     await stake.withdrawStake();
//     const finalBalance = await tafa.balanceOf(addr1.address);

//     // Ensure that the balance increased due to staking rewards
//     expect(finalBalance).to.be.above(initialBalance);
//   });

//   // Add more tests to cover other functionalities as needed

// });

