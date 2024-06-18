import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti-boom';
import axios from 'axios';
import ConfettiExplosion from 'react-confetti-explosion';
import styles from '../styles/comingsooncountdowntimer.module.css'
import { FaCheck, FaSquareCheck, FaXmark } from 'react-icons/fa6';


interface Props {
    onChange: (newValue: boolean) => void;
}

const ComingSoonCountdownTimer:React.FC <Props> = ({onChange}) => {
  const [timeRemaining, setTimeRemaining] = useState(5184000); // days in seconds
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    const fetchTimer = async () => {
        try {
          const config = {
            headers: {
                "Content-type": "application/json"
            }
          }  
          const {data} = await axios.get("https://fifarewardbackend-1.onrender.com/api/countdown/getremainingtime/", config);
          setTimeRemaining(data.remainingtime);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchTimer();

    setIsExploding(true);
    // const interval = setInterval(() => {
    //   setTimeRemaining((prevTime:any) => {
    //     if (prevTime <= 0) {
    //       clearInterval(interval);
    //       // You can add any additional logic here when the timer reaches zero
    //       return 0;
    //     }
    //     return prevTime - 1;
    //   });
    // }, 1000);

    // Cleanup function to clear the interval when the component is unmounted
    // return () => clearInterval(interval);
  }, []);

  const closeCountdownModal = () => {
    onChange(false);
  }


  const formatTime = (seconds:any) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(days).padStart(2, '0')} days ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };
  return (
    <>
        <div className={styles.comingsoonmain}>
            <div className={styles.overlay}></div>
            <div className={styles.closebtn}>
                <button onClick={closeCountdownModal} style={{color: 'red'}}>Close<FaXmark size={20}/></button>
            </div>
            <div>{isExploding && <><Confetti mode='fall' colors={['#ff577f', '#ff884b', '#ffd384', '#fff9b0', '#3498db']} shapeSize={18}/> <ConfettiExplosion/></>}</div>
            <div className={styles.ina}>
                <div>
                    <div>
                        <h1> Launch Count Down </h1> 
                    </div>
                    <h3>Below are some of the blockchain protocols we have built to foster user engagement and community building as well as stand out amongst our counterpart Dapps</h3>
                    <ul>
                        <li> <FaSquareCheck size={18}/> Soccer Betting </li>
                        <li> <FaSquareCheck size={18}/>  Fan Forum </li>
                        <li> <FaSquareCheck size={18}/> Gaming </li>
                        <li> <FaSquareCheck size={18}/> Staking </li>
                        <li> <FaSquareCheck size={18}/> Farming </li>
                        <li> <FaSquareCheck size={18}/>  NFT Minting Engine And Market Place </li>
                        <li> <FaSquareCheck size={18}/>  Robust referral and reward system </li>
                    </ul>
                    <h2>All protocols are built on the blockchain</h2>
                </div>
                
                <div className={styles.timer}>
                {formatTime(timeRemaining)} 
                </div>
            </div>
        </div>
    </>
  );
};

export default ComingSoonCountdownTimer;
