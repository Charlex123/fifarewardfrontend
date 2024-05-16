import React, { useState, useEffect } from 'react';

const CountdownTimer = ({time}:any) => {
  const timer_ = time;
  const [timeRemaining, setTimeRemaining] = useState(timer_); // days in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTime:any) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          // You can add any additional logic here when the timer reaches zero
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds:any) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(days).padStart(2, '0')} days ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div>
      {formatTime(timeRemaining)}
    </div>
  );
};

export default CountdownTimer;
