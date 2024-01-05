import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import chatbotlogo from '../assets/images/aichatbot.png';
import successimage from '../assets/images/success1.png';
import elipsisloading from '../assets/images/Ellipsis-1s-200px.svg';
import bgopt1 from '../assets/images/aibg.png';
import bgopt2 from '../assets/images/aibg2.jpg';
import bgopt3 from '../assets/images/aibg3.jpg';
import nftbanner from '../assets/images/aibg2.jpg'
import { faCheckCircle, faEye, faEyeSlash, faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft, faCircleCheck, faLocationArrow, faLocationPin, faMicrophone, faXmark  } from "@fortawesome/free-solid-svg-icons";
// material
import styles from "../styles/nftmarketplace.module.css";
import dotenv from 'dotenv';
dotenv.config();
// component
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const NFTMarketPlace: React.FC<{}> = () =>  {

 
  useEffect(() => {
    
  })
  
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

export default NFTMarketPlace