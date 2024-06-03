// components/Timeline.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/roadmap.module.css';
import { FaCircleCheck } from 'react-icons/fa6';

interface TimelineEvent {
  id: number;
  title: string;
}

const events: TimelineEvent[] = [
  { id: 1, title: 'New Year' },
  { id: 2, title: 'Valentine\'s Day' },
  { id: 3, title: 'Independence Day' },
  { id: 3, title: 'Independence Day' },
  { id: 3, title: 'Independence Day' },
  { id: 3, title: 'Independence Day' },
  { id: 3, title: 'Independence Day' },
  { id: 3, title: 'Independence Day' },
  { id: 3, title: 'Independence Day' },
  { id: 3, title: 'Independence Day' },
  { id: 3, title: 'Independence Day' },
  { id: 3, title: 'Independence Day' },
  { id: 3, title: 'Independence Day' },
  // Add more events as needed
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
        focusedEvent.scrollIntoView({ behavior: 'smooth', inline: 'center' });
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
                <div className={styles.centerLine}></div>
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
                      {index < 6 && <FaCircleCheck className={styles.checkIcon} />} {/* Add checkmark icon for first three events */}
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
