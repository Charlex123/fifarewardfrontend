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
import bnblogo from '../assets/images/bnb-bnb-logo.png'
import messi from '../assets/images/messi.png.png'
import nftbanner from '../assets/images/aibg2.jpg';
import NFTCountdownTimer from './NftCountDownTimer';
import { faCheckCircle, faEye, faEyeSlash, faHeart, faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faAlignJustify, faCartPlus, faCartShopping, faChevronLeft, faCircleCheck, faLocationArrow, faLocationPin, faMicrophone, faTag, faXmark  } from "@fortawesome/free-solid-svg-icons";
// material
import styles from "../styles/nftart.module.css";
import dotenv from 'dotenv';
dotenv.config();
// component
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const Airdrop: React.FC<{}> = () =>  {

 
  useEffect(() => {
    
  })
  
  return (
    <>
      <div className={styles.main}>
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

export default Airdrop