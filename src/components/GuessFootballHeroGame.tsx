import React, { useState } from 'react';
import styles from '../styles/gamesdisplay.module.css';

const Gamesdisplay: React.FC = () => {
  const [score, setScore] = useState(0);

  const startGame = () => {
    // Game logic goes here
    setScore(Math.floor(Math.random() * 1000));
  };

  return (
    <div className={styles.gameDisplay}>
      <h1 className={styles.title}>Current Game</h1>
      <div className={styles.gameScreen}>
        {/* Game screen content goes here */}
        <p>Game will be displayed here.</p>
        <p>Score: {score}</p>
      </div>
      <button className={styles.startButton} onClick={startGame}>Start Game</button>
    </div>
  );
};

export default Gamesdisplay;
