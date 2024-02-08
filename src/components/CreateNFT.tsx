import { useEffect, useState } from 'react'
import Image from 'next/image'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router';
import AlertDanger from './AlertDanger';
import Loading from './Loading';
import ActionSuccessModal from './ActionSuccess';
import LoginModal from './LoginModal';
import BgOverlay from './BgOverlay';
import NFTMarketPlace from '../../artifacts/contracts/FRDNFTMarketPlace.sol/FRDNFTMarketPlace.json';
import { ethers } from 'ethers';
import DragDropImageUpload from './DragDropImageUpload';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useDisconnect } from '@web3modal/ethers5/react';
import styles from '../styles/createnft.module.css'

export default function CreateItem() {
  
  const ipfsHostUrl = 'https://ipfs.infura.io:5001/api/v0';
  const client = (ipfsHttpClient as any)(ipfsHostUrl);

  const [marketplaceAddress] = useState<any>("0x35af7BF4B48869554cB846260149d9318235ACCd");
  const [fileUrl, setFileUrl] = useState<any>(null);
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();
  const [showloginComp,setShowLoginComp] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<number>();  
  const [isLoggedIn,setIsloggedIn] = useState<boolean>(false);
  const [showAlertDanger,setShowAlertDanger] = useState<boolean>(false);
  const [errorMessage,seterrorMessage] = useState<string>("");
  const [showBgOverlay,setShowBgOverlay] = useState<boolean>(false);
  const [formInput, updateFormInput] = useState({ price: '1', name: '', description: '' });
  const router = useRouter();

  
  useEffect(() => {
    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
      if(udetails && udetails !== null && udetails !== "") {
      const username_ = udetails.username;  
      if(username_) {
          setUsername(username_);
          setUserId(udetails.userId);
          setIsloggedIn(true);
          
      }
      }else {
          setIsloggedIn(false);
      }
    
    
  },[username,userId])

  console.log('chain Id',chainId, marketplaceAddress)
  async function handleFileUpload(file: File) {
    console.log('File to upload:', file);
    
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
      const url = `https://ipfs.infura.io:5001/api/${added.path}`
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function checkLogin() {
    if(formInput.description === "" || formInput.name === "" ) {
      setShowAlertDanger(true);
      seterrorMessage("NFT art image, description and name are required!!");
    }else {
      if(username && userId) {
        if(!isConnected) {
          open()
        }else {
          createNFT();
        }
      }else {
        setShowBgOverlay(true);
        setShowLoginComp(true);
      }
    }
  }

  async function createNFT() {
    
    const url = await uploadToIPFS()
    const provider = new ethers.providers.Web3Provider(walletProvider as any);
    console.log('provider',provider, 'contract address',marketplaceAddress)
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketPlace.abi, signer);
    let transaction = await contract.createToken(url)
    await transaction.wait()
   
    router.push('/')
  }

  const closeLoginModal = () => {
    setShowBgOverlay(false);
    setShowLoginComp(false);
  }

  const closeAlertModal = () => {
    setShowAlertDanger(false)
  }

  return (
    <>
      {showBgOverlay && <BgOverlay />}
      
      <div className={styles.main}>
        {showloginComp && <LoginModal prop={'Create NFT'} onChange={closeLoginModal}/>}
        {showAlertDanger && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
        <div className={styles.main_c}>
          <div className={styles.dragdrop}>
            <DragDropImageUpload onFileUpload={handleFileUpload}/>
          </div>
          <div className={styles.nft_art_desc}>
            <div className={styles.form_g}>
              <label className={styles.label}>Asset Name</label>
              <input 
                placeholder="Asset Name"
                className={styles.input_}
                onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                required
              />
            </div>
            <div className={styles.form_g}>
            <label className={styles.label}>Description </label>
              <textarea
                placeholder="Say something about your asset"
                className={styles.textarea_}
                onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                required
              />
            </div>
            <div className={styles.form_g}>
              <label className={styles.label}>Supply (Max. of 1)</label>
              <input
                placeholder="1"
                className={styles.input_}
                onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                required
              />
            </div>
            <div className={styles.form_g}>
              <button type='button' title='create nft' onClick={checkLogin} className={styles.create_btn}>
                Create NFT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}