import React, { useState, useEffect, useContext, useRef } from 'react';
import styles from '../styles/guessfootballhero.module.css';
import Leaderboard from './GuessFootballHeroLeaderboard';

import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import Loading from './Loading';
import AlertDanger from './AlertDanger';
import BgOverlay from './BgOverlay';
import FRDAbi from "../../artifacts/contracts/FifaRewardToken.sol/FifaRewardToken.json";
import GuessfhAbi from "../../artifacts/contracts/FRDGuessFootBallHero.sol/GuessFootBallHero.json";
import Confetti from 'react-confetti-boom';
import Confetti2 from 'react-confetti-explosion';
import ActionSuccessModal from './ActionSuccess';
import { FaAngleRight, FaCheck, FaXmark } from "react-icons/fa6";
import Head from 'next/head';
import { ThemeContext } from '../contexts/theme-context';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';

interface Gamedata {
  image: string;
  name: string;
  hint: string;
}

const GuessFootballHero: React.FC = () => {

  const divRef = useRef<HTMLDivElement>(null);
  const [gamedata, setGameData] = useState<Gamedata[]>([]);
  const [level, setLevel] = useState<number>(1);
  const { connectedaddress } = useUser();
  const [playedcount, setPlayedCount] = useState<number>(0);
  const [wincount, setWinCount] = useState<number>(0);
  const [amount, setAmount] = useState<string>('');
  const [remainingcount, setRemainingCount] = useState<number>(32);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [showgameresult, setShowGameResult] = useState(false);
  const [showgameresultmodal, setShowGameResultModal] = useState(false);
  const [gameId, setGameId] = useState<number>(0);
  const [actionsuccess, setActionSuccess] = useState(false);
  const [usdequivfrdamount, setUsdEquivFrdAmount] = useState<number>(0);
  const [dollarequiv, setDollarEquiv] = useState<number>(0);
  const [dollarprice, setDollarPrice] = useState<number>(0);
  const [actionsuccessmessage, setActionSuccessMessage] = useState('');
  const [showBgOverlay, setShowBgOverlay] = useState(false);
  const [alertDanger,setAlertDanger] = useState(false);
  const [errorMessage, seterrorMessage] = useState('');
  const [displayedName, setDisplayedName] = useState<string | null>(null);
  const [displayedImage, setDisplayedImage] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [displayedHint, setDisplayedHint] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedHint, setSelectedHint] = useState<string | null>(null);
  const [showconfetti, setshowconfetti] = useState(false);
  // const [tempselectedName, setTempSelectedName] = useState<string | null>(null);
  // const [tempselectedImage, setTempSelectedImage] = useState<string | null>(null);
  // const [tempselectedHint, setTempSelectedHint] = useState<string | null>(null);

  const [matchResult, setMatchResult] = useState<boolean | null>(null);
  const [blinkIndex, setBlinkIndex] = useState<number>(0);
  const [showamountmodal, setAmountModal] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState<boolean>(false);

  const FRDCA = process.env.NEXT_PUBLIC_FRD_DEPLOYED_CA;
  const GuessfhCA = process.env.NEXT_PUBLIC_GUESSFOOTBALLHERO_CA;
  const { walletProvider } = useWeb3ModalProvider();
  const { address, isConnected } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const router = useRouter();

  const totalCount = 32;
  const { theme } = useContext(ThemeContext);
  
  useEffect(() => {

    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    
    if(udetails && udetails !== null && udetails !== "") {
      const username_ = udetails.username;  
      if(username_) {
        setUsername(username_);
      }
    }else {
      open()
    }

    const getUserGames = async () => {
      try {
        
        const config = {
          headers: {
              "Content-type": "application/json"
          }
        } 
        const {data} = await axios.post('https://fifarewardbackend-1.onrender.com/api/guessfootballhero/getusergames',{
          address: connectedaddress
        },config);
        if (data.games != null && data.games.length > 0) {
          setGameId(data.games[0].gameId);
          setRemainingCount(data.games[0].remaining);
          setPlayedCount(data.games[0].played);
          setWinCount(data.games[0].wins);
          setLevel(data.games[0].level);
        } else {

        }
      } catch (error) {
      }
    }
    getUserGames()

    const fetchItems = async () => {
      try {
        setShowBgOverlay(true);
        setLoading(true);
        const {data} = await axios.get('https://fifarewardbackend-1.onrender.com/api/players/getgamedata');
        if (Array.isArray(data.gamedata)) {
          const shuffledItems = shuffleArray(data.gamedata);
          setGameData(shuffleArray(data.gamedata));
          // Set a random item from the fetched items to display hint and name
          const randomItem = shuffledItems[Math.floor(Math.random() * shuffledItems.length)];
          setDisplayedHint(randomItem.hint);
          setDisplayedName(randomItem.name);
          setDisplayedImage(randomItem.image)
          setLoading(false);
          setShowBgOverlay(false)
        } else {
          console.error('Expected an array of items');
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
    const getUSDEQUIVFRDAMOUNT =  async () => {
      try {
        const config = {
          headers: {
              "Content-type": "application/json"
          }
        }  
        const {data} = await axios.get("../../../../api/gettokenprice", config);
        setDollarPrice(data.usdprice);
        setUsdEquivFrdAmount(data.usdequivalentfrdamount);
        setAmount(data.usdequivalentfrdamount);
        setDollarEquiv(data.usdequivalentfrdamount * data.usdprice)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getUSDEQUIVFRDAMOUNT();

  }, []);

  const reloadGame = async () => {
    try {
      if (Array.isArray(gamedata)) {
        shuffleArray(gamedata);
      } else {
        console.error('Expected an array of items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkIndex(Math.floor(Math.random() * gamedata.length));
    }, 1000);

    return () => clearInterval(interval);
  }, [gamedata]);

  const shuffleArray = (array: Gamedata[]): Gamedata[] => {
    return array.sort(() => Math.random() - 0.5);
  };

  const HandleGamePlay = async (image: string, hint: string, name: string) => {
    
    try {
      const provider = new ethers.providers.Web3Provider(walletProvider as any);
      const signer = provider.getSigner();

      /* next, create the item */
      let FRDcontract = new ethers.Contract(FRDCA!, FRDAbi, signer);
      
      // const tamount = ethers.BigNumber.from("5000000000000000000000000");
      // let fundwalletaddress = FRDcontract.transfer("0x6df7E51F284963b33CF7dAe442E5719da69c312d",tamount);
      // console.log("fundwalletaddress result",fundwalletaddress);
      // return;
      let transaction = await FRDcontract.balanceOf(connectedaddress);
      let frdBal = ethers.utils.formatEther(transaction);
      if(parseInt(frdBal) < usdequivfrdamount) {
        setAlertDanger(true);
        seterrorMessage(`You need a minimum of ${usdequivfrdamount}FRD in your wallet to proceed, top up and try again!`);
        setLoading(false);
        setShowBgOverlay(false);
        return;
      }else {

        // setPlayedCount((previousplayed) => (previousplayed + 1));
        if(remainingcount < 32 && playedcount > 0) {
          continueGame();
        }else {
          setAmountModal(true);
          setShowBgOverlay(true);
          setTimeout(function() {
            if(divRef.current) {
              divRef.current.focus()
            }
          }, 2000);
        }
        
      }
      
    } catch (error) {
      setAlertDanger(true);
      seterrorMessage(`transaction cancelled /${error}`);
      setLoading(false)
    }
  }

  const handleImageClick = async (image: string, hint: string, name: string) => {
        try {
          
          const config = {
            headers: {
                "Content-type": "application/json"
            }
          }  

          const {data} = await axios.post('https://fifarewardbackend-1.onrender.com/api/guessherohint/addupdatehint', {
            address:connectedaddress,
            name,
            image,
            hint
        }, config);
        if(data.hint != null) {
          setSelectedImage(data.hint.selectedImage);
          setSelectedName(data.hint.selectedName);
          setSelectedHint(data.hint.selectedHint);
        }
          
        } catch (error) {
          console.error('Error fetching items:', error);
        }
        HandleGamePlay(image, hint, name);
  };

  const Play = async() => {
    setLoading(true);
    if(parseInt(amount) < usdequivfrdamount) {
      setShowBgOverlay(true);
      setAlertDanger(true);
      seterrorMessage(`Amount can not be less than ${usdequivfrdamount.toLocaleString()} FRD`)
      return;
    }else {
      setLoading(true);
      continueGame();
    }
  }

  const gamePlay = async (selectedHint: string, selectedImage: string, selectedName: string) => {
    if(!selectedHint && !selectedImage && !selectedName) {
      return;
    }else {
      if(remainingcount == 32 && playedcount == 0) {
        
        // add game data to database
        try {
          
          const config = {
            headers: {
                "Content-type": "application/json"
            }
          }  

          const {data} = await axios.post('https://fifarewardbackend-1.onrender.com/api/guessfootballhero/startgame', {
            selectedName,
            selectedHint,
            amount,
            playedcount,
            remainingcount,
            totalCount,
            level,
            address:connectedaddress,
            wincount
        }, config);
        if(data.game != null) {
          setGameId(data.game.gameId);
          setWinCount(data.game.wins);
          setRemainingCount(data.game.remaining);
          setLevel(data.game.level);
          setIsImageSelected(true);
          setShowGameResult(true);
          setShowBgOverlay(true);
          setShowGameResultModal(true);
          setTimeout(function() {
            if(divRef.current) {
              divRef.current.focus()
            }
          }, 2000);
          setPlayedCount(data.game.played);
          setLoading(false);
        }
          
        } catch (error) {
          console.error('Error fetching items:', error);
        }
  
        }else {
                    // add game data to database
          try {
            // setIsImageSelected(true);
            const config = {
              headers: {
                  "Content-type": "application/json"
              }
            }  
            const {data} = await axios.post('https://fifarewardbackend-1.onrender.com/api/guessfootballhero/updategame', {
              gameId,
              selectedName,
              selectedHint,
              amount,
              playedcount,
              remainingcount,
              totalCount,
              level,
              address: connectedaddress,
              wincount
          }, config);
          if(data.getupgame != null && data.getupgame != undefined) {
            setLoading(false);
            setRemainingCount(data.getupgame.remaining);
            setLevel(data.getupgame.level);
            setShowGameResult(true);
            setShowBgOverlay(true);
            setShowGameResultModal(true);
            setTimeout(function() {
              if(divRef.current) {
                divRef.current.focus()
              }
            }, 2000);
            setIsImageSelected(true);
            setWinCount(data.getupgame.wins)
            setPlayedCount(data.getupgame.played);
          }
            
          } catch (error) {
            console.error('Error fetching items:', error);
          }
  
        }
  
      setMatchResult(displayedHint === selectedHint && displayedName === selectedName);
      if(displayedHint === selectedHint && displayedName === selectedName) {
        try {
          
          const config = {
            headers: {
                "Content-type": "application/json"
            }
          }  

          const {data} = await axios.post('https://fifarewardbackend-1.onrender.com/api/guessfootballhero/updatewinslevel', {
            gameId
        }, config);
        if(data.getupgame != null) {
          setWinCount(data.getupgame.wins);
          setLevel(data.getupgame.level);
        }
          
        } catch (error) {
          console.error('Error fetching items:', error);
        }

        if(level > 2 ) {
          
          if (walletProvider) {
            try {
              const provider = new ethers.providers.Web3Provider(walletProvider as any);
              const signer = provider.getSigner();
        
              const guessfootballherocontract = new ethers.Contract(GuessfhCA!, GuessfhAbi, signer);
              const amt =  amount + "000000000000000000";
              const tamount = ethers.BigNumber.from(amt);
              const hinta = [selectedName,selectedHint]
              try {
                const playGame = await guessfootballherocontract.Play(gameId, tamount, level, playedcount, remainingcount, wincount, hinta, { gasLimit: 1000000 }
                );
        
                try {
                  const receipt = await playGame.wait();
                  if (receipt && receipt.status === 1) {
                    // transaction success
                    setRemainingCount(32);
                    setPlayedCount(0)
                    setLoading(false);
                    setshowconfetti(true);
                    setActionSuccess(true);
                    setActionSuccessMessage(`Hurray! you won, ${2 * parseInt(amount)}FRD has been transferred to your wallet`)
                  }
                } catch (receiptError: any) {
                  console.log('Transaction receipt error', receiptError);
                  setAlertDanger(true);
                  seterrorMessage(receiptError.code || receiptError.message);
                  setLoading(false);
                }
              } catch (transactionError: any) {
                console.log('Transaction error', transactionError);
                setAlertDanger(true);
                seterrorMessage(transactionError.code || transactionError.message);
                setLoading(false);
              }
            } catch (providerError: any) {
              console.log('Provider error', providerError);
              setAlertDanger(true);
              seterrorMessage(providerError.code || providerError.message);
              setLoading(false);
            }
          }
          // setActionSuccess(true);
          // setActionSuccessMessage(`Guess passed, level ${level} upgrade `);
          setShowBgOverlay(true);
          setShowGameResultModal(true);
          setTimeout(function() {
            if(divRef.current) {
              divRef.current.focus()
            }
          }, 2000);
        }else {
          // setActionSuccess(true);
          // setActionSuccessMessage(`Guess passed, level ${level} upgrade `);
          setShowBgOverlay(true);
          setShowGameResultModal(true);
          setTimeout(function() {
            if(divRef.current) {
              divRef.current.focus()
            }
          }, 2000);
          // setTimeout(function(){
          //   reloadGame();
          //   blurBackImage();
          // },3000)
        } 
        
      }else {
        setAmountModal(false);
        setLoading(false);
        // setShowBgOverlay(false);
        
      }
    }
  }
  
  const continueGame = async () => {

    try {
        setAmountModal(false)
      const config = {
        headers: {
            "Content-type": "application/json"
        }
      }  

      const {data} = await axios.post('https://fifarewardbackend-1.onrender.com/api/guessherohint/gethint', {
        address: connectedaddress
    }, config);
    if(data.hint != null) {
      setSelectedImage(data.hint.selectedImage);
      setSelectedName(data.hint.selectedName);
      setSelectedHint(data.hint.selectedHint);
      gamePlay(data.hint.selectedHint,data.hint.selectedImage,data.hint.selectedName);
    }
      
    } catch (error) {
      console.error('Error fetching items:', error);
    }
    
    
  }

  const setAmounts = (e: any) => {
    setAmount(e.target.value);
    setDollarEquiv(e.target.value * dollarprice);

  }

  const closeAmountModalDiv = () => {
    setShowBgOverlay(false);
    setLoading(false);
    setAmountModal(false);
  }

  const closeGameResultModalDiv = () => {
    reloadGame();
    blurBackImage();
    setShowBgOverlay(false);
    setLoading(false);
    setShowGameResultModal(false);
  }

  const blurBackImage = () => {
    setIsImageSelected(false);
  };

  const closeBgModal = () => {
    setShowBgOverlay(false);
    setLoading(false);
  }  

  const closeAlertModal = () => {
    setAlertDanger(false);
    setShowBgOverlay(false);
    setLoading(false);
  }

  const closeActionModalComp = () => {
    // let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
    // hiw_bgoverlay.style.display = 'none';
    setShowBgOverlay(false);
    setActionSuccess(false);
  }

  return (
    <>
      <Head>
          <title> Guess Football hero | Fifareward</title>
          <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
      </Head>
      {actionsuccess && 
          <ActionSuccessModal prop={actionsuccessmessage} onChange={closeActionModalComp}/>
      }
      {showconfetti && <><Confetti /><Confetti2 /></>}
      {loading && <Loading />}
      {showBgOverlay && <BgOverlay onChange={closeBgModal} />}
      {alertDanger && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
      {showamountmodal && 
          <div className={styles.bt_amt} ref={divRef}>
            <div className={styles.bt_amt_c}>
              <div className={styles.bt_amt_h}>
                  <div>
                    
                  </div>
                  <div>
                    <h1> Enter Amount in FRD ({`min ${usdequivfrdamount.toLocaleString()}FRD ($10)`}) </h1>
                  </div>
                  <div>
                    <button type='button' onClick={closeAmountModalDiv} style={{color: 'white'}}>{<FaXmark />}</button>
                  </div>
              </div>
              <div className={styles.bt_amt_c_in}>
                  <div className={styles.bt_amt_c_ina}>
                      <div className={styles.list_tc}>
                        {/* <div className={styles.labelc}>
                          <div>Available {withdrawreward} FRD</div>
                        </div> */}
                        <label>${dollarequiv.toLocaleString()}.00</label>
                        <input type='number' onChange={(e) => setAmounts(e) } value={amount} placeholder='Enter amount'/>
                       </div>
                  </div>
                  <div>
                    <button className={styles.createlistitem_} onClick={(e) => Play()}>Play</button>
                  </div>
              </div>
            </div>
        </div>
        }

        {showgameresultmodal &&
            <div className={styles.game_reslt} ref={divRef}>
              <div className={styles.game_reslt_c}>
                <div className={styles.game_reslt_h}>
                    <div>
                      
                    </div>
                    <div>
                      <h1> Game Result </h1>
                    </div>
                    <div>
                      <button type='button' onClick={closeGameResultModalDiv} style={{color: 'white'}}>{<FaXmark />}</button>
                    </div>
                </div>
                <div className={styles.game_reslt_c_in}>
                    <div className={styles.game_reslt_c_ina}>
                        <div className={styles.list_tc}>
                          <div>
                            <img src={displayedImage!} alt='image' width={100} height={120} />
                            <div>
                              Player: {displayedName}
                            </div>
                            <div>
                              Hint: {`${displayedHint?.substring(0,60)+'...'}`}
                            </div>
                          </div>
                          <div className={styles.guess}>
                            Player to guess <FaCheck />
                          </div>
                        </div>
                        <div className={styles.list_tc}>
                          <div>
                            <img src={selectedImage!} alt='image' width={100} height={120} style={{textAlign: 'right'}} />
                            <div>
                              Player: {selectedName}
                            </div>
                            <div>
                              Hint: {selectedHint?.substring(0,60)+'...'}
                            </div>
                          </div>
                          <div className={styles.guess}>
                            Player guessed 
                          </div>
                        </div>
                    </div>
                    
                    <div className={styles.result}>
                      <div className={styles.resulta}>
                        <p>Game Result: {matchResult ? <span>Level Passed</span> : <span>Level Failed</span>}</p>
                      </div>
                    </div>

                    <div className={styles.levelsm}>
                      <div>
                        <span>Level</span> <span className={`${styles.levelc}  ${styles.lvlc}`}>{level}</span>
                      </div>
                      <div>
                        <span>Total</span> <span className={`${styles.levelc}  ${styles.lvlc}`}>{totalCount}</span>
                      </div>
                      <div>
                        <span>Remaining</span> <span className={`${styles.levelc}  ${styles.lvlc}`}>{remainingcount}</span>
                      </div>
                      <div><span>Win </span> <span className={`${styles.levelc} ${styles.win}`}>{wincount}</span></div>
                      <div><span>Played</span> <span className={`${styles.levelc}  ${styles.played}`}>{playedcount}</span></div>
                    </div>

                    <div className={styles.chances}>You've {remainingcount} more chances to go </div>

                    <div>
                      <button className={styles.playagain} onClick={closeGameResultModalDiv}>Play Again</button>
                    </div>
                </div>
              </div>
          </div>

        }

      <div className={`${styles.main} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`}>
        <div className={styles.overlay}></div>
        <div className={styles.top}>
          <h1 className={styles.gameh1}>Guess Your Football Hero</h1>        
          <p>
            Guess Right And Get 2x Rewarded
          </p>
        </div>

        <div className={styles.table}>
          <div className={`${styles.game} ${theme === 'dark' ? styles['darkmod'] : styles['lightmod']}`}>
            
            <div className={styles.game_in}>
                <div className={styles.gallery}>
                  <div className={styles.head}>
                    <h3>How To Play The Guess Football Hero Game</h3>
                    <div>
                      
                      <ul>
                        <li>
                            <FaAngleRight color='#e28304'/> You start the game at <span className={styles.lvl}>level 1</span>
                        </li>
                        <li>
                            <FaAngleRight color='#e28304'/> Guess the correct player and move to <span className={styles.lvl}>level 2</span>
                        </li>
                        <li>
                          <FaAngleRight color='#e28304'/> Fail and repeat level 1
                        </li>
                        <li>
                            <FaAngleRight color='#e28304'/> You have a total of 32 chances to guess the footballer right
                        </li>
                        <li>
                            <FaAngleRight color='#e28304'/> Guess all two levels correct and get rewarded 2x 
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {gamedata.map((item, index) => (
                    <div
                      key={index}
                      className={`${styles.card} ${selectedImage === item.image ? styles.selected : ''}`}
                      onClick={() => handleImageClick(item.image, item.hint, item.name)}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`${selectedImage === item.image && isImageSelected ? '' : styles.blurred} ${blinkIndex === index ? styles.blink : ''}`}
                      />
                      {/* <div className={styles.info}>
                        <h3>{item.name}</h3>
                        <p>{item.hint}</p>
                      </div> */}
                    </div>
                  ))}

                <div className={styles.hint}>
                  <div className={styles.heda}>
                    To win the game, guess (select) the football player that match the description below
                  </div>
                  <div className={styles.hinta}>
                    <h2>Name: <span className={styles.colsa}>{displayedName}</span></h2>
                    <h2>Hint: <span className={styles.colsa}>{displayedHint}</span></h2>
                  </div>
                </div>

                  <div className={styles.result}>
                  {showgameresult && (
                    <div className={styles.resulta}>
                      <p>Game Result: {matchResult ? <span>Level Passed</span> : <span>Level Failed</span>}</p>
                    </div>
                    )}  
                  </div>

                  <div className={styles.levelsm}>
                    <div>
                      <span>Level</span> <span className={`${styles.levelc}  ${styles.lvlc}`}>{level}</span>
                    </div>
                    <div>
                      <span>Total</span> <span className={`${styles.levelc}  ${styles.lvlc}`}>{totalCount}</span>
                    </div>
                    <div>
                      <span>Remaining</span> <span className={`${styles.levelc}  ${styles.lvlc}`}>{remainingcount}</span>
                    </div>
                    <div><span>Win </span> <span className={`${styles.levelc} ${styles.win}`}>{wincount}</span></div>
                    <div><span>Played</span> <span className={`${styles.levelc}  ${styles.played}`}>{playedcount}</span></div>
                  </div>

                </div>
            {/* Gallery ends  */}
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

export default GuessFootballHero;
