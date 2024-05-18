import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import casino from '../assets/images/casino.png'
import pointer from '../assets/images/arrow-down.png'
import styles from '../styles/soccercasino.module.css';

const numbers = Array.from({ length: 37 }, (_, i) => i); // 37 numbers on the roulette (0 to 36)
const segmentAngle = 360 / numbers.length;

const SoccerCasino = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  const startSpin = () => {
    const randomAngle = Math.floor(Math.random() * 360) + 3600; // Add 3600 to ensure multiple rotations
    const newAngle = currentAngle + randomAngle;
    setCurrentAngle(newAngle);
    setIsSpinning(true);
    setResult(null); // Reset result while spinning
  };

  const onSpinEnd = () => {
    setIsSpinning(false);
    const normalizedAngle = (currentAngle % 360 + 360) % 360; // Ensure positive angle
    const segmentIndex = Math.floor(normalizedAngle / segmentAngle) % numbers.length;
    setResult(numbers[segmentIndex]);
  };

  return (
    <div className={styles.rouletteContainer}>
      <div className={styles.pointer}>
        <Image src={pointer} alt="Pointer" width={50} height={50} />
      </div>
      <motion.div
        className={styles.board}
        animate={{ rotate: isSpinning ? currentAngle : currentAngle % 360 }}
        transition={{ duration: 4, ease: 'easeOut' }}
        onAnimationComplete={onSpinEnd}
      >
        <Image src={casino} alt="Roulette Board" width={400} height={400} />
      </motion.div>
      <button onClick={startSpin} className={styles.spinButton} disabled={isSpinning}>
        {isSpinning ? 'Spinning...' : 'Spin'}
      </button>
      {result !== null && !isSpinning && <div className={styles.result}>Result: {result}</div>}
    </div>
  );
};

export default SoccerCasino;
