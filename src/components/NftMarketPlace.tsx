import React, { useEffect, useState,useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
// material
import Loading from './Loading';
import BgOverlay from './BgOverlay';
import AlertDanger from './AlertDanger';
import ActionSuccessModal from './ActionSuccess';
import { ThemeContext } from '../contexts/theme-context';
import axios from 'axios';
import nftbg from '../assets/images/nftbg.jpg'
import NFTMarketPlaceContractAbi from '../../artifacts/contracts/FRDNFTMarketPlace.sol/FRDNFTMarketPlace.json';
import NFTMarketPlaceFeaturesContractAbi from '../../artifacts/contracts/FRDNFTMarketPlaceFeatures.sol/FRDNFTMarketPlaceFeatures.json';
import { ethers } from 'ethers';
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useDisconnect } from '@web3modal/ethers5/react';
import { NFTFullMetadata } from './NFTFullMetadata';
import HelmetExport from 'react-helmet';

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
  const Wprovider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545");
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const  walletPrivKey: any = process.env.NEXT_PUBLIC_FRD_PRIVATE_KEY as any;

  const { disconnect } = useDisconnect();
  const { theme } = useContext(ThemeContext);
  const [username, setUsername] = useState<string>("");
  const [nftLoaded,setNFTLoaded] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>();
  const [isLoggedIn,setIsloggedIn] = useState<boolean>(false);
  const [showAlertDanger,setShowAlertDanger] = useState<boolean>(false);
  const [errorMessage,seterrorMessage] = useState<string>("");
  const [showBgOverlay,setShowBgOverlay] = useState<boolean>(false);
  const [windowloadgetbetruntimes, setwindowloadgetbetruntimes] = useState<number>(0);
  const [nftactionsuccess,setActionSuccess] = useState<boolean>(false);
  // const [connectedCount, setConnectedCount] = useState<number>(0);
  
  
  const nftcontractAddress = process.env.NEXT_PUBLIC_NFTMARKEPLACE_DEPLOYED_CA;
  const nftfeaturescontractAddress = process.env.NEXT_PUBLIC_FRD_NFTMARKETPLACE_FEATURES_CA;

  const [listedNFTs,setListedNFTS] = useState<NFTFullMetadata[]>([]);
  
  const router = useRouter();

  useEffect(() => {

    console.log("frd priv key",walletPrivKey);
    console.log("frd priv key",walletProvider);

    if(windowloadgetbetruntimes == 0) {
      const getListedNFTs = async () => {
        try {
            // setShowLoading(true);
            const provider = walletProvider as any || Wprovider as any;
            console.log(" w all provider",provider,'der',walletProvider)
            const wallet = new ethers.Wallet(walletPrivKey as any, provider);
            const signer = provider.getSigner(wallet.address);
            
            if(signer) {
                /* next, create the item */
                console.log("signer we",signer);
                let contract = new ethers.Contract(nftfeaturescontractAddress!, NFTMarketPlaceFeaturesContractAbi, signer);
                console.log("contract",contract)
                if(contract) {
                    let listednfts = await contract.fetchUnSoldAuctionItems();
                    console.log("listed nfts",listednfts)
                    await listednfts.forEach(async (element:any) => {
                      if(element[1] && element[1] !== "") {
                        let ipfsurl = element[2];
                        let ipfsurlarray = ipfsurl.split('//');
                        
                        let ipfsmetarray = ipfsurlarray[1].split('/');
                        const metadata = await axios.get(`https://${ipfsmetarray[0]}.ipfs.nftstorage.link/metadata.json`);
                        const { name, description, traits, image } = metadata.data;
                        let img = image.split('//');
                        const image_ = `https://nftstorage.link/ipfs/${img[1]}`;
                        console.log("image_",image_)
                        let item: NFTFullMetadata = {
                          name: name,
                          image: image_,
                          description: description,
                          traits: traits,
                          chainId: chainId,
                          seller: element.seller,
                          creator: element.creator,
                          owner: element.owner,
                          hascreatedToken: element.hascreatedToken,
                          // following properties only exist if the NFT has been minted
                          tokenId: element.tokenId,
                          tokenURI: element.tokenURI,
                          price: element.sellingprice,
                          itemId: element.itemId,
                          biddingduration: element.biddingduration,
                          minbidamount: element.minbidamount,
                          sold: element.sold,
                        }
                        listedNFTs.push(item);
                        setListedNFTS(listedNFTs);
                        setNFTLoaded(true);
                        setShowLoading(false);
                        setwindowloadgetbetruntimes(1);
                        console.log('listedNFTs ssss---',listedNFTs)
                        return item;
                      }
                    });
                    setShowLoading(false);
                }
            }
        } catch (error) {
            console.error('Error creating Web3Provider:', error);
            // Handle or rethrow the error as needed
        }
        
      }
      getListedNFTs();
    }

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
          // open();
        }else {
          // setShowLoading(false);
          // console.log("connected count",connectedCount);
          // if(connectedCount <= 0) {
          //   setConnectedCount(1);
          //   router.reload();
          // }else {
          //   //
          // }
        }
    }else {
        setIsloggedIn(false);
    }

    
},[username,userId,windowloadgetbetruntimes])

const toggleAddr = (e:any) => {
  e.previousElementSibling.style.display = (e.previousElementSibling.style.display === 'block') ? 'none' : 'block';
}

const closeAlertModal = () => {
  setShowAlertDanger(false);
  setShowBgOverlay(false);
}

const closeActionModalComp = () => {
  // let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
  // hiw_bgoverlay.style.display = 'none';
  setShowBgOverlay(false);
  setActionSuccess(false);
  router.reload();
}
  
const closeBgModal = () => {
  setShowLoading(false);
  setShowBgOverlay(false);
}

  return (
    <>
    <HelmetExport>
        <title> NFT MarketPlace | FifaReward</title>
        <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
    </HelmetExport>
    {showloading && <Loading/>}
    {showBgOverlay && <BgOverlay onChange={closeBgModal}/>}
    {showAlertDanger && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
    {nftactionsuccess && 
        <ActionSuccessModal prop='NFT Item Auction ' onChange={closeActionModalComp}/>
    }
      <div className={`${styles.main} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`}>
        <div className={styles.main_bg_overlay}></div>
          <div>
            <div>
              <h1>FIFAREWARD NFT MARKET PLACE</h1>
            </div>
            <div className={styles.intro_p}>
              <h3>
                Bid And Buy NFT Art Of Football Legends 
              </h3>
            </div>
          </div>
          {/* banner header */}
          <div className={styles.hero_banner}>
              <Image src={nftbg} alt='banner' style={{width: '100%',height: '100%'}} />
          </div>
          <div className={styles.main_c}>
            <div className={styles.settings}>
              <div className={styles.settings_bg_overlay}></div>
              <div className={styles.settings_in}>
                
                <div className={styles.nft_option}>
                  {nftLoaded && listedNFTs.length > 0 ? listedNFTs?.map((listedNFT:NFTFullMetadata,index:number) => (
                    <>
                      <div key={index} className={styles.nft_options_}>
                       <div className={styles.nft_options__}>
                           <a href={`/nft/${listedNFT.name.replace(/[ ]+/g, "-")}/${listedNFT.tokenId!.toString()}`}>
                             <Image src={listedNFT.image} width={100} priority height={100}  style={{objectFit:'cover',width: '100%',margin: 'auto',textAlign: 'center',height: '250px',borderTopLeftRadius: '16px',borderTopRightRadius: '16px',padding: '0'}} alt='bg options'/>
                             <div className={styles.nft_head}>
                                 <div className={styles.nft_pfh}><h2>{listedNFT.name} {<FontAwesomeIcon icon={faCircleCheck} style={{color:'#e3a204'}}/>}</h2></div>
                                 <div className={styles.nft_desc}>
                                     <span>{listedNFT.description.substring(0, 40)+' ...'}</span>
                                 </div>
                                 <div className={styles.nft_addbtn}>
                                     <div className={styles.nft_addr}>
                                       <span>{listedNFT.owner.substring(0, 8)+' ...'}</span>
                                       <span className={styles.c_nft_addr}>{listedNFT.owner}</span>
                                       <button type='button' onClick={(e) => toggleAddr(e.target)} className={styles.addr_btn}>view</button>
                                     </div>
                                     <div className={styles.nft_list}>
                                       <button className={styles.listed}>Bid NFT</button> 
                                     </div>
                                 </div>
                                 <div className={styles.nft_list_p}>
                                   <div>
                                     <div className={styles.listedp}>Selling Price</div> <div className={styles.listedp}>{listedNFT.price?.toNumber()}{listedNFT.chainId = 97 ? 'BNB': 'MATIC'}</div>
                                   </div>
                                   <div>
                                     <div className={styles.listedp}>Min Bid Price</div> <div className={styles.listedp}>{listedNFT.minbidamount?.toNumber()}{listedNFT.chainId = 97 ? 'BNB': 'MATIC'}</div>
                                   </div>
                                   <div>
                                     <div className={styles.listedp}>Sold</div> <div className={styles.listedp}>{listedNFT.sold == false ? 'No' : 'Yes'}</div>
                                   </div>
                                 </div>
                                 <div className={styles.nft_list_p}>
                                   <div>
                                     <span className={styles.listedp}>Bidding Duration</span> <span className={styles.listedp}>{listedNFT.biddingduration?.toNumber()} Days</span>
                                   </div>
                                 </div>
                             </div>
                           </a>
                       </div>
                     </div>
                    </>
                  )) : 
                  <div className={styles.notfound_p}>
                    <div className={styles.notfound}>
                      No NFT data was found
                    </div>
                  </div>
                  }
                  
                </div>
              </div>
            </div>
          </div>
      </div>
    </>
  );
}

export default NFTMarketPlace