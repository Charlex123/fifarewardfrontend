import React from 'react'
import { useState, useEffect } from 'react';
// import { Container } from '../App'
// import { OutreachButton } from './styles/ButtonVariants.styled'
// import {HashRouter as Router,} from "react-router-dom";
// import Container from 'react-bootstrap/Container';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/landing.module.css'
import Typed from 'react-typed';
import RoadMap from '../RoadMap';
import cgk from '../../assets/images/coingecko-aace8f3c.png';
import cmc from '../../assets/images/coinmarketcap-a91aaec1.png';
import chainhead from '../../assets/images/chainhead.gif';
import quckswap from '../../assets/images/quickswap-light-3af62abd.png';
import aibanner from '../../assets/images/aibanner2.png'
// import dappimg from '../../assets/images/dapp.png';
// import bnblogo from '../../assets/images/blockchain-binance-white-71f5d555.png';
// import cronlogo from '../../assets/images/blockchain-cronos-light-78484d18.png';
// import ethlogo from '../../assets/images/blockchain-ethereum-white-c6bf63d1.png';
import stakeimg from '../../assets/images/stake.png';
import betbg from '../../assets/images/betting.png'
import binancelogo from '../../assets/images/binance.png';
import mexclogo from '../../assets/images/mexc.png';
import okxlogo from '../../assets/images/okx.png';
import refgroup from '../../assets/images/refgroup.png';
import huobilogo from '../../assets/images/huobi.png';
import kucoinlogo from '../../assets/images/kucoin.png';
import frdbanner from '../../assets/images/frdbanner.gif';
import fanforum from '../../assets/images/fanforumbanner.png';
import nftbanner from '../../assets/images/nftbanner.png'
import gamebanner from '../../assets/images/guessherobanner.png'
// import fworldmap from '../../assets/images/world-map.png'
// import teamwork from '../../assets/images/Teamwork.png'
import betmob from '../../assets/images/betmob.png';
import { ThemeContext } from '../../contexts/theme-context';
// import { Chrono } from "react-chrono";
import 'react-vertical-timeline-component/style.min.css';
import dotenv from 'dotenv';
// library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)
dotenv.config();
const Home = () => {
// Create a state variable to manage the visibility of the navigation menu
const [isNavOpen, setNavOpen] = useState(false);
const [aboutReadMore, setAboutReadMore] = useState(false);
// Array of text values to toggle between
const textValues = ["Read More ...", "Read Less ..."];
// State to track the current index in the array
const [currentAboutRMTextIndex, setCurrentAboutRMTextIndex] = useState(0);
const [currentSliderIndex, setCurrentSliderIndex] = useState(0);
// const [contractAddress, setcontractAddress] = useState('0x6fe537b0ba874eab212bb8321ad17cf6bb3a0afc');
const [isMobile,setIsMobile] = useState<boolean>(false);
const [currentSection, setCurrentSection] = useState<Element | null>(null); 
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

// const showStakeReadMore =  () => {
//   setStakeReadMore(!stakeReadMore);
//   setCurrentStakeRMTextIndex((prevIndex) => (prevIndex + 1) % textValues.length);
// }

// const showRefReadMore =  () => {
//   setRefReadMore(!refReadMore);
//   setCurrentRefRMTextIndex((prevIndex) => (prevIndex + 1) % textValues.length);
// }

const showAboutReadMore =  () => {
  setAboutReadMore(!aboutReadMore);
  setCurrentAboutRMTextIndex((prevIndex) => (prevIndex + 1) % textValues.length);
}



// const handleCopyClick = () => {
//    // Create a temporary textarea element
//    const textArea = document.createElement('textarea');
   
//    // Set the value of the textarea to the text you want to copy
//    textArea.value = contractAddress;

//    // Append the textarea to the document
//    document.body.appendChild(textArea);

//    // Select the text inside the textarea
//    textArea.select();

//    // Execute the copy command
//    document.execCommand('copy');

//    // Remove the temporary textarea
//    document.body.removeChild(textArea);

//    // Set the state to indicate that the text has been copied
//    setButtonText("Copied");

//    // Reset the state after a brief period (optional)
//    setTimeout(() => {
//       setButtonText("Copy");
//    }, 1500);
//  };

useEffect(() => {
  
  // Auto-play functionality
  const intervalId = setInterval(goToNextImage, 3000); // Change image every 3 seconds

  // Function to handle window resize
  const handleResize = () => {
    // Check the device width and update isNavOpen accordingly
    if (window.innerWidth <= 990) {
      setNavOpen(false);
      setIsMobile(true);
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

useEffect(() => {
  const sections = document.querySelectorAll(`.${styles.section}`);
  if (sections.length === 0) {
    console.error("No sections found with the specified class.");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        console.log(entry); // Log each entry to debug
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.inFocus);
          setCurrentSection(entry.target); // Update the state with the current section
        } else {
          entry.target.classList.remove(styles.inFocus);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  console.log("cureent section",currentSection);
  return () => {
    sections.forEach((section) => {
      observer.unobserve(section);
    });
  };
}, []);


  return (
    <div style={{overflowX: 'hidden'}}>
    <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="https://www.fifareward.io/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Fifareward | Bet, Stake, Mine and create NFTs of football legends, Fifaeward a layer roll up" />

        <meta property="og:title" content="Fifareward | Betting, Staking, Farming, NFTs and Gaming Protocols" />
        <meta property="og:url" content="https://www.fifareward.io" />
        <meta property="og:type" content="article" />
        <meta property="og:description" content="Fifareward | Betting, Staking, Farming, NFTs and Gaming Protocols" />
        <meta property="og:image" content="https://www.fifareward.io/whatsappogimage.png" />

        <meta name="twitter:title" content="Fifareward | Betting, Staking, Farming, NFTs and Gaming Protocols" />
        <meta name="twitter:url" content="https://www.fifareward.io" />
        <meta name="twitter:description" content="Fifareward | Betting, Staking, Farming, NFTs and Gaming Protocols" />
        <meta name="twitter:image" content="https://www.fifareward.io/whatsappogimage.png" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:image:width" content="300"/>
        <meta property="og:image:height" content="300"/>
        <meta property="og:site_name" content="Fifareward"/>
        <meta property="og:title" content="Fifareward | Betting, Staking, Farming, NFTs and Gaming Protocols" />
        <meta property="og:description" content="Programa de fiestas" />
        <meta property="og:image" content="https://www.fifareward.io/whatsappogimage.png" />
        <meta property="og:type" content="website" />
        <meta property="og:updated_time" content="1440432930" />

        <link rel="apple-touch-icon" href="https://www.fifareward.io/favicon.ico" />
        <link rel="manifest" href="https://www.fifareward.io/manifest.json" />

        <title>Fifareward | Betting, Staking, Farming, NFTs and Gaming Protocols</title>
        <meta name='description' content='Fifareward | Bet, Stake, Mine and craeate NFTs of football legends'/>
    </Head>

    <div className={`${styles.homemain}`}>
      <div className={styles.overlay_d}></div>
      <section className={`${styles.blk} ${styles.section}`}>
          <div className={styles.overlay_d}></div>
          <div className={styles.blk_inner}>
            <div className={styles.blkc}>
              <div className={styles.blkc1}>
                <h1>WELCOME TO THE FRDCHAIN</h1>
              </div>

              <div className={styles.blkc2}>
                <h1>A LAYER 2 GAMEFI BLOCKCHAIN </h1>
                <h1> ON BINANCE SMART CHAIN </h1>
              </div>
              
              {/* <div className={styles.blkc3}>
                <h3>A ROLL UP BLOCKCHAIN SOLUTION</h3>
              </div>
              <div className={styles.blkc4}>
                <h3>GET MORE SPEED, TRUST, SECURITY AND SCALABILITY</h3>
              </div> */}
            </div>
            <div className={styles.blk_image}>
              <Image src={chainhead} style={{width: '100%', height: '100%',zIndex: 0,position: 'relative'}} alt='connecting the world through football' />
            </div>
          </div>
      </section>

      <section className={`${styles.c_content} ${styles.section}`}>
        <video className={styles.bg_video} autoPlay loop muted >
          <source src="./fifarewardvideo.mp4" type="video/mp4"></source>
        </video>
        <div className={styles.c_overlay_d}></div>
          <div className={styles.hero_h1}>
            <div>
              <h1 className={styles.h1}>
                FIFAREWARD  
              </h1>
            </div>
            <div style={{marginBottom: '20px'}}>
              <Typed
                    strings={[
                        'Relaunched',
                        'Reliable',
                        'Sustainable',
                        'AI Powered',
                        'Betting',
                        'Gaming',
                        'Staking',
                        'Farming',
                        'Earn Rewards',
                        'Trusted']}
                    typeSpeed={40}
                    backSpeed={50}
                    className={styles.typedHeader}
                    style={{ color: '#e3a204', fontSize: '40px',fontWeight: 600,fontFamily: 'RussoOne Regular' }}
                    loop
                />
            </div>
            <h1>AI Powered Farming, Staking, Gaming And Betting Dapp</h1>
            <div>
              <h4 className={styles.hero_h4}>The Leading Sport GameFi Protocol</h4>
            </div>
            
            {/* <div className={styles.get_sd_btns}>
              <a title='get started' href='https://pancakeswap.finance/swap?outputCurrency=0x5ae155F89308CA9050f8Ce1C96741BaDd342C26B' rel='noopener noreferrer' className={styles.getstarted}>Buy FRD</a>
              <a href='/signin' rel='noopener noreferrer' className={styles.learnmore}>Stake FRD</a>
            </div> */}
            {/* <div className={styles.ca}>
              <span>Contract Address</span> 
              <div className={styles.ca_in}>
                <input title='input' type='text' value={contractAddress} onChange={(e) => setcontractAddress(e.target.value)}/> <button type='button' onClick={handleCopyClick}>{buttonText}</button>
              </div>
            </div> */}
          </div>
          {/* <div className={styles.hero_image}>
            <Image src={Heroimg} alt='hero img' style={{objectFit: "contain",marginTop: '5rem'}} quality={90} />
          </div> */}
      </section>
      
      <section className={`${styles.connectworld} ${styles.section}`}>
          <h1>Aggregating Football Data For AI</h1>
          <div className={styles.conn_inner}>
            <div className={styles.connectw}>
              <div>
                  <p>
                    We've partnered with many AI companies to help aggregate football/soccer in data in their AI Models data tunneling and training.
                  </p>
                  <p>
                    We filter and aggregate football data using our highly sophisticated AI scrapping tools.
                  </p>
              </div>
              <h3 style={{textAlign: 'left',marginTop: '25px'}}>Be Part Of This AI Revolution ...</h3>
            </div>
            <div className={styles.conn_image}>
              <div className={styles.cimg}>
                <Image src={aibanner} style={{width: '80%', height: '80%',borderRadius: '8px',margin: '15px auto'}} alt='connecting the world through football' />
              </div>
            </div>
          </div>
      </section>

      {/* fifareward betting */}
      <section className={`${styles.connectworld} ${styles.section}`}>
          <h1>Connecting the world through football</h1>
          <div className={styles.conn_inner}>
            <div className={styles.connectw}>
              <div>
                  <p>
                    Football is a sensational sport that connects the world. 
                  </p>
                  <p>
                    Fifareward as a leading <span>GAMEFI</span> protocol has introduced into the decentralized world of blockchain, unique interesting games activities.
                  </p>
              </div>
              <div>
                <p><span>As</span> a DEFI blockchain protocol, we introduced a decentralized betting system known as <span>WAGER BETTING</span>.</p> 
              </div>
              <div>
                <h2>Decentralized Wager && Odd Betting</h2>
                <p>
                  Betting is in the heart of sports entertainment, at Fifareward, we are revolutionizing the world of betting, starting with wager betting to odd betting, removing middleman manipulation and putting everything in your hands (the users). 
                  <a href='/#betting' style={{color: '#e28304'}}>go to betting</a>
                </p>
              </div>
              <div>
                <h2>The FAN FORUM</h2>
                <p>We've designed and built a fan chat forum where all the fans gossip and chatterings are done. Enjoy the fun of the game. <a href='/#fanforum' style={{color: '#e28304'}}>go to fan forum</a> </p>
              </div>
              <div>
                <h2>Gaming</h2>
                <p> Enjoy, learn and be excited on the innovative games built just for you <a href='/#gaming' style={{color: '#e28304'}}>go to games</a> </p>
              </div>
              <div>
                <h2>Minting NFT of Football Legends</h2>
                <p> 
                  Mint and sell nft arts of your favorites legends using our NFT minting engine and nft market place respectively.
                  <a href='/#nft' style={{color: '#e28304'}}>go to fan forum</a>
                </p>
              </div>
              <div>
                <h2>Staking And Mining</h2>
                <p> We want to reward you for going on this amazing journey with us, we've built in many reward system to appreciate on your efforts. Staking and Mining are one of the systems <a href='/#staking' style={{color: '#e28304'}}>go to staking and mining </a> </p>
              </div>
            </div>
            <div className={styles.conn_image}>
              <div className={styles.cimg}>
                <Image src={frdbanner} style={{width: '100%', height: '100%',borderRadius: '8px',marginTop: '0'}} alt='connecting the world through football' />
              </div>
            </div>
          </div>
      </section>

      {/* dex tools */}
      <section className={`${styles.exchmain} ${styles.section}`}>
        <h1>SUPPORTED BY</h1>

        <div className={styles.dexchanges}>
          <div className={styles.dexc}>
            {images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`slide-${index}`}
              className={styles.delginks}
              style={{
                width: '130px',
                height: '30px',
                maxHeight: '30px',
                margin: 'auto 0 auto 0',
                transform: `translateX(${index * 30 - currentSliderIndex * 20}%)`,
                transition: 'transform 0.5s ease-in-out',
              }}
            />
          ))}
          </div>
        </div>
      </section>

      <section className={`${styles.frdbetting} ${styles.section}`} id="betting">
          <div className={styles.betd}>
              <div className={styles.betdc}>
                  <div>
                    <h1>FIFAREWARD BETTING</h1>
                    <h3>(Wager Bet)</h3>
                  </div>
                  <div>
                    <p>
                      Fifareward is introducing the <span>Wager Betting System</span> where a user opens a bet with specific predictions and amount of choice using our token FRD, then another user joins the bet with counter predictions using FRD as well.
                    </p>
                    <p>
                      The user whose prediction is correct wins the bet and get the sum of bet amounts. <a href='/betting' style={{color: '#e28304'}}>go to betting</a> 
                    </p>
                  </div>
              </div>
              <div className={styles.betdc}>
                <div>
                  <Image src={betmob} style={{position: 'absolute',width: '120px',height: '250px',left: '5%',top: '-60px'}} alt='bet'/>
                  <div className={styles.setimg}>
                    <Image src={betbg} style={{width: '100%',height:'100%',borderRadius: '8px',marginTop: '0',border: '2px solid #78787873'}} alt='betting image'/>
                  </div>
                </div>
              </div>
          </div>
      </section>

      <section className={`${styles.connectworld} ${styles.section}`} id="#fanforum">
          <h1>FIFAREWARD FAN FORUM</h1>
          <div className={styles.conn_inner}>
            <div className={styles.connectw}>
              <div>
                  <p>
                    We believe that community building and bonding are essential in sustaining a community as we keep adding innovations to our project.
                  </p>
                  <p>
                    To continuously foster and sustain our community engagements, we added innovative fan forum where users (fans) can share their sentiments on games, fixtures, bets, results, and their experience on our project.
                  </p>
                  <p>
                    Be sure to maximize the use of this fan forum efficiently <a href='/fanforum' style={{color: '#e28304'}}>go to fan forum</a>.
                  </p>
              </div>
            </div>
            <div className={styles.conn_image}>
              <div className={`${styles.cimg} ${styles.cimg2}`}>
                <Image src={fanforum} style={{width: '80%', height: '450px',borderRadius: '8px',margin: '15px auto',}} alt='connecting the world through football' />
              </div>
            </div>
          </div>
      </section>

      <section className={`${styles.connectworld} ${styles.section}`} id="#nft">
          <h1>NFT Minting And Market Place</h1>
          <div className={styles.conn_inner}>
            <div className={styles.connectw}>
              <div>
                  <p>
                    Our NFT minting engine is designed to compete with the likes of OpenSea, with bidding and auctioning functionalities where the seller will accept the bid with the highest offer.
                  </p>
                  <p>
                    If a user/buyer likes an nft art so much that he/she don't want to bid, the user can buy the nft outrightly with our direct buy option.
                  </p>
                  <p>
                    NFT Creators also set lifetime royalties ranging from 2% to 5% that automatically gets paid to their wallet anytime the nft is sold <a href='/nft' style={{color: '#e28304'}}>go to nft market place</a>.
                  </p>
              </div>
            </div>
            <div className={styles.conn_image}>
              <div className={styles.cimg}>
                <Image src={nftbanner} style={{width: '80%', height: '80%',borderRadius: '8px',margin: '15px auto'}} alt='connecting the world through football' />
              </div>
            </div>
          </div>
      </section>

      <section className={`${styles.connectworld} ${styles.section}`} id="#gaming">
          <h1>Fiareward Games</h1>
          <div className={styles.conn_inner}>
            <div className={styles.connectw}>
              <div>
                  <p>
                    Play and enjoy our exciting games, built on the blockchain.
                  </p>
                  <p>
                    Our games are addicting, educating and exciting. Get thrilled and enjoy the fun <a href='/gaming' style={{color: '#e28304'}}>go to games</a>.
                  </p>
              </div>
            </div>
            <div className={styles.conn_image}>
              <div className={styles.cimg}>
                <Image src={gamebanner} style={{width: '80%', height: '80%',borderRadius: '8px',margin: '15px auto'}} alt='connecting the world through football' />
              </div>
            </div>
          </div>
      </section>

      <section className={`${styles.frdstaking} ${styles.section}`} id="staking">
          {isMobile === true ? <h1>STAKING <div>AND</div> FARMING</h1> : <h1>STAKING AND FARMING</h1>}
          <div className={styles.stakingmain}>
              <div className={styles.stakevesttext}>
                Fifareward built staking and FARMING systems to reward loyal and active users who are the pioneers of the first betting and sport protocol on the blockchain <a href='/staking' style={{color: '#e28304'}}>go to staking</a>.
                {/* <h4>WHY STAKE FRD?</h4>  */}
                <ul>
                  {/* <li>
                    <FontAwesomeIcon icon={faCheckSquare} size='lg' className={styles.chronotitleicon}/> You earn up to 0.1% FRD daily.
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckSquare} size='lg' className={styles.chronotitleicon}/> Automated, trusted and secure staking smart contract for transparency.
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckSquare} size='lg' className={styles.chronotitleicon}/>  Withdraw and restake anytime.
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckSquare} size='lg' className={styles.chronotitleicon}/> FIFAREWARD is a DAO token governed by the community of validators and stakers. 
                  </li> */}
                </ul>
                {/*                 
                {stakeReadMore && (
                  <>
                    <p>
                    So why settle for stagnant coins when you can start staking and earn continuous daily rewards! Join the millions of crypto enthusiasts who are already embracing this game-changing opportunity.
                    </p>
                    <p>
                    FIFAREWARD staking presents an irresistible opportunity to maximize your investment potential, earn passive income, referral income, and actively contribute to the growth of blockchain networks. By staking your coins, you unlock a world of benefits: secure returns, reduced risks, community participation, and efficient asset allocation. Don't let your crypto assets remain idle any longer! Take control, stake your coins, and start reaping the rewards today - it's time to witness the true power of staking!
                    </p>
                  </>)}   */}
                  {/* <button type='button' className={styles.readmorebtn} onClick={showStakeReadMore}>{textValues[currentStakeRMTextIndex]}</button> */}
              </div>
              <div className={styles.stakevestimg}>
                <Image src={stakeimg} alt='stake image' quality={90} style={{width: '100%',height:'100%',borderRadius: '16px',marginTop: '0',border: '2px solid #78787873'}} className={styles.stakevest_img}/>
              </div>
          </div>
      </section>
      
      <section className={`${styles.roadmap} ${styles.section}`} id='roadmap'>
        <RoadMap />
      </section>

      <section className={`${styles.frdreferrals} ${styles.section}`} id="referrals">
          <h1>REFER AND EARN</h1>
          <div className={styles.referralsmain}>
              <div className={styles.referralstext}>
                <h4>
                  As a decentralized protocol, we understand that the power is with the people (users). We've built our system to give back to the people through the refer and earn system.
                </h4>
                <h5>
                  For every user you referred, you earn 2% of each of their stakes, betting and farming rewards.
                </h5>
                {/* <ul>
                  <li>
                    <FontAwesomeIcon icon={faCheckSquare} size='lg' className={styles.chronotitleicon}/> You earn 0.5% daily return on investment from all your direct referrals (first genration referrals)
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckSquare} size='lg' className={styles.chronotitleicon}/> You earn 0.3% daily ROI from all your second genration referrals                </li>
                  <li>
                    <FontAwesomeIcon icon={faCheckSquare} size='lg' className={styles.chronotitleicon}/> You earn 0.2% daily ROI from all your second genration referrals
                  </li>
                </ul> */}

                </div>
              <div className={styles.referralsimg}>
                <Image src={refgroup} alt='team image' style={{width: '100%', height: '350px'}} quality={90} className={styles.referrals_img}/>
              </div>
          </div>
      </section>

      <section className={`${styles.aboutfrd} ${styles.section}`} id="aboutfrd">
          <h1>ABOUT FIFAREWARD</h1>
          
          <p>
            Welcome to Fifareward DeFi Protocol, where we aim to revolutionize the world of betting, NFT market place, and gaming through decentralization. We are a team of passionate individuals committed to creating a platform that enables users to experience secure, transparent, and fair betting opportunities, NFT market place etc.
          </p>
          
          {aboutReadMore && (
            <>
              <p>
                At our core, we believe that decentralization is the future of the betting industry. By leveraging blockchain technology, we are able to eliminate the need for intermediaries and create a trustless ecosystem where users have complete control over their bets. This ensures that all transactions are executed with utmost transparency, leaving no room for manipulation or foul play.
              </p>
              <p>
                As we set out on this journey, our vision is to create a community-driven platform where every participant has a stake in the decision-making process. Through the use of governance tokens, our users will have the power to shape the future of the platform, ensuring that it evolves in a way that best serves the interests of the community.
              </p>
              <p>
                Security is of paramount importance to us. That's why we have implemented robust security measures to safeguard user funds and maintain the integrity of the platform. With our advanced encryption protocols, users can place bets with confidence, knowing that their assets are protected against any potential threats.
              </p>
              <p>
                Above all, we prioritize user experience. We have designed our platform to be intuitive and user-friendly, making it accessible to both novice and experienced bettors. Our team is also readily available to provide support and address any concerns or questions that our users may have.
              </p>
              <p>
                Join us on this exciting journey as we decentralize the betting industry and transform the way bets are made. Together, we can create a future where transparency, fairness, and trust are at the forefront of betting, gaming and NFT market place.
              </p>
            </>
          )}
          <button type='button' className={styles.readmorebtn} onClick={showAboutReadMore}>{textValues[currentAboutRMTextIndex]}</button>
          {/* <ul>
            <h4>Reasons To Buy And Stake FIFAREWARD</h4>
            <li>
              <FontAwesomeIcon icon={faCheckCircle}/> FIFAREWARD staking with fair monthly yield
            </li>
            <li>
              <FontAwesomeIcon icon={faCheckCircle}/> Real-time Crypto, Forex, and Synthetics Trade signal alerts via SMS, emails, and telegram
            </li>
            <li>
              <FontAwesomeIcon icon={faCheckCircle}/> FIFAREWARD token ($FRD) with several utilities in the FIFAREWARD platform
            </li>
            <li>
              <FontAwesomeIcon icon={faCheckCircle}/> Node as a Service (NaaS) system for FIFAREWARD token
            </li>
            <li>
              <FontAwesomeIcon icon={faCheckCircle}/> FIFAREWARD token launchpads for several blockchains
            </li>
          </ul> */}
      </section>
      
    </div>

    

    </div>
  )
}

export default Home
