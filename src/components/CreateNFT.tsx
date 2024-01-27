/* pages/create-nft.js */
import { useState } from 'react'
import { ethers } from 'ethers'
import Image from 'next/image'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useWeb3Modal } from '@web3modal/ethers5/react';
// import Web3Modal from 'web3modal'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketPlace.json'
  

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
export default function CreateItem() {

  const [marketplaceAddress] = useState<any>(process.env.MarketPlaceAddress);
  const [fileUrl, setFileUrl] = useState<any>(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter();
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();

  async function onChange(e:any) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog:any) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS();
    const provider = new ethers.providers.Web3Provider(walletProvider as any)
    const signer = provider.getSigner();

    /* next, create the item */
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.createToken(url, price, { value: listingPrice })
    await transaction.wait()
   
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          title='input'
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input title='change asset'
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <Image className="rounded mt-4" width="350" src={fileUrl} alt='file image'/>
          )
        }
        <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create NFT
        </button>
      </div>
    </div>
  )
}