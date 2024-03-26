import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import matchstyle from '../styles/match.module.css'
import axios from 'axios';
import dotenv from 'dotenv';
import Image from 'next/image';
import { ethers } from 'ethers';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import FRDAbi from '../../artifacts/contracts/FifaRewardToken.sol/FifaRewardToken.json';
import BettingAbi from '../../artifacts/contracts/FRDBetting.sol/FRDBetting.json';
import footballg from '../assets/images/footballg.jpg';
import footballb from '../assets/images/footaballb.jpg';
import moment from 'moment';
import Loading from './Loading';
import AlertDanger from './AlertDanger';
import BgOverlay from './BgOverlay';
import ActionSuccessModal from './ActionSuccess';
import LoadSampleOpenBetsData from './LoadSampleOpenBets';
import LoginModal from './LoginModal';
import { Fixture } from './FixtureMetadata';
import {  faCaretDown, faCircle,faMagnifyingGlass,faSoccerBall, faTools, faXmark  } from "@fortawesome/free-solid-svg-icons";
import { faCalendarAlt, faFutbol } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
dotenv.config();
// material
// component

// type DateValuePiece = Date | null;

// type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];

const MatchData:React.FC<{}> = () => {
  // types.ts

  interface KeyWordSearch {
    teams: {
      home: {
        name: string,
      },
      away: {
        name: string,
      }
    }
  }


// interface League {
//   leagueId: number;
//   leagueName: string;
//   fixtures: Fixture[];
// }
// interface Country {
//   _id: string;
//   leagues: League[];
// } 

interface CountriesLeagues {
  leagueId: number,
  leagueName: string,
  totalFixtures: number
} 

interface Countries {
  _id: string,
  leagues: CountriesLeagues[],
  totalFixturesInCountry: number
} 

const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);
const [windowloadgetbetruntimes, setwindowloadgetbetruntimes] = useState<number>(0);
const [calendarIcon] = useState<JSX.Element>(<FontAwesomeIcon icon={faCalendarAlt}/>);
const [drpdwnIcon] = useState<JSX.Element>(<FontAwesomeIcon icon={faCaretDown}/>);
const [showcalender, setShowCalendar] = useState<boolean>(false);
const [loadedlaguedata,setLoadedLeagueData] = useState<boolean>(false);
const [countryfixturesdata, setCountryFixturesdata] = useState<any>('');
const [leaguecomponent,setLeagueComponent] = useState<JSX.Element[]>([]);
const [username, setUsername] = useState<string>("");
const [userId, setUserId] = useState<string>("");  
const [isLoggedIn,setIsloggedIn] = useState<boolean>(false);
const [showloginComp,setShowLoginComp] = useState<boolean>(false);
const [betopensuccess,setBetOpenSuccess] = useState<boolean>(false);

const [isparamsLoaded,setIsParamsLoaded] = useState<boolean>(false);
const [ismatchdataLoaded,setIsMatchDataLoaded] = useState<boolean>(false);
const[countryparam,setCountryParam] = useState<string>('');
const[leagueparam,setLeagueParam] = useState<string>('');
const[matchparam,setMatchParam] = useState<string>('');
const[matchidparam,setMatchIdParam] = useState<string>('');
const[matchData,setMatchData] = useState<Fixture>();
const[bettingteam,setBettingTeam] = useState<string>('');
const[betprediction,setBetPrediction] = useState<string>('');
const [betAmount,setBetAmount] = useState<string>('50000');
const [betParticipantsCount,setBetParticipantsCount] = useState<string>('2');
const [showsearchoptions, setShowSearchOptions] = useState<boolean>(false);
const [showloading, setShowLoading] = useState<boolean>(false);
const [showAlertDanger,setShowAlertDanger] = useState<boolean>(false);
const [errorMessage,seterrorMessage] = useState<any>();

const [showBgOverlay,setShowBgOverlay] = useState<boolean>(false);
const [isbetDataLoaded,setIsBetDataLoaded] = useState<boolean>(false);
const [searchkeyword,setSearchKeyWord] = useState<string>('');
const [keywordsearchresults,setKeywordSearchResults] = useState<KeyWordSearch[]>([]);
const router = useRouter();
const FRDAddress = "0x344db0698433Eb0Ca2515d02C7dBAf21be07C295";
const BettingCA = "0xc6258D0E776d9139dbFC847B81E4F9C49F8cFB3B";
const { open, close } = useWeb3Modal();
const { walletProvider } = useWeb3ModalProvider();
const { address, chainId, isConnected } = useWeb3ModalAccount();

  useEffect(() => {
    try {

        const udetails = JSON.parse(localStorage.getItem("userInfo")!);
        if(udetails && udetails !== null && udetails !== "") {
            const username_ = udetails.username;  
            if(username_) {
                setUsername(username_);
                setUserId(udetails.userId);
                setIsloggedIn(true);
            }
        }
        

        if(windowloadgetbetruntimes == 0) {
          const fetchData = async () => {
            try {
              const config = {
                headers: {
                    "Content-type": "application/json"
                }
              }  
              const {data} = await axios.get("http://localhost:9000/api/fixtures/loadfixtures/", config);
              setCountryFixturesdata(data);
              setwindowloadgetbetruntimes(1);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      
          fetchData();
        }else {
      
        }

        async function loadMatchData() {
            if(router.query.match){
                setIsParamsLoaded(true)
                setCountryParam(router.query.match[0]);
                setLeagueParam(router.query.match[1]);
                setMatchParam(router.query.match[2]);
                setMatchIdParam(router.query.match[3])

                const config = {
                    headers: {
                        "Content-type": "application/json"
                    }
                }  
                const {data} = await axios.post("http://localhost:9000/api/fixtures/loadmatch", {
                    matchidparam
                }, config);
                if(data.match !== null) {
                    setIsMatchDataLoaded(true);
                    setMatchData(data.match);
                }
            }
        }loadMatchData();

    }catch(error) 
    {
      console.log(error)
    }

    // let searchOptions = ["Team","Match"];
    // let currentSearchOptionIndex = 0;

    // function rotateSearchOption() {
    //   let searchinput = document.getElementById("search-input") as HTMLElement;
    //   searchinput.setAttribute('placeholder','Search by '+searchOptions[currentSearchOptionIndex]);

    //   currentSearchOptionIndex = (currentSearchOptionIndex + 1) % searchOptions.length;
    // }

    // setInterval(rotateSearchOption,2000);

// setInterval(rotateSearchOption,5000);
const handleClickOutside = (event: MouseEvent) => {
  const inputElement = inputRef.current;
  const divElement = divRef.current;
  // Check if the clicked element is the input or inside the specific div
  if (
    inputElement &&
    !inputElement.contains(event.target as Node) &&
    divElement &&
    !divElement.contains(event.target as Node)
  ) {
    // Close the event associated with the input
    setShowSearchOptions(false)
    console.log('Clicked outside the input and specific div. Close the event!');
  }
};


// Add event listener to the body
document.body.addEventListener('click', handleClickOutside);

return () => {
  // Clean up the event listener when the component is unmounted
  document.body.removeEventListener('click', handleClickOutside);
  // clearInterval(intervalId);
};
  
},[countryfixturesdata,router.query.match,matchidparam,username])

const openBetC = async () => {
  if(walletProvider) {
    try {
        const provider = new ethers.providers.Web3Provider(walletProvider as any)
        const signer = provider.getSigner();
        let rembetparticipantscount = parseInt(betParticipantsCount) - 1;
        let Betcontract = new ethers.Contract(BettingCA, BettingAbi, signer);
        const amt = betAmount + "000000000000000000";
        const tamount = ethers.BigNumber.from(amt);
        let bCOpenBet = await Betcontract.OpenBet(tamount,matchidparam,username,matchparam,betprediction,bettingteam,betParticipantsCount,rembetparticipantscount,{ gasLimit: 1000000 });
        
        bCOpenBet.wait().then(async (receipt:any) => {
          // console.log(receipt);
          if (receipt && receipt.status == 1) {
             // transaction success.
             setShowLoading(false);
             setBetOpenSuccess(true);
          }
       })
      } catch (error) {
        setShowAlertDanger(true);
        seterrorMessage(error)
        setShowLoading(false);
      }
  }
}

const Approve = async (e:any) => {
  try {
    e.parentElement.parentElement.parentElement.style.display = 'none';
    if(walletProvider) {
        setShowLoading(true);
        const provider = new ethers.providers.Web3Provider(walletProvider as any);
        const signer = provider.getSigner();
        const FRDContract = new ethers.Contract(FRDAddress, FRDAbi, signer);
        const amt = betAmount + "000000000000000000";
        const tamount = ethers.BigNumber.from(amt);
        const reslt = await FRDContract.approve(BettingCA,tamount);
        
        if(reslt) {
          openBetC();
        }
    }
  } catch (error:any) {
    seterrorMessage("Connect Wallet First");
  }
}

const handleOpenBetForm = async (e:any) => {
    try {
        setShowLoading(true);
        if(username && username !== null && username !== undefined && username !== '') {
            if(!isConnected) {
              open()
            }else {
              try {
                
                const provider = new ethers.providers.Web3Provider(walletProvider as any);
                const signer = provider.getSigner();
    
                console.log('signer address',signer,signer.getAddress(),signer._address,address)
                /* next, create the item */
                let FRDcontract = new ethers.Contract(FRDAddress, FRDAbi, signer);
                
                // const tamount = ethers.BigNumber.from("5000000000000000000000000");
                // let fundwalletaddress = FRDcontract.transfer("0x6df7E51F284963b33CF7dAe442E5719da69c312d",tamount);
                // console.log("fundwalletaddress result",fundwalletaddress);
                // return;
                let transaction = await FRDcontract.balanceOf(address);
                
                let frdBal = ethers.utils.formatEther(transaction);
                let inputAlertDiv = document.getElementById("minamuntalert") as HTMLElement;
                let selectAlertDiv = document.getElementById("partpntsalert") as HTMLElement;
                if(betAmount && (parseInt(betAmount) < 50000)) {
                    inputAlertDiv.innerHTML = "You can't bet below 50,000FRD";
                    return;
                }
                if(betprediction && betprediction !== '' && betprediction !== null && betprediction !== undefined) {
                  selectAlertDiv.innerHTML = "";    
                }else {
                    selectAlertDiv.innerHTML = "Select prediction first";
                    return;
                }

                if(bettingteam && bettingteam !== '' && bettingteam !== null && bettingteam !== undefined) {
                  selectAlertDiv.innerHTML = "";
                }else {
                  selectAlertDiv.innerHTML = "Select team first";
                    return;
                }
                console.log("frdBal gg",parseInt(frdBal));
                console.log("betAmount gg",parseInt(betAmount));
                if(parseInt(frdBal) < parseInt(betAmount)) {
                  setShowAlertDanger(true);
                  seterrorMessage(`You need a minimum of ${betAmount}FRD to proceed!`)
                  setShowLoading(false);
                }else {
                  Approve(e);
                }
                
              } catch (error) {
                setShowAlertDanger(true);
                seterrorMessage(`transaction cancelled /${error}`);
                setShowLoading(false)
              }
            }
        }else {
            setShowBgOverlay(true);
            setShowLoginComp(true);
            e.parentElement.parentElement.parentElement.style.display = 'none';
            console.log('showlogincomp',showloginComp)
        }

        
    } catch (error) {
      console.log(error)
    }
}
  
const showloginCompNow = () => {
    // let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
    // hiw_bgoverlay.style.display = 'block';
    setShowBgOverlay(true);
    setShowLoginComp(true);
}

const closeLoginModal = () => {
    // let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
    // hiw_bgoverlay.style.display = 'none';
    setShowBgOverlay(false);
    setShowLoginComp(false);
}

const closeAlertModal = () => {
  setShowAlertDanger(false);
  // setShowBgOverlay(false)
}

const closeActionModalComp = () => {
    // let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
    // hiw_bgoverlay.style.display = 'none';
    setShowBgOverlay(true);
    setBetOpenSuccess(false);
    router.push('openbetslists');
}

const toggleFixtures = (divId:any) => {
  
  let svg = divId.getAttribute('data-icon');
  let path = divId.getAttribute('fill');
  if((svg !== null && svg !== undefined) || (path !== null && path !== undefined)) {
    if(svg !== null && svg !== undefined) {
      let targetDiv = divId.parentElement.parentElement.parentElement.nextElementSibling;
      targetDiv.style.display = (targetDiv.style.display === 'none') ? 'block' : 'none';
    }
    if(path !== null && path !== undefined) {
      let targetDiv = divId.parentElement.parentElement.parentElement.parentElement.nextElementSibling;
      targetDiv.style.display = (targetDiv.style.display === 'none') ? 'block' : 'none';
    }
  }else {
    let targetDiv = divId.parentElement.parentElement.nextElementSibling;
    targetDiv.style.display = (targetDiv.style.display === 'none') ? 'block' : 'none';
  }
  

}

const closeLeagueFixtures = (divId:any) => {
  console.log('huo',divId);
  let svg = divId.getAttribute('data-icon');
  let path = divId.getAttribute('fill');
  if(svg !== null && svg !== undefined) {
    divId.parentElement.parentElement.parentElement.remove();
  }
  if(path !== null && path !== undefined) {
    divId.parentElement.parentElement.parentElement.parentElement.remove()
  }
}

const closeHIWDiv = (divId:any) => {
  console.log('huo',divId);
  console.log('huo pareant',divId.parentElement.parentElement);
  let svg = divId.getAttribute('data-icon');
  let path = divId.getAttribute('fill');
  if(svg !== null && svg !== undefined) {
    divId.parentElement.parentElement.style.display = 'none';
  }
  if(path !== null && path !== undefined) {
    divId.parentElement.parentElement.parentElement.style.display = 'none';
  }
}

const closeHIWE = (divId:any) => {
  let svg = divId.getAttribute('data-icon');
  let path = divId.getAttribute('fill');
  let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
  hiw_bgoverlay.style.display = (hiw_bgoverlay.style.display === 'block') ? 'none' : 'block';
  if(svg !== null && svg !== undefined) {
    divId.parentElement.parentElement.parentElement.style.display = 'none';
  }
  if(path !== null && path !== undefined) {
    divId.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
  }
}

const firstopenHIW = (divId:any) => {
  let svg = divId.getAttribute('data-icon');
  let path = divId.getAttribute('fill');
  console.log('t div firr oo parent',divId.parentElement.parentElement)
  console.log('t div',divId.parentElement.parentElement.firstElementChild)
  if((svg !== null && svg !== undefined) || (path !== null && path !== undefined)) {
    if(svg !== null && svg !== undefined) {
      let targetDiv = divId.parentElement.parentElement.parentElement.firstElementChild;
      targetDiv.style.display = (targetDiv.style.display === 'block') ? 'none' : 'block';
    }
    if(path !== null && path !== undefined) {
      let targetDiv = divId.parentElement.parentElement.parentElement.parentElement.firstElementChild;
      targetDiv.style.display = (targetDiv.style.display === 'block') ? 'none' : 'block';
    }
  }else {
    let targetDiv = divId.parentElement.parentElement.firstElementChild;
    targetDiv.style.display = (targetDiv.style.display === 'block') ? 'none' : 'block';
  }
}

const openHIWE = (divId:any) => {
  let hiwdiv = document.querySelector('#howitworks') as HTMLElement;
  // let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
  // console.log('hiw div',hiwdiv)
  // console.log('hiw overlay',hiw_bgoverlay)
  hiwdiv.style.display = (hiwdiv.style.display === 'block') ? 'none' : 'block';
  // hiw_bgoverlay.style.display = (hiw_bgoverlay.style.display === 'block') ? 'none' : 'block';
  setShowBgOverlay(!BgOverlay);
  let svg = divId.getAttribute('data-icon');
  let path = divId.getAttribute('fill');

  if((svg !== null && svg !== undefined) || (path !== null && path !== undefined)) {
    if(svg !== null && svg !== undefined) {
      let targetDiv = divId.parentElement.parentElement.parentElement.parentElement;
      targetDiv.style.display = (targetDiv.style.display === 'block') ? 'none' : 'block';
    }
    if(path !== null && path !== undefined) {
      let targetDiv = divId.parentElement.parentElement.parentElement.parentElement.parentElement;
      targetDiv.style.display = (targetDiv.style.display === 'block') ? 'none' : 'block';
    }
  }else {
    let targetDiv = divId.parentElement.parentElement.parentElement;
    targetDiv.style.display = (targetDiv.style.display === 'block') ? 'none' : 'block';
  }
}

const placeBet = (divId:any) => {

  // let bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;

  let svg = divId.getAttribute('data-icon');
  let path = divId.getAttribute('fill');
  if((svg !== null && svg !== undefined) || (path !== null && path !== undefined)) {
    if(svg !== null && svg !== undefined) {
      let targetDiv = divId.parentElement.parentElement.parentElement.parentElement.nextElementSibling;
      let targetDivP = divId.parentElement.parentElement.parentElement.parentElement;
      // bgoverlay.style.display = 'block';
      setShowBgOverlay(true);
      targetDivP.style.display = 'none';
      targetDiv.style.display = (targetDiv.style.display === 'block') ? 'none' : 'block';
    }
    if(path !== null && path !== undefined) {
      let targetDiv = divId.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling;
      let targetDivP = divId.parentElement.parentElement.parentElement.parentElement.parentElement;
      // bgoverlay.style.display = 'block';
      setShowBgOverlay(true);
      targetDivP.style.display = 'none';
      targetDiv.style.display = (targetDiv.style.display === 'block') ? 'none' : 'block';
    }
  }else {
    let targetDiv = divId.parentElement.parentElement.parentElement.nextElementSibling;
    let targetDivP = divId.parentElement.parentElement.parentElement;
    // bgoverlay.style.display = 'block';
    setShowBgOverlay(true);
    targetDivP.style.display = 'none';
    targetDiv.style.display = (targetDiv.style.display === 'block') ? 'none' : 'block';
  }
}

const closePBET = (divId:any) => {
  let svg = divId.getAttribute('data-icon');
  let path = divId.getAttribute('fill');
  
  // let bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;

  if(svg !== null && svg !== undefined) {
    // bgoverlay.style.display = 'none';
    divId.parentElement.parentElement.style.display = 'none';
  }
  if(path !== null && path !== undefined) {
    // bgoverlay.style.display = 'none';
    divId.parentElement.parentElement.parentElement.style.display = 'none';
  }
}

const setBetPredictn = (prediction:any) => {
  setBetPrediction(prediction);
} 

const setBetteam = (team:any) => {
  setBettingTeam(team)
} 

const setLoadOpenBetsDataStatus = () => {
  setIsBetDataLoaded(true)
}

const goBack = () => {
  router.back()
}
// Import your JSON data here
const countryfixturescount: Countries[] = countryfixturesdata.fixtures;

const getKeyWordSearch = () => {
  setShowSearchOptions(true)
}

const UpKeyWordSearch = (divId: any) => {
  setSearchKeyWord(divId.innerHTML);
  setShowSearchOptions(false)
}

const handleInputClick = () => {
  // Handle the event when the input is clicked
  setShowSearchOptions(true);
  console.log('Input clicked. Do something!');
};

const getKeyWordSearchN = async (keyword:any) => {
  // search database and return documents with similar keywords
  setSearchKeyWord(keyword)
  const config = {
      headers: {
          "Content-type": "application/json"
      }
  }  
  const {data} = await axios.post("http://localhost:9000/api/fixtures/searchmatchbykeyword", {
      searchkeyword
  }, config);
  if(data) {
    setShowSearchOptions(true);
    setKeywordSearchResults(data.keywordResult);
    console.log('keyword search results',data.keywordResult);
  }
  
}

const loadSearchResults = async () => {
  try {
    
    let teams = searchkeyword.split('vs');
    const hometeam = teams[0].trimEnd();
    const awayteam = teams[1].trimStart();
    console.log('hometeam',hometeam,'vs','awayteam',awayteam)
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }  
    const {data} = await axios.post("http://localhost:9000/api/fixtures/loadmatchsearchresult", {
        hometeam,
        awayteam
    }, config);
    if(data.match !== null) {
        setIsMatchDataLoaded(true);
        setMatchData(data.match);
    }
    
  } catch (error) {
    console.log(error)
  }
}

  return (
    <>
      <div className={matchstyle.main}>
      {showBgOverlay && <BgOverlay />}
      {showloading && <Loading/>}
      <div className={matchstyle.search} >
            <div>
              <form>
                  <input type='text' title='input' id="search-input" value={searchkeyword} onClick={handleInputClick} ref={inputRef} onChange={(e) => getKeyWordSearchN(e.target.value)} placeholder='Search by'/><div className={matchstyle.searchicon}><FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => loadSearchResults()}/></div>
                  {showsearchoptions && 
                    <div className={matchstyle.searchop} ref={divRef} >
                      {keywordsearchresults?.map((result,index) => (
                      <div className={matchstyle.ft2} onClick={(e) => UpKeyWordSearch(e.target)} key={index}>
                        {result.teams.home.name + ' vs ' + result.teams.away.name}
                      </div>
                      ))}
                    </div>
                  } 
              </form>
            </div>
          </div>
        <div className={matchstyle.headbg}>
          <Image src={footballb} alt='banner' style={{width: '100%',height: '120px'}}/>
        </div>
        {isparamsLoaded && <div className={matchstyle.breadcrum}>
          <button type='button' title='button' onClick={goBack}> {'<< '} back</button> <a href='/'>home</a> {'>'} <a href='/betting'>betting</a> {'>'} <a href={`../../../${countryparam}/${leagueparam}/${matchparam}/${matchidparam}`}>{countryparam.replace(/-/g, ' ')} {'>'} {leagueparam.replace(/-/g, ' ')} {'>'} {matchparam.replace(/-/g, ' ')}</a>
        </div> }

        {showloginComp && 
            <div>
                <LoginModal prop={'Open Bet'} onChange={closeLoginModal}/>
            </div>
        }
        {showAlertDanger && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
        {betopensuccess && 
            <ActionSuccessModal prop='Bet' onChange={closeActionModalComp}/>
        }
        
        {/* how it works div starts */}
        <div id='howitworks' className={matchstyle.hiwmain}>
          <div className={matchstyle.hiw_c}>
            <div className={matchstyle.hiw_x} onClick={(e) => closeHIWE(e.target)}>{<FontAwesomeIcon icon={faXmark} />}</div>
            <h3>How It Works</h3>
            <ul>
              <li>
                <FontAwesomeIcon icon={faCircle} className={matchstyle.hiwlistcircle} /> Sign up with Fifa Rewards using this link <a href='../../../../register'>Join Fifa Reward</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={matchstyle.hiwlistcircle} />  Fund your wallet with FRD or USDT
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={matchstyle.hiwlistcircle} />  Visit the betting page
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={matchstyle.hiwlistcircle} />  Search and choose a game/fixture of your choice
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={matchstyle.hiwlistcircle} />  Click on Open Bets, and open a bet
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={matchstyle.hiwlistcircle} />  Your opened bet will be listed in open bets page <a href='../../../../betting/openbetslists'>open bets</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={matchstyle.hiwlistcircle} />  Look for a bet partner/partners (min. of 2, max. of 6) who will close your bet
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={matchstyle.hiwlistcircle} /> Bet closed after the match, winners (must be a win) get funded according to their bets 
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={matchstyle.hiwlistcircle} /> Draw bets are carried over to a next match
              </li>
            </ul>
          </div>
        </div>
        {/* how it works div starts */}

        <div className={matchstyle.main_in}>
          <div className={matchstyle.betmain}>
              <div className={matchstyle.betwrap}>
                  <div className={matchstyle.betwrapin} id='betwrapin'>
                  {ismatchdataLoaded &&
                    <div>
                        <div className={matchstyle.league_wrap}>
                          <div className={matchstyle.tgle} >
                            <div onClick={(e) => toggleFixtures(e.target)}><h3>{matchData?.league.name}</h3></div>
                            <div className={matchstyle.drpdwn} onClick={(e) => toggleFixtures(e.target)}>{<FontAwesomeIcon icon={faCaretDown}/>}</div>
                            <div className={matchstyle.closeicon} onClick={(e) => closeLeagueFixtures(e.target)}>{<FontAwesomeIcon icon={faXmark}/>}</div>
                          </div>
                          <div className={matchstyle.league_wrap_in} >
                            <div className={matchstyle.fixt}>
                                <div className={matchstyle.fixt_d_o}>
                                    <div className={matchstyle.fixt_d}>
                                    <span>Date</span> {`${moment(matchData?.fixture.date).format('DD/MM ddd')}`}
                                    </div>
                                    <div className={matchstyle.dd}>
                                        <div><span>Time</span>{`${moment(matchData?.fixture.timestamp).format('hh:mm a')}`}</div>
                                        <div className={matchstyle.fid}>ID: {matchData?.fixture.id}</div>
                                    </div>
                                </div>

                                <div className={matchstyle.fixt_tm}>
                                    <div className={matchstyle.teams}>
                                    <div>{`${matchData?.teams.home.name}`}</div>
                                    <div className={matchstyle.vs}>Vs</div>
                                    <div>{`${matchData?.teams.away.name}`}</div>
                                    </div>
                                </div>
                                <div className={matchstyle.openbet}>
                                    <div className={matchstyle.opb_btns_div}>
                                        <div className={matchstyle.bt_close} onClick={(e) => closeHIWDiv(e.target)}>{<FontAwesomeIcon icon={faXmark}/>}</div>
                                        <div className={matchstyle.opb_btns}>
                                            <div className={matchstyle.opb_open} onClick={(e) => placeBet(e.target)}><button type='button' title='button'>Open Bet {<FontAwesomeIcon icon={faFutbol}/>}</button></div>
                                            <div className={matchstyle.opb_hiw} onClick={(e) => openHIWE(e.target)}><button type='button' title='button'>How It Works {<FontAwesomeIcon icon={faTools} />}</button></div>
                                        </div>
                                    </div>

                                    <div className={matchstyle.pbet}>
                                    <div className={matchstyle.pbet_x} >{<FontAwesomeIcon icon={faXmark} onClick={(e) => closePBET(e.target)}/>}</div>
                                    <form>
                                        <h3>Open Bet</h3>
                                        <div>
                                          <p>Open bet by selecting the appropriate details</p>
                                        </div>
                                        <div className={matchstyle.form_g}>
                                        <ul>
                                            <li>
                                            <div>
                                                <div>
                                                    Match Id :
                                                </div>
                                                <div className={matchstyle.fixid}>
                                                    {matchData?.fixture.id}
                                                </div>
                                            </div>
                                            </li>
                                        </ul>
                                        </div>
                                        <div className={matchstyle.form_g}>
                                        <ul>
                                            <li>
                                            <div>
                                                <div>
                                                    Match :
                                                </div>
                                                <div className={matchstyle.matchd}>
                                                    <div>{matchData?.teams.home.name}</div>
                                                    <div className={matchstyle.vs}>Vs</div>
                                                    <div>{matchData?.teams.away.name}</div>
                                                </div>
                                            </div>
                                            </li>
                                        </ul>
                                        </div>
                                        <div className={matchstyle.form_g}>
                                            <label>Which team are you betting on?</label>
                                            <div>
                                                <select title='select' required onChange={(e) => setBetteam(e.target.value)}>
                                                    <option value={matchData?.teams.home.name}>{matchData?.teams.home.name}</option>
                                                    <option value={matchData?.teams.away.name}>{matchData?.teams.away.name}</option>
                                                </select>
                                            </div>
                                            <small id='teamalert'></small>
                                        </div>
                                        <div className={matchstyle.form_g}>
                                            <label>Select Prediction</label>
                                            <div>
                                                <select title='select' required onChange={(e) => setBetPredictn(e.target.value)}>
                                                    <option value='Win'>Win</option>
                                                    <option value='Lose'>Lose</option>
                                                </select>
                                            </div>
                                            <small id='predictionalert'></small>
                                        </div>
                                        <div className={matchstyle.form_g}>
                                            <label>Enter amount (10000FRD)</label>
                                            <input type='number' title='input' required onChange={(e) => setBetAmount(e.target.value)} min={5} placeholder={'50000 FRD'} />
                                            <small id='minamuntalert'></small>
                                        </div>
                                        <div className={matchstyle.form_g}>
                                            <label>Select number of betting participants</label>
                                            <div>
                                                <select title='select' required onChange={(e) => setBetParticipantsCount(e.target.value)}>
                                                    <option value='2'>2 Participants</option>
                                                    <option value='4'>4 Participants</option>
                                                    <option value='6'>6 Participants</option>
                                                    <option value='8'>8 Participants</option>
                                                    <option value='10'>10 Participants</option>
                                                </select>
                                            </div>
                                            <small id='partpntsalert'></small>
                                        </div>
                                        <div className={matchstyle.form_g}>
                                            <button type='button' onClick={(e) => handleOpenBetForm(e.target)} title='button'>Open Bet Now</button>
                                        </div>
                                    </form>
                                    </div>

                                    <div>
                                    <button type='button' title='buttn' onClick={(e) => firstopenHIW(e.target)}>Open Bet <FontAwesomeIcon icon={faSoccerBall} /> </button>
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  }
                  {loadedlaguedata &&
                    <div>
                      {leaguecomponent.map(component => component)}
                    </div> 
                  }
                  </div>
              </div>
          </div>
          <div className={matchstyle.openbets_list}>
            <div className={matchstyle.opb_h}>
                {!isLoggedIn &&
                    <div className={matchstyle.opb_login} id="opb_login">
                        <h3>Login To Open Bet</h3>
                        <div className={matchstyle.opblogin_btns}>
                            <div>
                                <button type='button' title='button' onClick={showloginCompNow}>Login </button>
                            </div>
                            <div>
                                <a href='/register' title='link'>Register </a>
                            </div>
                        </div>
                    </div>
                }
              
              <div className={matchstyle.opb}>
                {/* {isbetDataLoaded ? */}
                <div>
                  <h3>Open Bets</h3>
                  {<LoadSampleOpenBetsData onMount={setLoadOpenBetsDataStatus}/>}
                </div> 
                {/* <div><Loading /></div>
                } */}
                <div className={matchstyle.opb_full_list}><a href='../../../openbetslists'>See All Open Bets ...</a></div>
                <div className={matchstyle.opb_banner}>
                  <Image src={footballg} alt='banner' style={{width: '100%',height: '320px'}}/>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MatchData
