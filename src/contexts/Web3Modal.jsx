"use client"

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'

// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECTPROJECTID;
// 2. Set chains
const mainnet = {
  chainId: 56,
  name: 'BNB Chain',
  currency: 'BNB',
  explorerUrl: 'https://bscscan.com/',
  rpcUrl: 'https://bsc-dataseed.binance.org/'
}

// 3. Create modal
const metadata = {
  name: 'FifaReward',
  description: 'FifaReward Betting and Staking Dapp',
  url: 'https://fifareward.io',
  icons: ['https://avatars.mywebsite.com/']
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: '...', // used for the Coinbase SDK
  defaultChainId: 97 // used for the Coinbase SDK
})


createWeb3Modal({
  ethersConfig,
  themeVariables: {
    '--w3m-accent': '#E28304 !important'
  },
  chains: [mainnet],
  enableEmail: true,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - false as default
})

export function Web3Modal({ children }) {
  return children;
}