import React from 'react';
import styles from '../styles/leaderboard.module.css';

const Leaderboard: React.FC = () => {
  const players = [
    { name: 'Player1', score: 1500 },
    { name: 'Player2', score: 1400 },
    { name: 'Player3', score: 1300 },
    { name: 'Player4', score: 1200 },
    { name: 'Player5', score: 1100 },
  ];

  return (
    <div className={styles.leaderboard}>
      <h2 className={styles.title}>Leaderboard</h2>
      <ul className={styles.playerList}>
        {players.map((player, index) => (
          <li key={index} className={styles.player}>
            {player.name} - {player.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
