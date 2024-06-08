// components/Spinner.tsx
import styles from '../styles/spinner.module.css';

const Spinner: React.FC = () => {
  return (
    <div className={styles.spinner}>
      <div className={styles.segment}></div>
      <div className={styles.segment}></div>
      <div className={styles.segment}></div>
      <div className={styles.segment}></div>
      <div className={styles.segment}></div>
      <div className={styles.segment}></div>
    </div>
  );
};

export default Spinner;
