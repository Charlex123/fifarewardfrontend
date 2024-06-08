// components/ImageSlider.tsx
import React, { useState, useEffect } from 'react';
import styles from '../styles/gamelandingpage.module.css';
import Confetti from 'react-confetti-boom';
import AlertDanger from './AlertDanger'; 
import Head from 'next/head';
import BgOverlay from './BgOverlay';
import { useWeb3Modal } from '@web3modal/scaffold-react';

const GameLandingPage: React.FC<{}> = () => {
  const { open } = useWeb3Modal();
  const [isExploding, setIsExploding] = useState(false);
  const [showBgOverlay, setShowBgOverlay] = useState(false);
  const [showalertDanger, setShowAlertDanger] = useState(false);
  const [errorMessage, seterrorMessage] = useState('');
  useEffect(() => {
    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
      if(!udetails) {
        open()
      }else {
        
      }
    setIsExploding(true);
  },[isExploding])
  

  const images = [
    { src: "https://www.fifareward.io/gamelogos/guessfootballherologo.png", link: '../gaming/guessfootballherogame', name: "Guess Football Hero", status: "Launched" },
    { src: "https://www.fifareward.io/gamelogos/soccercasinologo.png", link: '../gaming/#', name: "Soccer Casino Roulette", status: "Coming Soon" },
    { src: "https://www.fifareward.io/gamelogos/soccercrushlogo.webp", link: '../gaming/#', name: "Soccer Crush", status: "Coming Soon" },
    { src: "https://www.fifareward.io/gamelogos/soccerarcadelogo.webp", link: '../gaming/#', name: "Football Arcade", status: "Coming Soon" },
  ];

  const ComingSoon = () => {
    setShowBgOverlay(true);
    setShowAlertDanger(true);
    seterrorMessage("Coming Soon");
  }

  const closeAlertModal = () => {
    setShowAlertDanger(false);
    setShowBgOverlay(false);
  }

  const closeBgModal = () => {
    setShowBgOverlay(false);
  }

  return (
    <>
    <Head>
          <title> Fifareward Games | Fifareward</title>
          <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
    </Head>
    {showBgOverlay && <BgOverlay onChange={closeBgModal}/>}
    {showalertDanger && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
      <div className={styles.main}>
          <div className={styles.confetti}>{isExploding && <Confetti mode='fall' colors={['#ff577f', '#ff884b', '#ffd384', '#fff9b0', '#3498db']} shapeSize={18}/>}</div>
          <div className={styles.overlay}></div>
          <div className={styles.top}>
            <h1 className={styles.gameh1}>Welcome To Fifareward Games</h1>
            <p>
              We believe in the importance of games to the mind. Fifareward games are intuitively designed to be adventurous, educative and exciting.
            </p>
            <p>
              Select any of the games below and enjoy. 
            </p>
            <p>
              All Fifareward games are decentralized and are built on the blockchain to eliminate central control, result manipulation, enable security and trust.
            </p>
          </div>
          <div className={styles.sliderContainer}>
            <div className={styles.sliderTrack}>
              {images.map((image, index) => (
                <div key={index + images.length} className={styles.slide}>
                  {image.status == "Launched" ? 
                  <a href={image.link} target="_blank" rel="noopener noreferrer">
                    <div className={styles.img}>
                      <img src={image.src} alt={`Slide ${index}`} className={styles.image} />
                    </div>
                    <div className={styles.name}>
                      {image.name}
                    </div>
                    <div className={image.status == "Launched" ? styles.launched : styles.status}>{image.status}</div>
                  </a> :
                
                  <button onClick={ComingSoon}>
                    <div className={styles.img}>
                      <img src={image.src} alt={`Slide ${index}`} className={styles.image} />
                    </div>
                    <div className={styles.name}>
                      {image.name}
                    </div>
                    <div className={image.status == "Launched" ? styles.launched : styles.status}>{image.status}</div>
                  </button>
                }
                </div>
              ))}
              {/* Repeat images to create a seamless loop */}
              {images.map((image, index) => (
                <div key={index + images.length} className={styles.slide}>
                  {image.status == "Launched" ? 
                  <a href={image.link} target="_blank" rel="noopener noreferrer">
                    <div className={styles.img}>
                      <img src={image.src} alt={`Slide ${index}`} className={styles.image} />
                    </div>
                    <div className={styles.name}>
                      {image.name}
                    </div>
                    <div className={image.status == "Launched" ? styles.launched : styles.status}>{image.status}</div>
                  </a> :
                
                  <button onClick={ComingSoon}>
                    <div className={styles.img}>
                      <img src={image.src} alt={`Slide ${index}`} className={styles.image} />
                    </div>
                    <div className={styles.name}>
                      {image.name}
                    </div>
                    <div className={image.status == "Launched" ? styles.launched : styles.status}>{image.status}</div>
                  </button>
                }
                </div>
              ))}
            </div>
          </div>
      </div>
    </>
  );
};

export default GameLandingPage;
