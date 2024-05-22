import React from 'react';
import styles from '../styles/soccercasinochips.module.css';

interface ChipProps {
  active: boolean;
  id: string;
}

const SoccerCasinoChips: React.FC<ChipProps> = ({ active, id }) => {
  return active ? (
    <div className={`${styles.chip}`} id={id}>10</div>
  ) : (
    <div>{id}</div>
  );
};

export default SoccerCasinoChips;
