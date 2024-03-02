import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import bgopt1 from '../assets/images/aibg.png';
import bgopt2 from '../assets/images/aibg2.jpg';
import bgopt3 from '../assets/images/aibg3.jpg';
import nftbanner from '../assets/images/aibg2.jpg'
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
// material
import Loading from './Loading';
import BgOverlay from './BgOverlay';
import AlertDanger from './AlertDanger';
import axios from 'axios';
import NFTMarketPlaceContract from '../../artifacts/contracts/FRDNFTMarketPlace.sol/FRDNFTMarketPlace.json';
import { ethers } from 'ethers';
import { faCircleCheck, faXmark  } from "@fortawesome/free-solid-svg-icons";
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useDisconnect } from '@web3modal/ethers5/react';
import { NFTMetadata } from './NFTMetadata';

import styles from "../styles/nftmarketplace.module.css";
import dotenv from 'dotenv';
dotenv.config();
// component
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const NFTMarketPlace: React.FC<{}> = () =>  {

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
              let contract = new ethers.Contract(nftcontractAddress, NFTMarketPlaceContract, signer);
              if(contract) {
                  let unsoldnfts = await contract.fetchUnSoldMarketItems();
                  console.log('der',unsoldnfts)
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
  
  return (
    <>
      <div className={styles.main}>
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
          <div className={styles.hero_banner}>
            <div>
                <Image src={nftbanner} alt='banner' style={{width: '100%',height:'550px',}}/>
            </div>
          </div>
          <div className={styles.main_c}>
            <div className={styles.settings}>
              <div className={styles.settings_bg_overlay}></div>
              <div className={styles.settings_in}>
                <div className={styles.img_sel}>
                  <h2>NFT Art Of Football Legends</h2>
                </div>
                <div className={styles.nft_option}>
                  <div className={styles.nft_options_}>
                    <a className={styles.nft_link} href='/nft/nft-link-address'>
                        <Image src={bgopt1}  style={{objectFit:'cover',width: '100%',height: '73%',borderTopLeftRadius: '8px',borderTopRightRadius: '8px'}} alt='bg options'/>
                        <div className={styles.nft_head}>
                            <div className={styles.nft_pfh}><h2>Football Leegend Name {<FontAwesomeIcon icon={faCircleCheck} style={{color:'#e3a204'}}/>}</h2></div>
                            <div className={styles.nft_addr}>
                                <span>0x456...</span>
                            </div>
                            <div className={styles.nft_price}>
                                <div className={styles.nft_pf}>10000FRD</div>
                                <div className={styles.nft_pf_btn}>Buy</div>
                            </div>
                        </div>
                    </a>
                  </div>
                  <div className={styles.nft_options_}>
                    <a className={styles.nft_link} href='/nft/nft-link-address'>
                        <Image src={bgopt2}  style={{objectFit:'cover',width: '100%',height: '73%',borderTopLeftRadius: '8px',borderTopRightRadius: '8px'}} alt='bg options'/>
                        <div className={styles.nft_head}>
                            <div className={styles.nft_pfh}><h2>Football Leegend Name {<FontAwesomeIcon icon={faCircleCheck} style={{color:'#e3a204'}}/>}</h2></div>
                            <div className={styles.nft_addr}>
                                <span>0x456...</span>
                            </div>
                            <div className={styles.nft_price}>
                                <div className={styles.nft_pf}>10000FRD</div>
                                <div className={styles.nft_pf_btn}>Buy</div>
                            </div>
                        </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </>
  );
}

export default NFTMarketPlace