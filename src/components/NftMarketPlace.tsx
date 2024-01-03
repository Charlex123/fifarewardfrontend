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
import { faChevronLeft, faLocationArrow, faLocationPin, faMicrophone, faXmark  } from "@fortawesome/free-solid-svg-icons";
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
                <h2>Image Generaion Options</h2>
                <div className={styles.img_sel}>
                  <h2>Select your preferred image options</h2>
                </div>
                <div className={styles.bg_option}>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt1}  style={{objectFit:'cover',width: '100%',height: '70%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>3 D</div>
                    <div className={styles.bg_opt_text}>3 D</div>
                    <div className={styles.bg_opt_text}>3 D</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt2}  style={{objectFit:'cover',width: '100%',height: '70%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>Vintage</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt3}  style={{objectFit:'cover',width: '100%',height: '70%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>Human</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt1}  style={{objectFit:'cover',width: '100%',height: '70%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>3 D</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt2}  style={{objectFit:'cover',width: '100%',height: '70%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>3 D</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt3}  style={{objectFit:'cover',width: '100%',height: '70%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>3 D</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt1}  style={{objectFit:'cover',width: '100%',height: '70%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>3 D</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt2}  style={{objectFit:'cover',width: '100%',height: '70%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>Vintage</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt3}  style={{objectFit:'cover',width: '100%',height: '70%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>Human</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt1}  style={{objectFit:'cover',width: '100%',height: '70%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>3 D</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt2}  style={{objectFit:'cover',width: '100%',height: '70%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>3 D</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt3}  style={{objectFit:'cover',width: '100%',height: '70%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>3 D</div>
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