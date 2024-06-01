import { useState, useRef, useEffect, useCallback } from 'react';
import styles from '../styles/soccercasinoroulette.module.css';
import options from '../../options.json';

interface SoccerCasinoRouletteProps {
  isSpinning: (isspinning: boolean) => void;
  updateNum: (num: string) => void;
  num: string;
  arr: any[];
  count: number;
}

const SoccerCasinoRoulette: React.FC<SoccerCasinoRouletteProps> = ({ isSpinning, updateNum, num, arr, count }) => {
  console.log("arr ",arr,num)
  // const [spinAngleStart, setSpinAngleStart] = useState(Math.random() * 10 + 10);
  const [spinTimeTotal, setSpinTimeTotal] = useState(Math.random() * 3 + 4 * 1000);
  const [startAngle, setStartAngle] = useState(0);
  const [spinTime, setSpinTime] = useState(0);
  const [text, setText] = useState("");
  const arc = Math.PI / (options.length / 2);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spinTimer = useRef<number | null>(null);
  let spinAngleStart = Math.random() * 10 + 10;
  const [baseSize, setBaseSize] = useState<number>(200);
  console.log("freeeee",spinAngleStart,startAngle,spinTimeTotal)
  
  // drawRouletteWheel() {
  //   console.log(" start roulette wheel ran--");
  //   const baseSize = this.baseSize;
  //   let { startAngle, arc } = this.state;
  //   let ctx;
  //   const canvas = this.refs.canvas;
  //   if (canvas.getContext) {
  //     const outsideRadius = baseSize - 25;
  //     const textRadius = baseSize - 45;
  //     const insideRadius = baseSize - 85;
  //     const innderOutline = baseSize - 125;
  //     ctx = canvas.getContext('2d');
  //     // ctx.clearRect(0, 0, 400, 400);

  //     ctx.font = '14px Helvetica, Arial';
  //     for (let i = 0; i < options.length; i++) {
  //       const angle = startAngle + i * arc;
  //       ctx.fillStyle = options[i].color;
  //       ctx.beginPath();
  //       ctx.arc(baseSize, baseSize, outsideRadius, angle, angle + arc, false);
  //       ctx.arc(baseSize, baseSize, insideRadius, angle + arc, angle, true);
  //       ctx.fill();
  //       ctx.save();
  //       ctx.fillStyle = 'white';
  //       ctx.translate(baseSize + Math.cos(angle + arc / 2) * textRadius,
  //         baseSize + Math.sin(angle + arc / 2) * textRadius);
  //       ctx.rotate(angle + arc / 2 + Math.PI / 2);
  //       const text = options[i].number;
  //       ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
  //       ctx.restore();
  //     }
  //     //Arrow
  //     ctx.strokeStyle = 'yellow'; //arrow
  //     ctx.lineWidth = 2; //arrow
  //     ctx.fillStyle = 'red';
  //     ctx.beginPath();
  //     ctx.lineTo(baseSize + 10, baseSize - (outsideRadius + 20));
  //     ctx.lineTo(baseSize + 0, baseSize - (outsideRadius - 5));
  //     ctx.lineTo(baseSize - 10, baseSize - (outsideRadius + 20));
  //     ctx.fill();
  //     ctx.stroke();
  //   }
  // }

  // const handleOnClick = () => {
  //   spin();
  //   isSpinning(true);
  // };

  useEffect(() => {
    console.log("terrrrrr")
    drawRouletteWheel();

    // Function to handle window resize
    const handleResize = () => {
      // Check the device width and update isNavOpen accordingly
      if (window.innerWidth <= 480) {
        setBaseSize(150);
      } else {
        setBaseSize(200);
      }
    };

    // Initial check when the component mounts
    handleResize();

    // Add a resize event listener to update isNavOpen when the window is resized
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      stopRotateWheel();
      window.removeEventListener('resize', handleResize);
    };
  }, [baseSize]);

  const drawRouletteWheel = () => {
    const canvas = canvasRef.current;
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const outsideRadius = baseSize - 25;
        const textRadius = baseSize - 45;
        const insideRadius = baseSize - 85;
        const innderOutline = baseSize - 125;
        // ctx.clearRect(0, 0, baseSize * 2, baseSize * 2);

        ctx.font = '14px Helvetica, Arial';
        for (let i = 0; i < options.length; i++) {
          const angle = startAngle + i * arc;
          ctx.fillStyle = options[i].color;
          ctx.beginPath();
          ctx.arc(baseSize, baseSize, outsideRadius, angle, angle + arc, false);
          ctx.arc(baseSize, baseSize, insideRadius, angle + arc, angle, true);
          ctx.fill();
          ctx.save();
          ctx.fillStyle = 'white';
          ctx.translate(baseSize + Math.cos(angle + arc / 2) * textRadius, baseSize + Math.sin(angle + arc / 2) * textRadius);
          ctx.rotate(angle + arc / 2 + Math.PI / 2);
          const text = options[i].number;
          ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
          ctx.restore();
        }

        // Arrow
        ctx.strokeStyle = 'yellow'; //arrow
        ctx.lineWidth = 2; //arrow
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.lineTo(baseSize + 10, baseSize - (outsideRadius + 20));
        ctx.lineTo(baseSize + 0, baseSize - (outsideRadius - 5));
        ctx.lineTo(baseSize - 10, baseSize - (outsideRadius + 20));
        ctx.fill();
        ctx.stroke();
      }
    }
  };
  
  // const spin = () => {
  //   spinTimer = null;
  //   setSpinTime(0);
  //   rotate();
  // }

  // const easeOut = (t: number, b: number, c: number, d: number): number => {
  //   const ts = (t /= d) * t;
  //   const tc = ts * t;
  //   return b + c * (tc + -3 * ts + 3 * t);
  // };

  // const rotate = () => {
  //   if (spinTime > 2800) {
  //     // if(spinTimer) {
  //       clearTimeout(spinTimer);
  //       stopRotateWheel();
  //     // }
  //     console.log("spintimoerrrrrew33333333",spinTimer);
  //   } else {
  //     console.log("spintimoerrrrr",spinTimer);
  //     const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  //     console.log("spiinooo")
  //     setStartAngle(startAngle + spinAngle * Math.PI / 180);
  //     setSpinTime(spinTime + 10);
  //     drawRouletteWheel();
  //     // if(spinTimer){
  //       clearTimeout(spinTimer);
  //       spinTimer = setTimeout(() => rotate(), 30)
  //     // }
      
  //   }
  //   console.log("spintime ",spinTime)
  // }

  
  // const stopRotateWheel = () => {
  //   const canvas = canvasRef.current;
  //   if(canvas) {
  //     const ctx = canvas.getContext('2d');
  //     const degrees = startAngle * 180 / Math.PI + 90;
  //     const arcd = arc * 180 / Math.PI;
  //     const index = Math.floor((360 - degrees % 360) / arcd);
  //     if(ctx) {
  //       ctx.save();
  //       const text = options[index].number;
  //       setText(text)
  //       ctx.restore();
  //       updateNum(text);
  //     }
  //   }
    
  // }

  // const rotate = () => {
  //   console.log("spinre time",spinTime,spinTimeTotal)
  //   if (spinTime.current > spinTimeTotal) {
  //     stopRotateWheel();
  //     console.log("stw called")
  //   } else {
  //     const spinAngle = spinAngleStart - easeOut(spinTime.current, 0, spinAngleStart, spinTimeTotal);
  //     setStartAngle((prevAngle) => prevAngle + (spinAngle * Math.PI) / 180);
  //     spinTime.current += 10;
  //     spinTimer.current = window.setTimeout(rotate, 30);
  //     console.log("spinre time323",spinTime,spinTimeTotal, spinAngle)
  //   }
  // };

  const rotate = () => {
    console.log(" hello spne spintime",spinTime)
    if (spinTime > 2800) {
      clearTimeout(spinTimer.current!);
      stopRotateWheel();
    } else {
      console.log(" hello spne spintime spintimer",spinTime, spinTimer.current);
      const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
      setStartAngle(startAngle + spinAngle * Math.PI / 180);
      setSpinTime(spinTime + 10);
      drawRouletteWheel();
      // clearTimeout(spinTimer.current!);
      spinTimer.current = window.setTimeout(() => rotate(), 30);
    }
  }

  const stopRotateWheel = () => {
    console.log(" stop wheel ran");
    const canvas = canvasRef.current;
    if(canvas) {
      const ctx = canvas.getContext('2d');
      const degrees = startAngle * 180 / Math.PI + 90;
      console.log("degrees ",degrees)
      const arcd = arc * 180 / Math.PI;
      const index = Math.floor((360 - degrees % 360) / arcd);
      if(ctx) {
        ctx.save();
        const text = options[index].number;
        console.log(" text--",text);
        setText( text )
        ctx.restore();
        console.log(" text-- 2",text);
        updateNum(text);
      }
    }
  }

  const easeOut = (t: number, b: number, c: number, d: number) => {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  };

  const handleOnClick = () => {
    spin();
    rotate();
    isSpinning(true);
  };
  
  const spin = () => {
    spinTimer.current = null;
    setSpinTime(0);
    rotate();
  }
  const SpinButton = () => {

    return (
      <div>
        <input type="button" value="spin" className="btn btn-primary p-2 m-2" id="spin" onClick={handleOnClick} />
      </div>
    );

  }

  const renderNumber = () => (
    <h1 className={styles.blinky_number}>{text}</h1>
  );

  const renderBtnText = () => {
    if (text !== "") {
      return <div>{renderNumber()}</div>;
    } else {
      return <h6 className={`${styles.blink} ${styles.text_uppercase}`}>Put your bets and spin the wheel!</h6>;
    }
  };

  return (
    <>
      <div className={`${styles.roulette_container}`}>
          <canvas ref={canvasRef} width={baseSize * 2} height={baseSize * 2} className={styles.roulette_canvas}></canvas>
          {arr.length !== 0 ? (
            <button onClick={handleOnClick} className={`m-2 ${styles.spin_button}`} >
              <h5 className={`${styles.blink} ${styles.text_uppercase}`}>Spin the wheel!</h5>
            </button>
          ) : (
            <button className={`m-2 ${styles.spin_button} text_small`} >
              {renderBtnText()}
            </button>
          )}
        </div>
    </>
    
  );
};

export default SoccerCasinoRoulette;
