import React from 'react';
import styles from '../styles/leaderboard.module.css';

const SoccerRouletteLeaderboard: React.FC = () => {
  const players = [
    { name: 'Player1', score: 1500, address: '0x6cxs24eaxcbcdx22222221h2164sc' },
    { name: 'Player2', score: 1400, address: '0x6cxs24eaxcbcdx22222221h2164sc' },
    { name: 'Player3', score: 1300, address: '0x6cxs24eaxcbcdx22222221h2164sc' },
    { name: 'Player4', score: 1200, address: '0x6cxs24eaxcbcdx22222221h2164sc' },
    { name: 'Player5', score: 1100, address: '0x6cxs24eaxcbcdx22222221h2164sc' },
  ];

  return (
    <div className={styles.leaderboard}>
      <h2 className={styles.title}>Leaderboard</h2>
      <ul className={styles.playerList}>
        {players.map((player, index) => (
          <li key={index} className={styles.player}>
            <div>
              {player.address.substring(0,8)} - 
            </div>
            <div>
              {player.score}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SoccerRouletteLeaderboard;
