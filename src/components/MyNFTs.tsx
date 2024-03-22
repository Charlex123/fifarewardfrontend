import React, { useContext,useState,useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import messi1 from '../assets/images/messi.png';
import messi from '../assets/images/messi3.jpg';
import messi2 from '../assets/images/messi3.png';
import zidane1 from '../assets/images/zidane2.jpg';
import osimhen from '../assets/images/osimhen.jpg';
import Loading from './Loading';
import BgOverlay from './BgOverlay';
import AlertDanger from './AlertDanger';
import axios from 'axios';
import NFTMarketPlace from '../../artifacts/contracts/FRDNFTMarketPlace.sol/FRDNFTMarketPlace.json';
import { ethers } from 'ethers';
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck, faXmark  } from "@fortawesome/free-solid-svg-icons";
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useDisconnect } from '@web3modal/ethers5/react';
import { NFTMetadata } from './NFTMetadata';
// material
import styles from "../styles/mynfts.module.css";
import dotenv from 'dotenv';
dotenv.config();
// component
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const MyNFTs: React.FC<{}> = () =>  {

    const [showloading, setShowLoading] = useState<boolean>(false);
    const { open } = useWeb3Modal();
    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { disconnect } = useDisconnect();
    const [username, setUsername] = useState<string>("");
    const [nftLoaded,setNFTLoaded] = useState<boolean>(false);
    const [userId, setUserId] = useState<number>();
    const [isLoggedIn,setIsloggedIn] = useState<boolean>(false);
    const [showAlertDanger,setShowAlertDanger] = useState<boolean>(false);
    const [errorMessage,seterrorMessage] = useState<string>("");
    const [showListNFTDiv,setShowListNFTDiv] = useState<boolean>(false);
    const [showBgOverlay,setShowBgOverlay] = useState<boolean>(false);
    const [marketplaceAddress] = useState<any>("0xa7c575897e0DC6005e9a24A15067b201a033c453");
    const [listingItemTokenId,setListingItemTokenId] = useState<any>(null);
    const [nftItemPrice, setNftItemPrice] = useState<string>("");
    
    const [nftcontractAddress] = useState<any>("0x871a9C28F81139dCC8571b744d425FFc2c707b15");

    const [myNFTs,setmyNFTS] = useState<NFTMetadata[]>([]);

    useEffect(() => {
        const udetails = JSON.parse(localStorage.getItem("userInfo")!);
        if(udetails && udetails !== null && udetails !== "") {
        const username_ = udetails.username;  
        if(username_) {
            setUsername(username_);
            setUserId(udetails.userId);
            setIsloggedIn(true);
            }
            console.log('is connected',isConnected)
            if(!isConnected) {
              open()
            }
        }else {
            setIsloggedIn(false);
        }

        async function getMyNFTs() {
          try {
              if(walletProvider) {
                  const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
                  const signer = provider.getSigner();
                  /* next, create the item */
                  let contract = new ethers.Contract(nftcontractAddress, NFTMarketPlace, signer);
                  if(contract) {
                      let mintednfts = await contract.getMintedNfts();
                      console.log("hello p",mintednfts);
                      // await mintednfts.forEach(async (element:any) => {
                      //   if(element[1] && element[1] !== "") {
                      //     let ipfsurl = element[1];
                      //     let ipfsurlarray = ipfsurl.split('//');
                          
                      //     let ipfsmetarray = ipfsurlarray[1].split('/');
                      //     const metadata = await axios.get(`https://${ipfsmetarray[0]}.ipfs.nftstorage.link/metadata.json`);
                      //     const { name, description, traits, image } = metadata.data;
                      //     console.log('imgae ',image)
                      //     let img = image.split('/');
                          
                      //     const image_ = `https://${ipfsmetarray[0]}.ipfs.nftstorage.link/${img[3]}`;
                      //     console.log('ffff',image_)
                      //     console.log('ffff metadata',`https://${ipfsmetarray[0]}.ipfs.nftstorage.link/metadata.json`)
                      //     let item: NFTMetadata = {
                      //       name: name,
                      //       image: image_,
                      //       description: description,
                      //       traits: traits,
                      //       chainId: chainId,
                      //       creator: element.creator,
                      //       address: address,
                      //       hascreatedToken: element.hascreatedToken,
                      //       // following properties only exist if the NFT has been minted
                      //       tokenId: element.tokenId,
                      //       tokenURI: element.tokenURI,
                      //     }
                      //     myNFTs.push(item);
                      //     setmyNFTS(myNFTs);
                      //     setNFTLoaded(true);
                      //     console.log('myNFTs ssss---',myNFTs)
                      //     return item;
                      //   }
                      // });
    
                      
                  }
              }
          } catch (error) {
              console.error('Error creating Web3Provider:', error);
              // Handle or rethrow the error as needed
          }
          
      }
      getMyNFTs();

    },[username,userId])
  
    const createNftItem = async () => {
      const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
      const signer = provider.getSigner();
      /* next, create the item */
      console.log('clicked now')
      if(listingItemTokenId && nftItemPrice) {
        try {
          setShowLoading(true)
          let contract = new ethers.Contract(nftcontractAddress, NFTMarketPlace, signer);
          let transaction = contract.createMarketItem(listingItemTokenId,nftItemPrice);
          console.log(transaction.hash);
          
        } catch (error) {
          setShowAlertDanger(true);
          seterrorMessage("Transaction failed, try again");
        }
      }else {
        console.log('clicked     dddee')
        setShowAlertDanger(true);
        seterrorMessage("Enter NFT Item Listing Price");
      }
      
    }

    const openListItemDiv = (tokenid: any) => {
      setListingItemTokenId(tokenid);
      setShowBgOverlay(true);
      setShowListNFTDiv(true);
    }

    const closeListItemModalDiv = () => {
      setShowBgOverlay(false);
      setShowListNFTDiv(false)
    }

    const closeAlertModal = () => {
      setShowAlertDanger(false);
      // setShowBgOverlay(false)
    }

  return (
    <>
    {showloading && <Loading/>}
    {showBgOverlay && <BgOverlay />}
    {showAlertDanger && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
      <div className={styles.main}>
        {showListNFTDiv && 
          <div className={styles.listnftitem}>
            <div className={styles.listnftitem_c}>
              <div className={styles.listnftitem_h}>
                  <div>
                    
                  </div>
                  <div>
                    <h1>List NFT</h1>
                  </div>
                  <div>
                    <button type='button' onClick={closeListItemModalDiv}>{<FontAwesomeIcon icon={faXmark}/>}</button>
                  </div>
              </div>
              <div className={styles.listnftitem_c_in}>
                  <div className={styles.listnftitem_c_ina} key={0}>
                      <div className={styles.list_tc}>
                        <label>NFT Token Id</label>
                        <input type='text' value={listingItemTokenId} readOnly/>
                      </div>
                      <div className={styles.list_tc}>
                        <label>Listing Price(BNB)</label>
                        <input type='text' onChange={(e) => setNftItemPrice(e.target.value) } placeholder='200BNB'/>
                      </div>
                      
                  </div>
                  <div>
                    <button className={styles.createlistitem_} onClick={createNftItem}>List NFT In Market Place</button>
                  </div>
              </div>
            </div>
        </div>
        }
        <div className={styles.main_bg_overlay}></div>
          <div>
            <div>
              <h1>FIFAREWARD NFT MARKET PLACE</h1>
            </div>
            <div className={styles.intro_p}>
              <p>
                Buy NFT Art of football legends using the FRD Token
              </p>
            </div>
          </div>
          {/* banner header */}
          
          <div className={styles.main_c}>
            <div className={styles.settings}>
              <div className={styles.settings_bg_overlay}></div>
              <div className={styles.settings_in}>
                <div className={styles.img_sel}>
                  <h2>NFT Art Of Football Legends</h2>
                </div>
                <div className={styles.nft_option}>
                {nftLoaded && myNFTs.length > 0 && myNFTs?.map((myNFT:NFTMetadata,index:number) => (
                    <div key={index}>
                      <div className={styles.nft_options_} key={index}>
                          <Image src={messi} width={100} height={100}  style={{objectFit:'cover',width: '100%',height: '70%',borderTopLeftRadius: '16px',borderTopRightRadius: '16px'}} alt='bg options'/>
                            <div className={styles.nft_head}>
                                <div className={styles.nft_pfh}><h2>{myNFT.name} {<FontAwesomeIcon icon={faCircleCheck} style={{color:'#e3a204'}}/>}</h2></div>
                                <div className={styles.nft_desc}>
                                    <span>{myNFT.description.substring(0, 40)+' ...'}</span>
                                </div>
                                <div className={styles.nft_addbtn}>
                                    <div className={styles.nft_addr}>
                                      <span>{myNFT.address.substring(0, 8)+' ...'}</span>
                                    </div>
                                    <div className={styles.nft_list}>
                                      <button className={styles.listnft} onClick={() => openListItemDiv(myNFT.tokenId)}>List NFT</button>
                                  </div>
                                </div>
                            </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </div>
    </>
  );
}

export default MyNFTs