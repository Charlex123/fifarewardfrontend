import React, { useContext,useState,useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import bgopt1 from '../assets/images/aibg.png';
import bgopt2 from '../assets/images/aibg2.jpg';
import bgopt3 from '../assets/images/aibg3.jpg';
import nftbanner from '../assets/images/aibg2.jpg'
import Loading from './Loading';
import NFTMarketPlace from '../../artifacts/contracts/FRDNFTMarketPlace.sol/FRDNFTMarketPlace.json';
import { ethers } from 'ethers';
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck  } from "@fortawesome/free-solid-svg-icons";
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useDisconnect } from '@web3modal/ethers5/react';
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
    const [userId, setUserId] = useState<number>();
    const [isLoggedIn,setIsloggedIn] = useState<boolean>(false);
    const [marketplaceAddress] = useState<any>("0xa7c575897e0DC6005e9a24A15067b201a033c453");

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
  
    
    async function getMyNFTs() {
        try {
            if(walletProvider) {
                const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
                const signer = provider.getSigner();
                console.log("signer ",signer,address);
                console.log("eal ",signer,address)
                
                /* next, create the item */
                let contractsss = new ethers.Contract(marketplaceAddress, NFTMarketPlace.abi, signer);
                console.log('contract',contractsss)
                console.log('get code',provider.getCode(address || ''));
                if(contractsss) {
                    contractsss.getMintedNfts();
                }
                // let transaction = await contractsss.createToken('primehealth.ng');
                // await transaction.wait();
                // console.log('transactions ccc',transaction)
            
            }
        } catch (error) {
            console.error('Error creating Web3Provider:', error);
            // Handle or rethrow the error as needed
        }
        
    }
    getMyNFTs();

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
                  <div className={styles.nft_options_}>
                        <a className={styles.nft_link} href='/nft/nft-link-address'>
                            <Image src={bgopt3}  style={{objectFit:'cover',width: '100%',height: '73%',borderTopLeftRadius: '8px',borderTopRightRadius: '8px'}} alt='bg options'/>
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
                  <div className={styles.nft_options_}>
                    <a className={styles.nft_link} href='/nft/nft-link-address'>
                        <Image src={bgopt3}  style={{objectFit:'cover',width: '100%',height: '73%',borderTopLeftRadius: '8px',borderTopRightRadius: '8px'}} alt='bg options'/>
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
                  <div className={styles.nft_options_}>
                    <a className={styles.nft_link} href='/nft/nft-link-address'>
                        <Image src={bgopt3}  style={{objectFit:'cover',width: '100%',height: '73%',borderTopLeftRadius: '8px',borderTopRightRadius: '8px'}} alt='bg options'/>
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
                  <div className={styles.nft_options_}>
                    <a className={styles.nft_link} href='/nft/nft-link-address'>
                        <Image src={bgopt3}  style={{objectFit:'cover',width: '100%',height: '73%',borderTopLeftRadius: '8px',borderTopRightRadius: '8px'}} alt='bg options'/>
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

export default MyNFTs