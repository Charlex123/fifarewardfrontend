import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import bnblogo from '../assets/images/bnb-bnb-logo.png'
import messi from '../assets/images/messi.png';
import { ThemeContext } from '../contexts/theme-context';
import NFTCountdownTimer from './NftCountDownTimer';
import NFTMarketPlace from '../../artifacts/contracts/FRDNFTMarketPlace.sol/FRDNFTMarketPlace.json';
import axios from 'axios';
import { ethers } from 'ethers';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useDisconnect } from '@web3modal/ethers5/react';
import { NFTBidMetadata } from './NFTBidMetadata';
import { NFTFullMetadata } from './NFTFullMetadata';
import { faEye, faEyeSlash, faHeart, } from "@fortawesome/free-regular-svg-icons";
import { faAlignJustify, faCartShopping, faCircleCheck, faTag, faXmark  } from "@fortawesome/free-solid-svg-icons";
// material
import styles from "../styles/nftart.module.css";
import dotenv from 'dotenv';
dotenv.config();
// component
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const NFTArt: React.FC<{}> = () =>  {

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
    const [listingItemTokenId,setListingItemTokenId] = useState<any>(null);
    const [nftItemPrice, setNftItemPrice] = useState<string>("");
    const [bidduration, setBidDuration] = useState<any>(0);
    const [reservedbuyer, setReservedBuyer] = useState<any>("0x0000000000000000000000000000000000000000");
    const [minbidamount, setMinBidAmount] = useState<any>(0);
    const [salesroyaltyfee, setSalesRoyaltyFee] = useState<any>(2);
    const { theme } = useContext(ThemeContext);
    const [nftactionsuccess,setActionSuccess] = useState<boolean>(false);
    const [windowloadgetbetruntimes, setwindowloadgetbetruntimes] = useState<number>(0);
    
    const NFTCA = process.env.NEXT_PUBLIC_FRD_NFTMARKETPLACE_CA;
    const NFTFeatureCA = process.env.NEXT_PUBLIC_FRD_NFTMARKETPLACE_FEATURES_CA;

    const [itemBids,setItemBids] = useState<NFTBidMetadata[]>([]);

    const [mylistedNFTs,setmyListedNFTS] = useState<NFTFullMetadata[]>([]);

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
            if(!isConnected) {
              open();

            }
        }else {
            setIsloggedIn(false);
        }

      if(windowloadgetbetruntimes <= 0) {
        const getMyUnlistedNFTs = async () => {
          try {
              setShowLoading(true);
              if(walletProvider) {
                  const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
                  const signer = provider.getSigner();
                  /* next, create the item */
                  let contract = new ethers.Contract(NFTCA!, NFTMarketPlace, signer);
                  
                  if(contract) {
                      let mintednfts = await contract.getMintedNfts();
                      
                      await mintednfts.forEach(async (element:any) => {
                        if(element[1] && element[1] !== "") {
                          let item: NFTBidMetadata = {
                            tokenId: element.tokenId,
                            itemId: element.itemId,
                            tokenURI: element.tokenUrI,
                            biddingId: element.biddingId,
                            biddingtime: element.biddingtime,
                            bidderaddress: element.bidderaddress,
                            creator: element.creator,
                            owner: element.owner,
                            biddingprice: element.biddingprice,
                            biddingsuccess: element.biddingsuccess,
                            wasitempurchased: element.wasitempurchased
                          }
                          itemBids.push(item);
                          setItemBids(itemBids);
                          setNFTLoaded(true);
                          setShowLoading(false);
                          setwindowloadgetbetruntimes(1);
                          console.log('itemBids ssss---',itemBids)
                          return item;
                        }
                      });
                      
                  }
              }
          } catch (error) {
              console.error('Error creating Web3Provider:', error);
              // Handle or rethrow the error as needed
          }
          
      }
      getMyUnlistedNFTs();

        const getMyListedNFTs = async () => {
          try {
              setShowLoading(true);
              if(walletProvider) {
                  const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
                  const signer = provider.getSigner();
                  /* next, create the item */
                  let contract = new ethers.Contract(NFTCA!, NFTMarketPlace, signer);
                  
                  if(contract) {
                      let listednfts = await contract.fetchItemsCreated();
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
                            creator: element.creator,
                            owner: element.owner,
                            hascreatedToken: element.hascreatedToken,
                            // following properties only exist if the NFT has been minted
                            tokenId: element.tokenId,
                            tokenURI: element.tokenURI,
                            price: element.sellingprice,
                            seller: element.seller,
                            itemId: element.itemId,
                            biddingduration: element.biddingduration,
                            minbidamount: element.minbidamount,
                            sold: element.sold,
                          }
                          mylistedNFTs.push(item);
                          setmyListedNFTS(mylistedNFTs);
                          setNFTLoaded(true);
                          setShowLoading(false);
                          setwindowloadgetbetruntimes(1);
                          console.log('mylistedNFTs ssss---',mylistedNFTs)
                          return item;
                        }
                      });
                      
                  }
              }
          } catch (error) {
              console.error('Error creating Web3Provider:', error);
              // Handle or rethrow the error as needed
          }
          
      }
      getMyListedNFTs();

      }

          
    },[username,userId,windowloadgetbetruntimes])
  
  return (
    <>
      <div className={`${styles.main} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`}>
        <div className={styles.main_bg_overlay}></div>
          
          <div className={styles.main_c}>
            <div className={styles.nft_art}>
                <div className={styles.nft_art_bg_overlay}></div>
                <div className={styles.nft_art_}>
                    <div className={styles.nft_art_top}>
                        <div className={styles.nft_op}>
                            <div className={styles.nft_op_}>
                                <Image src={bnblogo} alt='bnb logo' style={{width: '25px'}}/>
                            </div>
                            <div className={styles.nft_op_}>
                                <button>{<FontAwesomeIcon icon={faHeart}/>}</button>
                            </div>
                        </div>  
                    </div>
                    <div className={styles.nft_art_in}>
                        <Image src={messi} alt='nft art' style={{objectFit: 'cover',width: '100%',height: '100%',marginTop: '0',borderBottomLeftRadius: '8px',borderBottomRightRadius: '8px'}}/>
                    </div>
                </div>
            </div>

            <div className={styles.nft_auctn}>
                <div className={styles.nft_auctn_in}>
                    <div>
                        <div>
                        <h1> NFT NAME ..0x3e4</h1>
                        </div>
                        <div className={styles.intro_p}>
                        <p>
                            Created By <span className={styles.createdby}>FIFAREWARD</span>
                        </p>
                        </div>
                    </div>
                </div>
                <div className={styles.nft_auctbuy}>
                    <div className={styles.sales_p}>
                        <span>Sales ends </span> 
                    </div>
                    <div className={styles.timer}>
                        <NFTCountdownTimer time={8640000}/>
                    </div>
                    <div className={styles.nft_p}>
                        <div className={styles.cp}>
                            <span className={styles.cp_in}>Current price</span>
                        </div>
                        <div className={styles.ap}>
                            <span className={styles.ap_in}>10000 FRD </span> <span className={styles.ap_inp}>12.2$</span>
                        </div>
                        <div className={styles.b_btns}>
                            <button className={styles.b_btn1}>Buy Now </button> <button className={styles.b_btn2}><span>{<FontAwesomeIcon icon={faCartShopping}/>}</span></button>
                        </div>
                    </div>
                </div>

                <div className={styles.nft_det}>
                    <div className={styles.det_p}>
                        <div className={styles.det_p_in}>
                            {<FontAwesomeIcon icon={faTag}/>} <span>Details </span> 
                        </div>
                    </div>
                    <div className={styles.det_list}>
                        <div className={styles.lp}>
                            <ul>
                                <li>
                                    <div className={styles.li_det}>
                                        <div>
                                            Contract Address
                                        </div>
                                        <div>
                                            <a href='link' rel='noopener noreferrer'>0x2343874......</a>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className={styles.li_det}>
                                        <div>
                                            TokenId
                                        </div>
                                        <div>
                                            9787
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className={styles.li_det}>
                                        <div>
                                            Token Standard
                                        </div>
                                        <div>
                                            BEP-20
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className={styles.li_det}>
                                        <div>
                                            Chain
                                        </div>
                                        <div>
                                            Binance Smart Chain
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.nft_desc}>
                <div className={styles.descp}>
                    {<FontAwesomeIcon icon={faAlignJustify}/>} <span>Description</span>
                </div>
                <div className={styles.descp_m}>
                    <div className={styles.descp_m_in}>
                        <span className={styles.by}>By</span> <span className={styles.fr}>FIFAREWARD {<FontAwesomeIcon icon={faCircleCheck} style={{fontSize: '16px',marginBottom: '2px',color: '#e28305'}}/>}</span>
                    </div>
                    <p>
                        An Expanded VibeNauts Derivative Collection with the Entire Collection Featuring the Almighty 0x Yellow Background. For the Culture.
                    </p>
                </div>
            </div>
          </div>
      </div>
    </>
  );
}

export default NFTArt