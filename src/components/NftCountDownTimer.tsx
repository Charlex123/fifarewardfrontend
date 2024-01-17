import React, { useState, useEffect } from 'react';

const NFTCountdownTimer = ({time}:any) => {

  const [timeRemaining, setTimeRemaining] = useState(time); // 30 days in seconds

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

    const days = Math.floor(timeRemaining / 86400);
    const hours = Math.floor((timeRemaining % 86400) / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const remainingSeconds = timeRemaining % 60;


  return (
    <div style={{display: 'flex',padding: '0 5px'}}>
        <div>
            <span>{String(days).padStart(2, '0')}</span> <div>Days{' '}</div>
        </div>
        <div style={{marginLeft: '50px'}}>
            <span>{String(hours).padStart(2, '0')}</span> <div>Hours{' '}</div>
        </div>
        <div style={{marginLeft: '50px'}}>
            <span>{String(minutes).padStart(2, '0')}</span> <div>Minutes{' '}</div>
        </div>
        <div style={{marginLeft: '50px'}}>
            <span>{String(remainingSeconds).padStart(2, '0')}</span> <div>Seconds</div>
        </div>
    </div>
  );
};

export default NFTCountdownTimer;
