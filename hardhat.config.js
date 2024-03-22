require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
const dotenv = require("dotenv");

dotenv.config();
// const { mnemonic } = require('./secrets.json');
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async () => {
//   const accounts = await ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "testnet",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    localhost: {
      allowUnlimitedContractSize: true,
      url: "http://127.0.0.1:8545"
    },
    testnet: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts:  [process.env.NFTMARKETPLACE_DEV_TEST_PRIVATE_KEY] 
    },
    mainnet: {
      url: "https://bsc-dataseed.bnbchain.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [process.env.NFTMARKETPLACE_DEV_TEST_PRIVATE_KEY]
    },
    mumbai: {
      url: process.env.INFURA_POLYGON_MUMBAI_URL,
      chainId: 80001,
      accounts: [`0x${process.env.POLYGONADDRESS_DEV_TEST_PRIVATE_KEY}`]
    },
    matic: {
      url: process.env.INFURA_POLYGON_MAINNET_URL,
      chainId: 137,
      accounts: [`0x${process.env.POLYGONADDRESS_DEV_TEST_PRIVATE_KEY}`]
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://bscscan.com/
    apiKey: process.env.BSCSCAN_APIKEY, 
  },
  sourcify: {
    enabled: true
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      },
      {
        version: "0.8.2",
        settings: {
            evmVersion: 'paris'
        },
      },
      {
        version: "0.5.16",
        settings: {
            evmVersion: 'paris'
        },
      },
      {
        version: "0.5.0",
        settings: {
            evmVersion: 'paris'
        },
      },
      {
        version: "0.8.20",
        settings: {
            evmVersion: 'paris'
        },
      },
      {
        version: "0.8.0",
        settings: {
            evmVersion: 'paris'
        },
      },
    ],
  settings: {
    optimizer: {
      enabled: true,
      runs: 1
    }
   }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
};
