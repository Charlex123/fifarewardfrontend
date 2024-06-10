import React, { useContext,useState,useEffect, useRef } from 'react';

import Loading from './Loading';
import BgOverlay from './BgOverlay';
import ActionSuccessModal from './ActionSuccess';
import AlertDanger from './AlertDanger';
import { useUser } from '../contexts/UserContext';
import { useRouter } from 'next/router';
import moment from 'moment';
import { ThemeContext } from '../contexts/theme-context';
import GFHAbi from '../../artifacts/contracts/FRDGuessFootBallHero.sol/GuessFootBallHero.json'
import { ethers } from 'ethers';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { GuessFootBallHeroMetadata } from './GuessFootballHeroMetadata';
import axios from 'axios';
import Head from 'next/head';
// material
import styles from "../styles/mygames.module.css";
import dotenv from 'dotenv';
dotenv.config();
// component
const MyGames: React.FC<{}> = () =>  {

    const { connectedaddress } = useUser();
    const [showloading, setShowLoading] = useState<boolean>(false);
    const { open } = useWeb3Modal();
    const { walletProvider } = useWeb3ModalProvider();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit] = useState<number>(10)
    const [usdequivfrdamount, setUsdEquivFrdAmount] = useState<number>(0);
    const [frdusdprice, setFrdUsdPrice] = useState<any>();
    const [totalPages, setTotalPages] = useState(0);
    const [gameData,setGameData] = useState<GuessFootBallHeroMetadata[]>([]);
    const [showAlertDanger,setShowAlertDanger] = useState<boolean>(false);
    const [errorMessage,seterrorMessage] = useState<string>("");
    const [showbetconditions, setShowBetConditions] = useState<boolean>(false);
    const [showBgOverlay,setShowBgOverlay] = useState<boolean>(false);
    const { theme } = useContext(ThemeContext);
    const [nftactionsuccess,setActionSuccess] = useState<boolean>(false);

    
    const GuessfhCA = process.env.NEXT_PUBLIC_GUESSFOOTBALLHERO_CA;

    const router = useRouter();

    useEffect(() => {
      const udetails = JSON.parse(localStorage.getItem("userInfo")!);
      if(!udetails) {
        open()
      }else {
        
      }
    },[])
  
    useEffect(() => {

      const getUSDEQUIVFRDAMOUNT =  async () => {
        try {
          const config = {
            headers: {
                "Content-type": "application/json"
            }
          }  
          const {data} = await axios.get("../../../../api/gettokenprice", config);
          setUsdEquivFrdAmount(data.usdequivalentfrdamount);
          setFrdUsdPrice(data.usdprice);
          console.log("usd price",data.usdprice);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      getUSDEQUIVFRDAMOUNT();
      

      const fetchData = async () => {

          
          if(walletProvider) {
            try {
              setShowLoading(true);
              const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
              const signer = provider.getSigner();
              const gfhcontract = new ethers.Contract(GuessfhCA!, GFHAbi, signer);
              const loaduserGames = await gfhcontract.loadUserGames(connectedaddress);
              await loaduserGames.forEach(async (element:any) => {
                if(element.walletaddress != 0x0000000000000000000000000000000000000000) {
                  
                  let item: GuessFootBallHeroMetadata = {
                    Id: element.Id,
                    gameId: element.gameId,
                    amountplayed: element.amountplayed,
                    rewardamount: element.rewardamount,
                    time: element.time,
                    played: element.played,
                    level: element.level,
                    wins: element.wins,
                    remaining: element.remaining,
                    hint: element.hint,
                    walletaddress: element.walletaddress,
                  }
                  // Prevent duplicate entries based on betId
                  setGameData(prevGameData => {
                    if (!prevGameData.some(existingItem => existingItem.Id.toString() === item.Id.toString())) {
                        return [...prevGameData, item];
                    }
                    return prevGameData;
                });
                  setShowLoading(false);
                  return item;
              }else {
                setShowLoading(false);
                setShowBgOverlay(false);
              }
              });
            } catch (error: any) {
              setShowAlertDanger(true);
              seterrorMessage(error.code);
              setShowLoading(false);
            }
            
          }
    };

    fetchData();
    },[connectedaddress,gameData])
    
    const toggleAddress = (e:any) => {
      let fulladdress = e.previousElementSibling as HTMLSpanElement;
      fulladdress.style.display = (fulladdress.style.display === 'block') ? 'none' : 'block';
    }

    
    const goBack = () => {
        router.back()
    }
    
    
    const gotoPage = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    };
    
    // Function to render page numbers
    const renderPageNumbers = () => {
      let pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button className={styles.number} type='button' title='button' key={i} onClick={() => setCurrentPage(i)} disabled={i === currentPage}>
            {i}
          </button>
        );
      }
      return pages;
    };

    const closeAlertModal = () => {
      setShowAlertDanger(false);
      setShowBgOverlay(false);
    }

    const closeActionModalComp = () => {
      // let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
      // hiw_bgoverlay.style.display = 'none';
      setShowBgOverlay(false);
      setActionSuccess(false);
      router.reload();
    }

    const closeBgModal = () => {
      setShowLoading(false);
      setShowBgOverlay(false);
    }

  return (
    <>
    <Head>
        <title> My Games | Fifareward</title>
        <meta name='description' content='Fifareward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
    </Head>
    {showloading && <Loading/>}
    {showBgOverlay && <BgOverlay onChange={closeBgModal}/>}
    {showAlertDanger && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
    {nftactionsuccess && 
        <ActionSuccessModal prop='Game ' onChange={closeActionModalComp}/>
    }
     
      <div className={`${styles.main} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`}>
        <div className={styles.goback}>
          <button type='button' title='button' onClick={goBack} style={{color: 'white'}}> {'< '} back</button> 
        </div>
        <div className={styles.main_bg_overlay}></div>
          <div>
            <div>
              <h1>My Games</h1>
            </div>
          </div>
          {/* banner header */}
          
          {gameData && gameData.length > 0 ? 
            <div className={styles.openbetmain}>
            <div className={styles.table_c}>
              <table>
                <thead>
                  <tr>
                    {/* <th>S/N</th> */}
                    <th>S/N Id</th>
                    <th>gameId</th>
                    <th>Amount Played</th>
                    <th>Reward Amount</th>
                    <th>Played</th>
                    <th>Level</th>
                    <th>Wins</th>
                    <th>Remaining</th>
                    <th>Hints</th>
                    <th>Status</th>
                    <th>Address</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {gameData.map((herogame, index) => (
                    <tr key={index}>
                      {/* <td><div className={styles.div}>{index+1}</div></td> */}
                      <td><div className={styles.div}>{index+1}</div></td>
                      <td><div className={styles.div}>{herogame.Id.toString()}</div></td>
                      <td><div className={styles.div}>{herogame.gameId.toString()}</div></td>
                      <td><div className={styles.div}>{(herogame.amountplayed.toNumber().toLocaleString())}{<span className={styles.amtunit}>FRD</span>} ({`$${Math.ceil(herogame.amountplayed.toNumber() * frdusdprice).toLocaleString()}`})</div></td>
                      <td><div className={styles.div}>{herogame.rewardamount.toNumber().toLocaleString()}{<span className={styles.amtunit}>FRD</span>} ({`$${Math.ceil(herogame.rewardamount.toNumber() * frdusdprice).toLocaleString()}`})</div></td>
                      <td><div className={styles.div}>{(herogame.played.toNumber().toLocaleString())}</div></td>
                      <td><div className={styles.div}>({herogame.level.toNumber()})</div></td>
                      <td><div className={styles.div}>{herogame.wins.toNumber()}</div></td>
                      <td><div className={styles.div}>{herogame.remaining.toNumber()}</div></td>
                      <td>
                        <div className={styles.div}>
                            <div>{herogame.hint[0]}</div>
                            <div>{herogame.hint[1]}</div>
                        </div>
                      </td>
                      <td><div className={styles.stat}>Win</div></td>
                      <td><div className={styles.divaddress}><span>{herogame.walletaddress.substring(0,8)+'...'}</span><span className={styles.fulladdr}>{herogame.walletaddress}</span><button type='button' onClick={(e) => toggleAddress(e.target)}>View</button></div></td>
                      <td><div className={styles.div}>{moment(herogame.time.toNumber()).startOf('day').fromNow()}</div></td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {gameData.length > 10 &&
              <div className={styles.paginate_btns}>
              <button type='button' title='button' onClick={() => gotoPage(1)} disabled={currentPage === 1}>
                {'<<'}
              </button>
              <button type='button' title='button' onClick={() => gotoPage(currentPage - 1)} disabled={currentPage === 1}>
                {'<'}
              </button>
              {renderPageNumbers()}
              <button type='button' title='button' onClick={() => gotoPage(currentPage + 1)} disabled={currentPage === totalPages}>
                {'>'}
              </button>
              <button type='button' title='button' onClick={() => gotoPage(totalPages)} disabled={currentPage === totalPages}>
                {'>>'}
              </button>
              </div>
            }
            
          </div> :
          <div className={styles.notfound}>
            <div>You've not played any games yet, go to <a href='/gaming'>geames</a> to start the fun</div>
          </div>  
          }

      </div>
    </>
  );
}

export default MyGames