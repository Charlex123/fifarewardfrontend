// components/Timeline.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/roadmap.module.css';
import { FaCircleCheck } from 'react-icons/fa6';

interface TimelineEvent {
  id: number;
  title: string;
}

const events: TimelineEvent[] = [
  { id: 1, title: 'Seed & Private Sale' },
  { id: 2, title: 'Ston.fi & Ton Diamonds Listing' },
  { id: 3, title: 'Website' },
  { id: 4, title: 'Telegram Mini App' },
  { id: 5, title: 'Airdrop Campaign Phase 1' },
  { id: 6, title: 'NFT Minting & Market Place' },
  { id: 7, title: 'Betting Protocol' },
  { id: 8, title: 'Gaming Protocol' },
  { id: 9, title: 'Staking & Farming' },
  { id: 10, title: 'Interactive Chat' },
  { id: 11, title: 'Branding & Merchandize' },
  { id: 12, title: 'Airdrop Campaign Phase 2' },
  { id: 13, title: 'Listing On tier2 Exchanges' },
  { id: 14, title: 'Listing On Tier 1 Exchanges' },
  { id: 15, title: 'Mobile App'}, 
  { id: 16, title: 'Layer 2 Roll Up Testnet Completion' },
  { id: 17, title: 'Layer 2 Roll Up Mainnet Completion' },
  { id: 18, title: 'Dex Exchange' },
  { id: 19, title: 'Continual Soccer Events Sponsorships' }
];

const RoadMap: React.FC = () => {
    const [focusIndex, setFocusIndex] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setFocusIndex((prev) => Math.min(prev + 1, events.length - 1));
      } else if (event.key === 'ArrowLeft') {
        setFocusIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (timelineRef.current) {
      const focusedEvent = timelineRef.current.children[focusIndex];
      if (focusedEvent instanceof HTMLElement) {
        focusedEvent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [focusIndex]);

  return (
   <div className={styles.main}>
    <h3>Road Map</h3>
         <div
            className={styles.timelineContainer}
            tabIndex={0}
            ref={containerRef}
            onKeyDown={(e) => e.stopPropagation()}
            >
            <div className={styles.timeline} ref={timelineRef}>
                <div className={styles.centerLine} style={{color: 'white',backgroundColor: 'white'}}></div>
                {events.map((event, index) => (
                <div
                    key={event.id}
                    className={`${styles.eventContainer} ${index % 2 === 0 ? styles.topContainer : styles.bottomContainer}`}
                    onClick={() => setFocusIndex(index)}
                >
                    <div className={`${styles.verticalLine} ${index % 2 === 0 ? styles.upLine : styles.downLine}`}></div>
                    <div className={`${styles.event} ${index % 2 === 0 ? styles.upEvent : styles.downEvent}`}>
                    <div className={styles.title}>
                      {event.title}
                      {/* {index < 9 && <FaCircleCheck className={styles.checkIcon} />} Add checkmark icon for first three events */}
                    </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
   </div>
  );

      };

export default RoadMap;
