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
import axios from 'axios';
import NFTMarketPlace from '../../artifacts/contracts/FRDNFTMarketPlace.sol/FRDNFTMarketPlace.json';
import { ethers } from 'ethers';
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck  } from "@fortawesome/free-solid-svg-icons";
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useDisconnect } from '@web3modal/ethers5/react';
import { NFTMetadata } from './NFTMetadata';
// material
import styles from "../styles/nftmarketplace.module.css";
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
    const [nfts, setNfts] = useState<NFTMetadata[]>([]);
    const [userId, setUserId] = useState<number>();
    const [isLoggedIn,setIsloggedIn] = useState<boolean>(false);
    const [marketplaceAddress] = useState<any>("0xa7c575897e0DC6005e9a24A15067b201a033c453");
    const [contractAddress] = useState<any>("0x871a9C28F81139dCC8571b744d425FFc2c707b15");

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

        async function getMyNFTs() {
          try {
              if(walletProvider) {
                  const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
                  const signer = provider.getSigner();
                  /* next, create the item */
                  let contract = new ethers.Contract(contractAddress, NFTMarketPlace, signer);
                  if(contract) {
                      let mintednfts = await contract.getMintedNfts();
                      console.log('minted nfts',mintednfts);
                      console.log('minted nfts length',mintednfts.length);
                      let items =  mintednfts.forEach(async (element:any) => {
                        console.log('nnnn',element[1])
                        if(element[1] && element[1] !== "") {
                          let ipfsurl = element[1].tokenURI;
                          let ipfsurlarray = ipfsurl.split('//');
                          console.log('juolaer',ipfsurlarray);
                          let ipfsmetarray = ipfsurlarray[1].split('/');
                          const metadata = await axios.get(`https://${ipfsmetarray[0]}.ipfs.nftstorage.link/metadata.json`);
                          console.log('metadata gggg',metadata.data);
                          const { name, description, traits, image } = metadata.data;
    
                          let item: NFTMetadata = {
                            name: name,
                            image: image,
                            description: description,
                            traits: traits,
                            chainId: chainId,
                            creator: element[1].creator,
                            address: address,
                            hascreatedToken: element[1].hascreatedToken,
                            // following properties only exist if the NFT has been minted
                            tokenId: element[1].tokenId,
                            tokenURI: element[1].tokenURI,
                          }
                          return item
                        }
                      });
    
                      setNfts(items);
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
    {showloading && <Loading/>}
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
                        <Image src={messi2}  style={{objectFit:'cover',width: '100%',height: '73%',borderTopLeftRadius: '8px',borderTopRightRadius: '8px'}} alt='bg options'/>
                        <div className={styles.nft_head}>
                            <div className={styles.nft_pfh}><h2>Lionel Messi {<FontAwesomeIcon icon={faCircleCheck} style={{color:'#e3a204'}}/>}</h2></div>
                            <div className={styles.nft_addr}>
                                <span>0x456...</span>
                            </div>
                            <div className={styles.nft_price}>
                                <div className={styles.nft_pf}>1500FRD</div>
                                <div className={styles.nft_pf_btn}>Buy</div>
                            </div>
                        </div>
                    </a>
                  </div>
                  <div className={styles.nft_options_}>
                    <a className={styles.nft_link} href='/nft/nft-link-address'>
                        <Image src={zidane1}  style={{objectFit:'cover',width: '100%',height: '73%',borderTopLeftRadius: '8px',borderTopRightRadius: '8px'}} alt='bg options'/>
                        <div className={styles.nft_head}>
                            <div className={styles.nft_pfh}><h2>Zinadane Zidane {<FontAwesomeIcon icon={faCircleCheck} style={{color:'#e3a204'}}/>}</h2></div>
                            <div className={styles.nft_addr}>
                                <span>0x456...</span>
                            </div>
                            <div className={styles.nft_price}>
                                <div className={styles.nft_pf}>500FRD</div>
                                <div className={styles.nft_pf_btn}>Buy</div>
                            </div>
                        </div>
                    </a>
                  </div>
                  <div className={styles.nft_options_}>
                    <a className={styles.nft_link} href='/nft/nft-link-address'>
                        <Image src={osimhen}  style={{objectFit:'cover',width: '100%',height: '73%',borderTopLeftRadius: '8px',borderTopRightRadius: '8px'}} alt='bg options'/>
                        <div className={styles.nft_head}>
                            <div className={styles.nft_pfh}><h2>Victor Osimhen {<FontAwesomeIcon icon={faCircleCheck} style={{color:'#e3a204'}}/>}</h2></div>
                            <div className={styles.nft_addr}>
                                <span>0x456...</span>
                            </div>
                            <div className={styles.nft_price}>
                                <div className={styles.nft_pf}>1000FRD</div>
                                <div className={styles.nft_pf_btn}>Buy</div>
                            </div>
                        </div>
                    </a>
                  </div>
                  <div className={styles.nft_options_}>
                    <a className={styles.nft_link} href='/nft/nft-link-address'>
                        <Image src={messi}  style={{objectFit:'cover',width: '100%',height: '73%',borderTopLeftRadius: '8px',borderTopRightRadius: '8px'}} alt='bg options'/>
                        <div className={styles.nft_head}>
                            <div className={styles.nft_pfh}><h2>Lionel Messi {<FontAwesomeIcon icon={faCircleCheck} style={{color:'#e3a204'}}/>}</h2></div>
                            <div className={styles.nft_addr}>
                                <span>0x456...</span>
                            </div>
                            <div className={styles.nft_price}>
                                <div className={styles.nft_pf}>2000FRD</div>
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

export default MyNFTs