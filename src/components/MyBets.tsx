import React, { useState,useEffect, useRef, useContext } from 'react';
import Loading from './Loading';
import BgOverlay from './BgOverlay';
import ActionSuccessModal from './ActionSuccess';
import { useUser } from '../contexts/UserContext';
import AlertDanger from './AlertDanger';
import { useRouter } from 'next/router';
import BettingAbi from '../../artifacts/contracts/FRDBetting.sol/FRDBetting.json';
import BettingFeaturesAbi from '../../artifacts/contracts/FRDBettingFeatures.sol/FRDBettingFeatures.json';
import { ethers } from 'ethers';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { Bets } from './BetsMetadata';
import axios from 'axios';
import { BetConditions } from './BetConditionsMetadata';
import Head from 'next/head';
// material
import styles from "../styles/mybets.module.css";
import dotenv from 'dotenv';
import { time } from 'console';
dotenv.config();
// component
const MyBets: React.FC<{}> = () =>  {

    // const divRef = useRef<HTMLDivElement>(null);
    const { connectedaddress } = useUser();
    const [showloading, setShowLoading] = useState<boolean>(false);
    const { open } = useWeb3Modal();
    const { walletProvider } = useWeb3ModalProvider();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit] = useState<number>(10)
    const [usdequivfrdamount, setUsdEquivFrdAmount] = useState<number>(0);
    const [frdusdprice, setFrdUsdPrice] = useState<any>();
    const [totalPages, setTotalPages] = useState(0);
    const [betconditions,setBetConditions] = useState<BetConditions[]>([]);
    const [betData,setBetData] = useState<Bets[]>([]);
    const [showAlertDanger,setShowAlertDanger] = useState<boolean>(false);
    const [errorMessage,seterrorMessage] = useState<string>("");
    const [showbetconditions, setShowBetConditions] = useState<boolean>(false);
    const [showBgOverlay,setShowBgOverlay] = useState<boolean>(false);
    const [nftactionsuccess,setActionSuccess] = useState<boolean>(false);

    
    const BettingCA = process.env.NEXT_PUBLIC_FRD_BETTING_CA;
    const BettingFeaturesCA = process.env.NEXT_PUBLIC_FRD_BETTING_FEATURES_CA;

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
              console.log("signer",signer)
              const BetFeaturescontract = new ethers.Contract(BettingFeaturesCA!, BettingFeaturesAbi, signer);
              const loadBets = await BetFeaturescontract.getBetsByWallet(connectedaddress);
              await loadBets.forEach(async (element:any) => {
                if(element.openedBy != 0x0000000000000000000000000000000000000000) {
                  let betAmt = Math.ceil((element.betamount.toString())/(10**18));
                  
                  let item: Bets = {
                    betId: element.betId,
                    matchId: element.matchId,
                    uniquebetId: element.uniquebetId,
                    betamount: betAmt,
                    matchfixture: element.matchfixture,
                    openedBy: element.openedBy,
                    totalbetparticipantscount: element.totalbetparticipantscount,
                    remainingparticipantscount: element.remainingparticipantscount,
                    betstatus: element.betstatus,
                    participants: element.participants,
                    betwinners: element.betwinners,
                    betlosers: element.betlosers,
                  }
                  // Prevent duplicate entries based on betId
                  setBetData(prevBetData => {
                    if (!prevBetData.some(existingItem => existingItem.betId.toString() === item.betId.toString())) {
                        return [...prevBetData, item];
                    }
                    return prevBetData;
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

    },[connectedaddress])
    
    const toggleAddress = (e:any) => {
      let fulladdress = e.previousElementSibling as HTMLSpanElement;
      fulladdress.style.display = (fulladdress.style.display === 'block') ? 'none' : 'block';
    }

    const viewBetDetails = async(e:any,betId:number) => {
      
      if(walletProvider) {
        
        try {
          setShowLoading(true);
          setShowBgOverlay(true);
          const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
          const signer = provider.getSigner();
          const Betcontract = new ethers.Contract(BettingCA!, BettingAbi, signer);
              
            const getbetpredictions = await Betcontract.getPredictions(betId);
            setBetConditions(getbetpredictions);
            setShowBetConditions(true);
            setShowBgOverlay(true);
            setShowLoading(false);
        } catch (error: any) {
          setShowAlertDanger(true);
          seterrorMessage(error);
          setShowLoading(false);
        }
        
      }
    }
    
    const goBack = () => {
        router.back()
    }
    
    const closePBET = (divId:any) => {
      let svg = divId.getAttribute('data-icon');
      let path = divId.getAttribute('fill');
      
      // let bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
    
      if(svg !== null && svg !== undefined) {
        setShowBgOverlay(false);
        divId.parentElement.parentElement.style.display = 'none';
      }
      if(path !== null && path !== undefined) {
        setShowBgOverlay(false);
        divId.parentElement.parentElement.parentElement.style.display = 'none';
      }
    }
    
    const Cancel = (e:any) => {
      console.log(e)
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
        <title> My Bets | Fifareward</title>
        <meta name='description' content='Fifareward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
    </Head>
    {showloading && <Loading/>}
    {showBgOverlay && <BgOverlay onChange={closeBgModal}/>}
    {showAlertDanger && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
    {nftactionsuccess && 
        <ActionSuccessModal prop='Bets ' onChange={closeActionModalComp}/>
    }
     
      <div className={`${styles.main}`}>
        <div className={styles.goback}>
          <button type='button' title='button' onClick={goBack} style={{color: 'white'}}> {'< '} back</button> 
        </div>
        <div className={styles.main_bg_overlay}></div>
          <div>
            <div style={{marginBottom: '30px'}}>
              <h1>MY Bets</h1>
            </div>
          </div>
          {/* banner header */}
          
          {betData && betData.length > 0 ? 
            <div className={styles.openbetmain}>
            <div className={styles.table_c}>
              <table>
                <thead>
                  <tr>
                    {/* <th>S/N</th> */}
                    <th>S/N Id</th>
                    <th>Id</th>
                    <th>Match Id</th>
                    <th>Bet Amount</th>
                    <th>Opened BY</th>
                    <th>Max. Participants</th>
                    <th>Participants Joined Count</th>
                    <th>Participants Joined</th>
                    <th>Remaining Participants</th>
                    <th>Status</th>
                    <th>Join Bet</th>
                  </tr>
                </thead>
                <tbody>
                  {betData.map((openbet, index) => (
                    <tr key={index}>
                      {/* <td><div className={styles.div}>{index+1}</div></td> */}
                      <td><div className={styles.div}>{index+1}</div></td>
                      <td><div className={styles.div}>{openbet.uniquebetId.toString()}</div></td>
                      <td><div className={styles.div}>{openbet.matchId.toString()}</div></td>
                      <td><div className={styles.div}>{(openbet.betamount.toLocaleString())}{<span className={styles.amtunit}>FRD</span>} ({`$${Math.ceil(openbet.betamount * frdusdprice)}`})</div></td>
                      <td><div className={styles.divaddress}><span>{openbet.openedBy.substring(0,8)+'...'}</span><span className={styles.fulladdr}>{openbet.openedBy}</span><button type='button' onClick={(e) => toggleAddress(e.target)}>View</button></div></td>
                      <td><div className={styles.div}>{openbet.totalbetparticipantscount.toString()}</div></td>
                      <td><div className={styles.div}>{(openbet.totalbetparticipantscount.toNumber()) - (openbet.remainingparticipantscount.toNumber())}</div></td>
                      <td><div className={styles.div}>({openbet.participants}) <div className={styles.bdet}><button type='button' title='button' onClick={(e) => viewBetDetails(e.target,openbet.betId.toNumber())} style={{cursor: 'pointer'}}> view bet details </button></div></div></td>
                      <td><div className={styles.div}>{openbet.remainingparticipantscount.toString()}</div></td>
                      <td className={styles.stat}><div className={styles.div}>{openbet.betstatus == 'open' ? <span className={styles.betstatusopened}>{openbet.betstatus}</span> : <span className={styles.betstatusclosed}>{openbet.betstatus}</span>}</div></td>
                      {openbet.betstatus === 'open' 
                      ? 
                      <td className={styles.jb}><div className={styles.div}><button className={styles.closed} type='button' title='button' disabled >Print Slip</button></div></td>
                      : 
                      <td className={styles.jb}><div className={styles.div}><button className={styles.closed} type='button' title='button' disabled >Print Slip</button></div></td>}
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {betData.length > 10 &&
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
            <div>You've not created any bets</div>
          </div>  
          }

      </div>
    </>
  );
}

export default MyBets