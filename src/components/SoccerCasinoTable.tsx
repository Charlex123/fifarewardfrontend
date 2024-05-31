import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/soccercasinotable.module.css';
import '../styles/soccercasinotable.module.css';
import Chip from '../components/SoccerCasinoChips';

interface SoccerCasinoTableProps {
  firstRow: any[];
  firstBorder: any[];
  secondRow: any[];
  secondBorder: any[];
  thirdRow: any[];
  thirdBorder: any[];
  fourthRow: any[];
  fifthRow: any[];
  columnLeft: any[];
  columnRight: any[];
  updateRow: (row: string, val: any[]) => void;
  updateArr: (arr: any[]) => void;
  updateCoins: (coins: number) => void;
  num: string;
  arr: any[];
  count: number;
  coins: number;
  chip: number;
  spinning: boolean;
}

const SoccerCasinoTable: React.FC<SoccerCasinoTableProps> = (props) => {
  const {
    firstRow,
    firstBorder,
    secondRow,
    secondBorder,
    thirdRow,
    thirdBorder,
    fourthRow,
    fifthRow,
    columnLeft,
    columnRight,
    spinning,
    arr,
    coins,
    chip,
    updateRow,
    updateArr,
    updateCoins,
  } = props;

  const [state, setState] = useState({
    firstRow,
    firstBorder,
    secondRow,
    secondBorder,
    thirdRow,
    thirdBorder,
    fourthRow,
    fifthRow,
    columnLeft,
    columnRight,
    disabled: false,
  });

  const disableTable = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      disabled: spinning,
    }));
  }, [spinning]);

  useEffect(() => {
    disableTable();
    console.log("first row",firstRow);
  }, [disableTable]);

  const numsSelectionHandler = (num: number, whichRow: string) => {
    let nums = arr.length === 0 ? [] : [...arr];
    let row = [...(state[whichRow as keyof typeof state] as any[])];
    let updatedCoins = coins;

    if (nums.indexOf(num) >= 0) {
      nums.splice(nums.indexOf(num), 1);
      updatedCoins = coins + chip;
      row = row.map((chip) => {
        if (chip.n === num) {
          chip.visible = false;
        }
        return chip;
      });
      updateRow(whichRow, row);
      setState((prevState) => ({ ...prevState, [whichRow]: row }));
    } else {
      updatedCoins = coins - chip;
      nums.push(num);
      row = row.map((chip) => {
        if (chip.n === num) {
          chip.visible = true;
        }
        return chip;
      });
      setState((prevState) => ({ ...prevState, [whichRow]: row }));
    }

    updateArr(nums);
    updateCoins(updatedCoins);
  };

  return (
    <div className={`${styles.roulette_table}`}>
      <div className={styles.roulettetable_top}>
        <ul className={`${styles.list_unstyled} ${styles.flexed}`}>
          {state.columnLeft.map((num, index, arr) => (
            <>
              <li key={num.n + index + arr} className={`${styles[num.className.split(' ')[0]!]} ${styles[num.className.split(' ')[1]!]} ${styles[num.className.split(' ')[2]!]} ${styles.no_cursor}`} value={num.n}>
                {/* <div overlay={<div id="tooltip-disabled">No bets on {num.n}!</div>}>
                  <span className="d-inline-block">{num.n}</span>
                </div> */}
              </li>
            </>
          ))}
        </ul>
      </div>

      <div className={styles.roulettetable_main}>
        <div className={styles.table_divider}></div>
        <ul className={`${styles.list_unstyled} ${styles.flexed}`}>
          {state.firstRow.map((num, index, arr) => (
            <>
              <button
                key={num.n + index + arr}
                className={`${styles[num.className.split(' ')[0]!]} ${styles[num.className.split(' ')[1]!]} ${styles[num.className.split(' ')[2]!]}`}
                value={num.n}
                onMouseEnter={disableTable}
                disabled={state.disabled}
                onClick={() => numsSelectionHandler(num.n, 'firstRow')}
              >
                <Chip id={num.n} active={num.visible} />
              </button>
            </>
          ))}
        </ul>
        <ul className={`${styles.list_unstyled} ${styles.flexed}`}>
          {state.firstBorder.map((num, index, arr) => (
            <button
              key={num.n + index + arr}
              className={`${styles[num.className.split(' ')[0]!]} ${styles[num.className.split(' ')[1]!]} ${styles[num.className.split(' ')[2]!]}`}
              value={num.n}
              onMouseEnter={disableTable}
              disabled={state.disabled}
              onClick={() => numsSelectionHandler(num.n, 'firstBorder')}
            >
              <Chip id={num.n} active={num.visible} />
            </button>
          ))}
        </ul>
        <ul className={`${styles.list_unstyled} ${styles.flexed}`}>
          {state.secondRow.map((num, index, arr) => (
            <button
              key={num.n + index + arr}
              className={`${styles[num.className.split(' ')[0]!]} ${styles[num.className.split(' ')[1]!]} ${styles[num.className.split(' ')[2]!]}`}
              value={num.n}
              onMouseEnter={disableTable}
              disabled={state.disabled}
              onClick={() => numsSelectionHandler(num.n, 'secondRow')}
            >
              <Chip id={num.n} active={num.visible} />
            </button>
          ))}
        </ul>
        <ul className={`${styles.list_unstyled} ${styles.flexed}`}>
          {state.secondBorder.map((num, index, arr) => (
            <button
              key={num.n + index + arr}
              className={`${`${styles[num.className.split(' ')[0]!]} ${styles[num.className.split(' ')[1]!]} ${styles[num.className.split(' ')[2]!]}`}`}
              value={num.n}
              onMouseEnter={disableTable}
              disabled={state.disabled}
              onClick={() => numsSelectionHandler(num.n, 'secondBorder')}
            >
              <Chip id={num.n} active={num.visible} />
            </button>
          ))}
        </ul>
        <ul className={`${styles.list_unstyled} ${styles.flexed}`}>
          {state.thirdRow.map((num, index, arr) => (
            <button
              key={num.n + index + arr}
              className={`${`${styles[num.className.split(' ')[0]!]} ${styles[num.className.split(' ')[1]!]} ${styles[num.className.split(' ')[2]!]}`}`}
              value={num.n}
              onMouseEnter={disableTable}
              disabled={state.disabled}
              onClick={() => numsSelectionHandler(num.n, 'thirdRow')}
            >
              <Chip id={num.n} active={num.visible} />
            </button>
          ))}
        </ul>
        <ul className={`${styles.list_unstyled} ${styles.flexed}`}>
          {state.thirdBorder.map((num, index, arr) => (
            <button
              key={num.n + index + arr}
              className={`${`${styles[num.className.split(' ')[0]!]} ${styles[num.className.split(' ')[1]!]} ${styles[num.className.split(' ')[2]!]}`}`}
              value={num.n}
              onMouseEnter={disableTable}
              disabled={state.disabled}
              onClick={() => numsSelectionHandler(num.n, 'thirdBorder')}
            >
              <Chip id={num.n} active={num.visible} />
            </button>
          ))}
        </ul>
        <ul className={`${styles.list_unstyled} ${styles.flexed}`}>
          {state.fourthRow.map((num, index, arr) => (
            <button
              key={num.n + index + arr}
              className={`${`${styles[num.className.split(' ')[0]!]} ${styles[num.className.split(' ')[1]!]} ${styles[num.className.split(' ')[2]!]}`}`}
              value={num.n}
              onMouseEnter={disableTable}
              disabled={state.disabled}
              onClick={() => numsSelectionHandler(num.n, 'fourthRow')}
            >
              <Chip id={num.n} active={num.visible} />
            </button>
          ))}
        </ul>
        <div className={styles.table_divider}></div>
        {/* <ul className={`${styles.list_unstyled} ${styles.flexed}`}>
          {state.fifthRow.map((num, index, arr) => (
            <button
              key={num.n + index + arr}
              className={`${`${styles[num.className.split(' ')[0]!]} ${styles[num.className.split(' ')[1]!]} ${styles[num.className.split(' ')[2]!]}`}`}
              value={num.n}
              onMouseEnter={disableTable}
              disabled={state.disabled}
              onClick={() => numsSelectionHandler(num.n, 'fifthRow')}
            >
              <Chip id={num.n} active={num.visible} />
            </button>
          ))}
        </ul>
        <div className={styles.table_divider}></div> */}
      </div>
      <div className={styles.roulettetable_main}>
        <div className={styles.table_divider}></div>
        {/* <ul className={styles.list_unstyled}>
          {state.columnRight.map((num, index, arr) => (
            <li className={`${`${styles[num.className.split(' ')[0]!]} ${styles[num.className.split(' ')[1]!]} ${styles[num.className.split(' ')[2]!]}`}`} key={num.n + index + arr}>
              <button
                className={styles.blues}
                value={num.n}
                onMouseEnter={disableTable}
                disabled={state.disabled}
                onClick={() => numsSelectionHandler(num.n, 'columnRight')}
              >
                <Chip id={num.n} active={num.visible} />
              </button>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};

export default SoccerCasinoTable;
