import React from 'react'
import { useContext } from 'react';
// import { Container } from '../App'
// import { OutreachButton } from './styles/ButtonVariants.styled'
// import {HashRouter as Router,} from "react-router-dom";
// import Container from 'react-bootstrap/Container';
import Image from 'next/image';
import styles from '../../styles/landing.module.css'
import { useState, useEffect } from 'react';
import Typed from 'react-typed';
import cgk from '../../assets/images/coingecko-aace8f3c.png';
import cmc from '../../assets/images/coinmarketcap-a91aaec1.png';
import stadiumbg from '../../assets/images/footballstadium.jpg';
import quckswap from '../../assets/images/quickswap-light-3af62abd.png';
import peopl_ from '../../assets/images/group.png';
import trust from '../../assets/images/trust.png';
import stat from '../../assets/images/statistics.png';
import developt from '../../assets/images/development.png';
import stakebanner from '../../assets/images/banner.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import avllogo from '../../assets/images/blockchain-avalanche-white-5bb3c6b6.png';
import bnblogo from '../../assets/images/blockchain-binance-white-71f5d555.png';
import cronlogo from '../../assets/images/blockchain-cronos-light-78484d18.png';
import ethlogo from '../../assets/images/blockchain-ethereum-white-c6bf63d1.png';
import fantlogo from '../../assets/images/blockchain-fantom-white-0b93e569.png';
import binancelogo from '../../assets/images/binance.png';
import mexclogo from '../../assets/images/mexc.png';
import okxlogo from '../../assets/images/okx.png';
import pcslogo from '../../assets/images/pcs.png';
import huobilogo from '../../assets/images/huobi.png';
import kucoinlogo from '../../assets/images/kucoin.png';
import stakevest from '../../assets/images/stakevest.png'
import fworldmap from '../../assets/images/world-map.png'
import teamwork from '../../assets/images/Teamwork.png'
import polychlogo from '../../assets/images/blockchain-polygon-white-024b04f0.png';
import { ThemeContext } from '../../contexts/theme-context';
import { library } from '@fortawesome/fontawesome-svg-core'
// import { Chrono } from "react-chrono";
import 'react-vertical-timeline-component/style.min.css';
import dotenv from 'dotenv';
import { fas, faCheck, faCheckCircle,faAlignJustify, faCircleChevronRight, faCheckSquare, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)
dotenv.config();
const Home = () => {
// Create a state variable to manage the visibility of the navigation menu
const [isNavOpen, setNavOpen] = useState(false);
const [stakeReadMore, setStakeReadMore] = useState(false);
const [refReadMore, setRefReadMore] = useState(false);
const [aboutReadMore, setAboutReadMore] = useState(false);
// Array of text values to toggle between
const textValues = ["Read More ...", "Read Less ..."];
// State to track the current index in the array
const [currentStakeRMTextIndex, setCurrentStakeRMTextIndex] = useState(0);
const [currentRefRMTextIndex, setCurrentRefRMTextIndex] = useState(0);
const [currentAboutRMTextIndex, setCurrentAboutRMTextIndex] = useState(0);
const [currentSliderIndex, setCurrentSliderIndex] = useState(0);
const { theme } = useContext(ThemeContext);
const [contractAddress, setcontractAddress] = useState('0x6fe537b0ba874eab212bb8321ad17cf6bb3a0afc');
const [buttonText, setButtonText] = useState("Copy");
const [username, setUsername] = useState<string>("");
const [userId, setUserId] = useState<string>("");  
const [isLoggedIn,setIsloggedIn] = useState<boolean>(false);

const images = [
  cgk,
  cmc,
  quckswap,
  binancelogo,
  mexclogo,
  kucoinlogo,
  huobilogo,
  okxlogo
];

// Function to go to the next image
const goToNextImage = () => {
  setCurrentSliderIndex((prevIndex) => (prevIndex + 1) % images.length);
};

const showStakeReadMore =  () => {
  setStakeReadMore(!stakeReadMore);
  setCurrentStakeRMTextIndex((prevIndex) => (prevIndex + 1) % textValues.length);
}

const showRefReadMore =  () => {
  setRefReadMore(!refReadMore);
  setCurrentRefRMTextIndex((prevIndex) => (prevIndex + 1) % textValues.length);
}

const showAboutReadMore =  () => {
  setAboutReadMore(!aboutReadMore);
  setCurrentAboutRMTextIndex((prevIndex) => (prevIndex + 1) % textValues.length);
}



const handleCopyClick = () => {
   // Create a temporary textarea element
   const textArea = document.createElement('textarea');
   
   // Set the value of the textarea to the text you want to copy
   textArea.value = contractAddress;

   // Append the textarea to the document
   document.body.appendChild(textArea);

   // Select the text inside the textarea
   textArea.select();

   // Execute the copy command
   document.execCommand('copy');

   // Remove the temporary textarea
   document.body.removeChild(textArea);

   // Set the state to indicate that the text has been copied
   setButtonText("Copied");

   // Reset the state after a brief period (optional)
   setTimeout(() => {
      setButtonText("Copy");
   }, 1500);
 };

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
  // Auto-play functionality
  const intervalId = setInterval(goToNextImage, 3000); // Change image every 3 seconds

  // Function to handle window resize
  const handleResize = () => {
    // Check the device width and update isNavOpen accordingly
    if (window.innerWidth <= 990) {
      setNavOpen(false);
    } else {
      setNavOpen(true);
    }
  };

  // Initial check when the component mounts
  handleResize();

  // Add a resize event listener to update isNavOpen when the window is resized
  window.addEventListener('resize', handleResize);

  // Clean up the event listener when the component unmounts
  
  return () => {
    window.removeEventListener('resize', handleResize);
    clearInterval(intervalId);
  };
}, [goToNextImage]);

  return (
    <>
    <div className={`${styles.homemain} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`}>
      <div className={styles.overlay_d}></div>
      <div className={styles.c_content}>
        <video className={styles.bg_video} autoPlay loop muted >
          <source src="./fifarewardvideo.mp4" type="video/mp4"></source>
        </video>
        <div className={styles.c_overlay_d}></div>
          <div className={styles.hero_h1}>
            <div>
              <h1 className={styles.h1}>
                WELCOME TO FIFA REWARD  
              </h1>
            </div>
            <Typed
                    strings={[
                        'Relaunched',
                        'Reliable',
                        'Sustainable',
                        'AI Powered',
                        'Betting',
                        'Buy FRD',
                        'Stake FRD',
                        'Earn Rewards',
                        'Trusted']}
                    typeSpeed={40}
                    backSpeed={50}
                    className={styles.typedHeader}
                    style={{ color: '#e3a204', fontSize: '40px',fontWeight: 600,fontFamily: 'Verdana' }}
                    loop
                />
                <h1>AI Powered Staking Betting Dapp</h1>
            <div>
              <h4 className={styles.hero_h4}>The best AI Powered time-locked betting and staking system on the blockchain. High yield, protected by deflationary measures backed by validator nodes</h4>
            </div>
            
            <div className={styles.get_sd_btns}>
              <a title='get started' href='https://pancakeswap.finance/swap?outputCurrency=0x5ae155F89308CA9050f8Ce1C96741BaDd342C26B' rel='noopener noreferrer' className={styles.getstarted}>Buy FRD</a>
              <a href='/signin' rel='noopener noreferrer' className={styles.learnmore}>Stake FRD</a>
            </div>
            <div className={styles.ca}>
              <span>Contract Address</span> 
              <div className={styles.ca_in}>
                <input title='input' type='text' value={contractAddress} onChange={(e) => setcontractAddress(e.target.value)}/> <button type='button' onClick={handleCopyClick}>{buttonText}</button>
              </div>
            </div>
          </div>
          {/* <div className={styles.hero_image}>
            <Image src={Heroimg} alt='hero img' style={{objectFit: "contain",marginTop: '5rem'}} quality={90} />
          </div> */}
      </div>
      {/* fifa reward betting */}
      <div className={styles.connectworld}>
          <div className={styles.conn_inner}>
            <div className={styles.connectw}>
              <h1>Connecting the world through football</h1>
              <p>
                Football is a sensational sport that connects the world. 
              </p>
              <div>
                <p><span>FifaReward</span> connects the world through blockchain.</p> 
                <p>The first complete decentralized betting system on the blockchain <a href='/betting'>bet on the blockchain</a></p>
                <p>Unique NFT market place of football and soccer legends <a href='/nft'>visit NFT market place</a></p>
              </div>
            </div>
            <div className={styles.conn_image}>
              <Image src={fworldmap} alt='connecting the world through football' />
            </div>
          </div>
      </div>

      {/* dex tools */}
      <div className={styles.exchmain}>
        <h1>FIFAREWARD PARTNERSHIPS</h1>
        <div>
          <h4>Buy FRD from these listed exchanges</h4>
          <div className={styles.dexchanges}>
            <a href='https://pancakeswap.finance/swap?outputCurrency=0x5ae155F89308CA9050f8Ce1C96741BaDd342C26B' rel='noreferrer noopener'><Image src={pcslogo} className={styles.delginks} width={150} height={40} alt='image'/></a>
            <a href='https://www.geckoterminal.com/bsc/pools/0x7c0406a570ca1407c412238c173898cd145fd52e' rel='noreferrer noopener'><Image src={cgk} className={styles.delginks} width={150} height={40} alt='image'/></a>
          </div>
        </div>

        <div>
          <h4>
            Coming Soon Partnerships
          </h4>
          <div className={styles.dexchanges}>
            {images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`slide-${index}`}
              className={styles.delginks}
              style={{
                width: '150px',
                height: '40px',
                margin: 'auto 0 auto 0',
                transform: `translateX(${index * 30 - currentSliderIndex * 50}%)`,
                transition: 'transform 0.5s ease-in-out',
              }}
            />
          ))}
          </div>
        </div>
      </div>

      <div className={styles.stkb}>
        <div>
          <h3>Lauching... </h3>
          <h1>FIFAREWARD ECO SYSTEM</h1>
        </div>
        <div>
          <Image src={stakebanner} quality={90} style={{objectFit:"contain"}} className={styles.stakebanner} alt='banner'/>
        </div>

        <div className={styles.gov}>
          <div className={styles.gov_in}>
            <div className={styles.gov_c}>
              <div className={styles.image_c}><Image src={trust} className={styles.gov_img} alt='image'/></div>
              <h2>Stake Tafa</h2>
              <p>Earn sustainable passive rewards by time locking in our innovative gamified smart contracts.</p>
            </div>
            <div className={styles.gov_c}>
              <div className={styles.image_c}><Image src={peopl_} className={styles.gov_img} alt='image'/></div>
              <h2>DAO Governance </h2>
              <p>Self-sustainable community driven TAFAVAULT with onchain voting</p>
            </div>
            <div className={styles.gov_c}>
              <div className={styles.image_c}><Image src={stat} className={styles.gov_img} alt='image'/></div>
              <h2>Sustainability</h2>
              <p>Mathematically programmed rewards through carefully balanced tokenomics</p>
            </div>
            <div className={styles.gov_c}>
              <div className={styles.image_c}><Image src={developt} className={styles.gov_img} alt='image'/></div>
              <h2>Utility</h2>
              <p>The protocol is asset backed to protect from even the worst conditions in the market.</p>
            </div>  
          </div>
        </div>
      </div>

      <div className={`${styles.frdstaking} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`} id="frdstaking">
          <h1>FIFAREWARD STAKING</h1>
          <div className={styles.stakingmain}>
              <div className={styles.stakevesttext}>
                <h4>WHY STAKE TAFA?</h4>
                <ul>
                  <li>
                    <FontAwesomeIcon icon={faCheckSquare} size='lg' className={styles.chronotitleicon}/> You earn 2% daily return on investment on one of the most growing crypto token.
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckSquare} size='lg' className={styles.chronotitleicon}/> You can withdraw anytime you want
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckSquare} size='lg' className={styles.chronotitleicon}/> Withdraw and convert to any cryptocurrency of your choice in any exchange of your choice
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckSquare} size='lg' className={styles.chronotitleicon}/> FIFAREWARD is a DAO token governed by the community of validators and stakers 
                  </li>
                </ul>
                <p>
                    Welcome to the world of crypto staking - a revolutionary way to maximize your crypto investments! Whether you're an experienced investor or new to the crypto scene, staking offers unparalleled benefits and an avenue for growing your digital assets exponentially.
                </p>
                
                {stakeReadMore && (
                  <>
                    <p>
                    So why settle for stagnant coins when you can start staking and earn continuous daily rewards! Join the millions of crypto enthusiasts who are already embracing this game-changing opportunity.
                    </p>
                    <p>
                    FIFAREWARD staking presents an irresistible opportunity to maximize your investment potential, earn passive income, referral income, and actively contribute to the growth of blockchain networks. By staking your coins, you unlock a world of benefits: secure returns, reduced risks, community participation, and efficient asset allocation. Don't let your crypto assets remain idle any longer! Take control, stake your coins, and start reaping the rewards today - it's time to witness the true power of staking!
                    </p>
                  </>)}  
                  <button type='button' className={styles.readmorebtn} onClick={showStakeReadMore}>{textValues[currentStakeRMTextIndex]}</button>
              </div>
              <div className={styles.stakevestimg}>
                <Image src={stakevest} alt='stake image' quality={90} className={styles.stakevest_img}/>
              </div>
          </div>
      </div>

      <div className={`${styles.aboutfrd} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`} id="aboutfrd">
          <h1>ABOUT FIFAREWARD</h1>
          <p>
            FIFAREWARD is a coinage from TA (Technical Analysis), FA (Fundamental Analysis), and
            XTRA (Extra). FIFAREWARD aims at being the go-to source for reliable information in the
            crypto, forex, and synthetics financial space. We take pride in our ability to provide
            our users with the latest news in the financial markets, as well as premium technical
            analysis on different financial assets. What more? FIFAREWARD team is working on a
            trading bot that will give her users outstanding leverage in trading financial markets
            via several exchanges and brokers.
          </p>
          
          {aboutReadMore && (
            <>
              <p>
                Moreso, understanding and engaging productively in cryptography/cryptocurrency has
                been quite a difficult venture for newbies despite several innovative ways to simplify
                same by many developers.
              </p>
              <p>
                The key problems are overt. Robots and several other methods invented have never
                been all-inclusive, and have little or no bearing on core technical and fundamental
                analysis. FIFAREWARD hence comes in as a multi-dimensional solution in delivering realtime relevant financial news and hybrid expert technical analysis as well as financial
                market updates to its users. FIFAREWARD also provides its users with the best hybrid TAFA-based trading robot for trading several financial markets with several exchanges
                and brokers.
              </p>
            </>
          )}
          <button type='button' className={styles.readmorebtn} onClick={showAboutReadMore}>{textValues[currentAboutRMTextIndex]}</button>
          <ul>
            <h4>Reasons To Buy And Stake FIFAREWARD</h4>
            <li>
              <FontAwesomeIcon icon={faCheckCircle}/> FIFAREWARD staking with fair monthly yield
            </li>
            <li>
              <FontAwesomeIcon icon={faCheckCircle}/> Real-time Crypto, Forex, and Synthetics Trade signal alerts via SMS, emails, and telegram
            </li>
            <li>
              <FontAwesomeIcon icon={faCheckCircle}/> FIFAREWARD token ($TAFA) with several utilities in the FIFAREWARD platform
            </li>
            <li>
              <FontAwesomeIcon icon={faCheckCircle}/> Node as a Service (NaaS) system for FIFAREWARD token
            </li>
            <li>
              <FontAwesomeIcon icon={faCheckCircle}/> FIFAREWARD token launchpads for several blockchains
            </li>
            <li>
              <FontAwesomeIcon icon={faCheckCircle}/> The TafaTaxi Project
            </li>
          </ul>
      </div>

      <div className={`${styles.frdreferrals} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`} id="referrals">
          <h1>FIFAREWARD REFERRAL SYSTEM</h1>
          <div className={styles.referralsmain}>
              <div className={styles.referralstext}>
                <h4>
                  Unlock Unlimited Referral Income: Harness the Power of Community Effects!
                </h4>
                <h5>
                  FIFAREWARD referral system has 3 generations
                </h5>
                <ul>
                  <li>
                    <FontAwesomeIcon icon={faChevronRight} size='lg' className={styles.chronotitleicon}/> First Generation
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faChevronRight} size='lg' className={styles.chronotitleicon}/> Second Generation
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faChevronRight} size='lg' className={styles.chronotitleicon}/> Third Generation
                  </li>
                </ul>
                <ul>
                  <li>
                    <FontAwesomeIcon icon={faCheckSquare} size='lg' className={styles.chronotitleicon}/> You earn 0.5% daily return on investment from all your direct referrals (first genration referrals)
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckSquare} size='lg' className={styles.chronotitleicon}/> You earn 0.3% daily ROI from all your second genration referrals                </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckSquare} size='lg' className={styles.chronotitleicon}/> You earn 0.2% daily ROI from all your second genration referrals
                  </li>
                </ul>

                <p>
                Welcome to the world of Community referral income, where spreading the word about amazing crypto investment opportunities and services can generate lucrative daily returns for you! If you're looking for a reliable avenue to increase your TAFA portfolio and earn passive income, referral programs offer a compelling opportunity 
                </p>
                {refReadMore && (
                  <>
                    <p>
                    Join the ranks of TAFA Staking successful referrers and tap into the network effects to accumulate unlimited FIFAREWARD units. Get ready to watch your assets soar as you leverage the power of referrals!
                    </p>
                    <p>
                    Referral income is a dynamic and rewarding way to earn passive income by sharing information that benefits your community
                    </p>
                    <p>
                    By harnessing the power of community effects and leveraging your relationships, you position yourself as a trusted influencer, earning commission for every successful referral. Make the most of your connections, share the TAFA Staking Protocol , and unlock unlimited referral income. Start referring now to watch your earnings soar and empower others to discover life-changing solutions!
                    </p>
                  </>
                )}
                <button type='button' className={styles.readmorebtn} onClick={showRefReadMore}>{textValues[currentRefRMTextIndex]}</button>
              </div>
              <div className={styles.referralsimg}>
                <Image src={teamwork} alt='team image' quality={90} className={styles.referrals_img}/>
              </div>
          </div>
      </div>

      <div className={styles.tkl}>
        <div className={styles.tkl_in}>
            <div className={styles.tkl_head}>
              <h4>FIFAREWARD</h4>
              <h1>Token Launch Schedule</h1>
              <p>FIFAREWARD is launching in three stages over the coming months</p>
              <p>We start with a huge airdrop, allowing thousands of DeFi users to Free Claim some FIFAREWARD Tokens</p>
              <div className={styles.dexlinks}>
                <a href='https://avax.network' rel='noreferrer noopener' className={styles.dl}><Image src={avllogo} className={styles.launchlinks} alt='image'/></a>
                <a href='https://bnbchain.org' rel='noreferrer noopener' className={styles.dl}><Image src={bnblogo} className={styles.launchlinks} alt='image'/></a>
                <a href='https://fantom.foundation' rel='noreferrer noopener' className={styles.dl}><Image src={fantlogo} className={styles.launchlinks} alt='image'/></a>
                <a href='https://ethereum.org/en' rel='noreferrer noopener' className={styles.dl}><Image src={ethlogo} className={styles.launchlinks} alt='image'/></a>
                <a href='https://polygon.technology' rel='noreferrer noopener' className={styles.dl}><Image src={polychlogo} className={styles.launchlinks} alt='image'/></a>
                <a href='https://cronos.org' rel='noreferrer noopener' className={styles.dl}><Image src={cronlogo} className={styles.launchlinks} alt='image'/></a>
              </div>
            </div>
            <div className={styles.tkl_body}>
              <div className={`${styles.tkl_bc} ${styles.skew1_}`}>
                <h3>STAGE 1</h3>
                <h2>FREE CLAIM</h2>
                <p>Tafa free token claiming program completed and tokens already distributed to qualified addresses. </p>
                <div className={styles.button}>COMPLETED <FontAwesomeIcon icon={faCheck} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}></span></div>
              </div>
              <div className={`${styles.tkl_bc} ${styles.skew2_}`}>
                <h3>STAGE 1</h3>
                <h2>MAINNET LAUNCH</h2>
                <p>Tafa token is live on mainnet, buy, sell, trade, transfer, stake , network, earn rewards and enjoy better life with tafa profits. </p>
                <div className={`${styles.button} ${styles.btn}`}><button >LIVE NOW <FontAwesomeIcon icon={faCheckCircle} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}> </span></button></div>
              </div>
            </div>
        </div>

        <div className={styles.roadmap} id="roadmap"> 
            <div className={styles.rdm}>
                <h1>FIFAREWARD ROADMAP</h1>
                <h4>A Timely Events of FIFAREWARD</h4>
                <div className={styles.tmlc}>
                </div>
             </div>   
        </div>
      </div>

      <div className={`${styles.freeclaim} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`} id="freeclaim">
          <h1>FIFAREWARD FREE CLAIM</h1>
          <div className={styles.freeclaimmain}>
            <p>
              The methods are new, but the concept is old. The difference is in the application and
              how FIFAREWARD has simplified staking in cryptocurrency. FIFAREWARD leverages several
              low-risk staking platforms and the expertise of a team of proven profitable traders to
              generate a yield of 15 to 16.5% returns monthly for her users. It's a hybrid system in
              which the team utilizes years of experience and a complex algorithm that factors in
              impactful financial news and technical analysis to arrive at profitable trading
              decisions. USDT is the base asset for staking. In the future, more will be added
            </p>
            <button type='button' disabled>Completed <FontAwesomeIcon icon={faCheckCircle}/></button>
          </div>
      </div>

    </div>

    

    </>
  )
}

export default Home
