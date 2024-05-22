import React, { useState, useEffect, useContext } from 'react';
import styles from '../styles/guessfootballhero.module.css';
import Leaderboard from './GuessFootballHeroLeaderboard';
import { ThemeContext } from '../contexts/theme-context';

const GuessFootballHeroGame: React.FC = () => {

  const { theme } = useContext(ThemeContext);
  
  useEffect(() => {
    // Fetch user data from the database and set the state with that data
  }, []);

  

  return (
    <div className={`${styles.main} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`}>
      <div className={styles.overlay}></div>
      <div className={styles.top}>
        <h1 className={styles.gameh1}>Guess Your Football Hero</h1>        
        <p>
          Guess Right And Get Rewarded
        </p>
      </div>

      <div className={styles.table}>
        <div className={`${styles.game} ${theme === 'dark' ? styles['darkmod'] : styles['lightmod']}`}>
          <div className={styles.game_in}>
            
          </div>
          
        </div>

        {/* Leaderboard */}
        <div className={`${styles.leaderboard}`}>
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default GuessFootballHeroGame;
