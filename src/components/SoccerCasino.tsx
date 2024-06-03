import React, { useState, useEffect, useContext } from 'react';
import styles from '../styles/soccercasino.module.css';
import SoccerCasinoRoulette from './SoccerCasinoRoulette';
import SoccerCasinoTable from './SoccerCasinoTable';
import Leaderboard from './SoccerRouletteLeaderboard';
import { GiDiamonds } from 'react-icons/gi';
import Head from 'next/head';
import { ThemeContext } from '../contexts/theme-context';
import firstRow from '../components/RouletteTableRows/FirstRow.json';
import firstBorder from '../components/RouletteTableRows/FirstBorder.json';
import secondRow from '../components/RouletteTableRows/SecondRow.json';
import secondBorder from '../components/RouletteTableRows/SecondBorder.json';
import thirdRow from '../components/RouletteTableRows/ThirdRow.json';
import thirdBorder from '../components/RouletteTableRows/ThirdBorder.json';
import fourthRow from '../components/RouletteTableRows/FourthRow.json';
import fifthRow from '../components/RouletteTableRows/FifthRow.json';
import columnLeft from '../components/RouletteTableRows/ColumnLeft.json';
import columnRight from '../components/RouletteTableRows/ColumnRight.json';


const SoccerCasino: React.FC = () => {
  const [num, setNum] = useState<string>('');
  const [arr, setArr] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [wins, setWins] = useState<number>(0);
  const [chip, setChip] = useState<number>(10);
  const [coins, setCoins] = useState<number>(100000);
  const [losses, setLosses] = useState<number>(0);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('Put your bets and spin the wheel!');
  const [extArr, setExtArr] = useState<any[]>([]);
  const { theme } = useContext(ThemeContext);

  const [tableData, setTableData] = useState<{
    firstRow: TableItem[];
    firstBorder: TableItem[];
    secondRow: TableItem[];
    secondBorder: TableItem[];
    thirdRow: TableItem[];
    thirdBorder: TableItem[];
    fourthRow: TableItem[];
    fifthRow: TableItem[];
    columnLeft: TableItem[];
    columnRight: TableItem[];
  }>({
    firstRow: firstRow.map((num: any) => ({ ...num, visible: false, disabled: false })),
    firstBorder: firstBorder.map((num: any) => ({ ...num, visible: false, disabled: false })),
    secondRow: secondRow.map((num: any) => ({ ...num, visible: false, disabled: false })),
    secondBorder: secondBorder.map((num: any) => ({ ...num, visible: false, disabled: false })),
    thirdRow: thirdRow.map((num: any) => ({ ...num, visible: false, disabled: false })),
    thirdBorder: thirdBorder.map((num: any) => ({ ...num, visible: false, disabled: false })),
    fourthRow: fourthRow.map((num: any) => ({ ...num, visible: false, disabled: false })),
    fifthRow: fifthRow.map((num: any) => ({ ...num, visible: false, disabled: false })),
    columnLeft: columnLeft.map((num: any) => ({ ...num, visible: false, disabled: false })),
    columnRight: columnRight.map((num: any) => ({ ...num, visible: false, disabled: false })),
  });

  const twoByOneFirst = ["3", "6", "2", "12", "15", "18", "21", "24", "27", "30", "33", "36"];
  const twoByOneSecond = ["2", "5", "8", "11", "14", "17", "20", "23", "26", "29", "32", "35"];
  const twoByOneThird = ["1", "4", "7", "10", "13", "16", "19", "22", "25", "28", "31", "34"];
  const firstTwelves = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const secondTwelves = ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];
  const thirdTwelves = ["25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36"];
  const oneToEighteen = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"];
  const nineteenToThirtySix = ["19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36"];
  const black = ["2", "4", "6", "8", "10", "11", "13", "15", "17", "20", "22", "24", "26", "28", "29", "31", "33", "35"];
  const red = ['1', '3', '5', '7', '9', '12', '14', '16', '18', '19', '21', '23', '25', '27', '30', '32', '34', '36'];
  const even = ["2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22", "24", "26", "28", "30", "32", "34", "36"];
  const odd = ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23', '25', '27', '29', '31', '33', '35'];

  useEffect(() => {
    // Fetch user data from the database and set the state with that data
    
  }, []);

  const isSpinning = (isspinning: boolean) => {
    setSpinning(isspinning);
  };

  const userLost = () => {
    setMessage('No luck this time!');
    setLosses((prevLosses) => prevLosses + 1);
    resetGame();
  };

  const userWin = (multi: number) => {
    setMessage(`You win ${multi * chip} coins!`);
    setWins((prevWins) => prevWins + 1);
    setCoins((prevCoins) => prevCoins + multi * chip);
    resetGame();
  };

  const resetGame = () => {
    setArr([]);
    setSpinning(false);
    setNum('');
    setTableData((prevState) => ({
      ...prevState,
      firstRow: prevState.firstRow.map((num) => ({ ...num, visible: false, disabled: false })),
      firstBorder: prevState.firstBorder.map((num) => ({ ...num, visible: false, disabled: false })),
      secondRow: prevState.secondRow.map((num) => ({ ...num, visible: false, disabled: false })),
      secondBorder: prevState.secondBorder.map((num) => ({ ...num, visible: false, disabled: false })),
      thirdRow: prevState.thirdRow.map((num) => ({ ...num, visible: false, disabled: false })),
      thirdBorder: prevState.thirdBorder.map((num) => ({ ...num, visible: false, disabled: false })),
      fourthRow: prevState.fourthRow.map((num) => ({ ...num, visible: false, disabled: false })),
      fifthRow: prevState.fifthRow.map((num) => ({ ...num, visible: false, disabled: false })),
      columnLeft: prevState.columnLeft.map((num) => ({ ...num, visible: false, disabled: false })),
      columnRight: prevState.columnRight.map((num) => ({ ...num, visible: false, disabled: false })),
    }));
  };

  const determineValidBets = (length: number, element: string[], num: string, multiplier: number) => {
    let extArrCopy = [...extArr];
    let filtering = element.filter((isItMyNum) => isItMyNum === num);
    if (filtering.length > 0) {
      extArrCopy.push(num);
      setExtArr(extArrCopy);
      userWin(multiplier);
    }
  };

  const determineValidBetsColFive = (
    name: string,
    element: string,
    arrName: string[],
    num: string,
    multiplier: number
  ) => {
    let extArrCopy = [...extArr];
    if (element === name) {
      let filtered = arrName.filter((item) => item === num);
      if (filtered.length > 0) {
        extArrCopy.push(num);
        setExtArr(extArrCopy);
        userWin(multiplier);
      }
    }
  };

  const updateNum = (num: string) => {
    setNum(num);
    setCount((prevCount) => prevCount + 1);

    arr.forEach((item) => {
      if (item === num) {
        userWin(35);
      }

      if (Array.isArray(item)) {
        determineValidBets(2, item, num, 17);
        determineValidBets(3, item, num, 11);
        determineValidBets(4, item, num, 8);
        determineValidBets(6, item, num, 5);
      } else {
        determineValidBetsColFive('Even', item, even, num, 1);
        determineValidBetsColFive('Odd', item, odd, num, 1);
        determineValidBetsColFive('Black', item, black, num, 1);
        determineValidBetsColFive('Red', item, red, num, 1);
        determineValidBetsColFive('1 to 18', item, oneToEighteen, num, 1);
        determineValidBetsColFive('19 to 36', item, nineteenToThirtySix, num, 1);
        determineValidBetsColFive('3rd 12', item, thirdTwelves, num, 1);
        determineValidBetsColFive('2nd 12', item, secondTwelves, num, 1);
        determineValidBetsColFive('1st 12', item, firstTwelves, num, 1);
        determineValidBetsColFive('2:1:1', item, twoByOneFirst, num, 2);
        determineValidBetsColFive('2:1:2', item, twoByOneSecond, num, 2);
        determineValidBetsColFive('2:1:3', item, twoByOneThird, num, 2);
      }
    });

    if (extArr.length === 0) {
      userLost();
    }
  };

  const updateArr = (updatedArr: any[]) => {
    setArr(updatedArr);
  };

  const updateCoins = (updatedCoins: number) => {
    setCoins(updatedCoins);
  };

  const updateRow = (row: string, val: TableItem[]) => {
    setTableData((prevState) => ({
      ...prevState,
      [row]: val,
    }));
  };

  return (
    <>
      <Head>
          <title> FootBall Casino Roulette | FifaReward</title>
          <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
      </Head>
      <div className={`${styles.main} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`}>
        <div className={styles.overlay}></div>
        <div className={styles.top}>
          <h1 className={styles.gameh1}>Fifareward Soccer Roulette Game</h1>        
          <p>
            Spin And Win
          </p>
        </div>

        <div className={styles.table}>
          <div className={`${styles.game} ${theme === 'dark' ? styles['darkmod'] : styles['lightmod']}`}>
            <div className={styles.game_in}>
              {/* Casino Roulette */}
              <div className={styles.casinoroulette}>
                <SoccerCasinoRoulette isSpinning={isSpinning} updateNum={updateNum} num={num} arr={arr} count={count} />
              </div>
              {/* game results */}
              <div className={styles.col_md_8}>
                <div className={styles.dc}>
                  <div className={styles.coins_col}>
                    <h4 className="m-0">${coins}</h4>
                  </div>
                </div>
                <div className={styles.text_center}>
                  <h6 className={styles.text_uppercase}>{message}</h6>
                </div>
                <div className={styles.text_center}>
                  <div className={`${styles.divider_line} ${styles.divider_line_center} ${styles.divider_line_linear_gradient}`}>
                    <GiDiamonds className={styles.diamond_line_icon} />
                  </div>
                  <ul className={styles.list_inline}>
                    <li className={styles.list_inline_item}>Spins: {count}</li>
                    <li className={styles.list_inline_item}>Wins: {wins}</li>
                    <li className={styles.list_inline_item}>Losses: {losses}</li>
                  </ul>
                </div>

                {/* bets array */}
                <div className={styles.bets}>
                  <div>
                    <div className="text-light-gold" style={{color: 'gold'}}>
                      My bets: {arr.join(', ')}
                    </div>
                  </div>
                </div>
                
              </div>
              
              {/* Casino table */}
              <div className={styles.casinotable}>
                <div>
                  <SoccerCasinoTable
                    firstRow={tableData.firstRow}
                    firstBorder={tableData.firstBorder}
                    secondRow={tableData.secondRow}
                    secondBorder={tableData.secondBorder}
                    thirdRow={tableData.thirdRow}
                    thirdBorder={tableData.thirdBorder}
                    fourthRow={tableData.fourthRow}
                    fifthRow={tableData.fifthRow}
                    columnLeft={tableData.columnLeft}
                    columnRight={tableData.columnRight}
                    updateRow={updateRow}
                    updateArr={updateArr}
                    updateCoins={updateCoins}
                    num={num}
                    arr={arr}
                    count={count}
                    coins={coins}
                    chip={chip}
                    spinning={spinning}
                  />
                </div>
              </div>
              
            </div>
            
          </div>

          {/* Leaderboard */}
          <div className={`${styles.leaderboard}`}>
            <Leaderboard />
          </div>
        </div>
      </div>
    </>
    
  );
};

export default SoccerCasino;
