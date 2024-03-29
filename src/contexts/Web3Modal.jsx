"use client"

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'

// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECTPROJECTID;
console.log('project Id',projectId)
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

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet],
  projectId
})

export function Web3ModalProvider({ children }) {
  return children;
}