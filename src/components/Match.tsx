import React, { useEffect, useState, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import matchstyle from '../styles/match.module.css'
import axios from 'axios';
import Image from 'next/image';
import { useUser } from '../contexts/UserContext';
import { ethers } from 'ethers';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import FRDAbi from '../../artifacts/contracts/FifaRewardToken.sol/FifaRewardToken.json';
import BettingAbi from '../../artifacts/contracts/FRDBetting.sol/FRDBetting.json';
import footballg from '../assets/images/footballg.jpg';
import footballb from '../assets/images/footaballb.jpg';
import SportsWidget from './SportsWidget';
// import '../../api-sports-widgets';
// import pitch from '../assets/images/pitch.jpeg'
import moment from 'moment';
import Loading from './Loading';
import AlertDanger from './AlertDanger';
import BgOverlay from './BgOverlay';
import ActionSuccessModal from './ActionSuccess';
import LoadOpenBetsData from './LoadOpenBets';
import Head from 'next/head';
import { Fixture } from './FixtureMetadata';
import { Team } from './FixtureStatisticMetadata';
import { Events } from './FixtureEventsMetadata';
import { Lineups } from './FixtureLineUpMetadata';
import { FaCaretDown, FaCircle, FaMagnifyingGlass, FaXmark } from 'react-icons/fa6';
import { GiToolbox } from 'react-icons/gi';
import { IoIosFootball } from 'react-icons/io';

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
const [loadedlaguedata,setLoadedLeagueData] = useState<boolean>(false);
const [countryfixturesdata, setCountryFixturesdata] = useState<any>('');
const [leaguecomponent,setLeagueComponent] = useState<JSX.Element[]>([]);
const { connectedaddress } = useUser();
const [username, setUsername] = useState<string>("");
const [isLoggedIn,setIsloggedIn] = useState<boolean>(false);
const [betopensuccess,setBetOpenSuccess] = useState<boolean>(false);
const [dollarequiv, setDollarEquiv] = useState<number>(0);
const [usdprice, setUsdPrice] = useState<any>();
const [usdequivfrdamount, setUsdEquivFrdAmount] = useState<number>(0);
const [isparamsLoaded,setIsParamsLoaded] = useState<boolean>(false);
const [ismatchdataLoaded,setIsMatchDataLoaded] = useState<boolean>(false);
const [countryparam,setCountryParam] = useState<string>('');
const [leagueparam,setLeagueParam] = useState<string>('');
const [matchparam,setMatchParam] = useState<string>('');
const [matchidparam,setMatchIdParam] = useState<string>('');
const [matchData,setMatchData] = useState<Fixture>();
const [fixtureh2hdataLoaded,setFixtureH2HDataLoaded] = useState<boolean>(false);
const [fixtureh2hData,setFixtureH2HData] = useState<Fixture[]>([]);
const [fixturestatisticsdataloaded,setFixtureStatisticsDataLoaded] = useState<boolean>(false);
const [fixturestatisticsData,setFixtureStatisticsData] = useState<Team[]>([]);
const [fixtureeventsdataloaded,setFixtureEventsDataLoaded] = useState<boolean>(false);
const [fixtureeventsData,setFixtureEventsData] = useState<Events[]>([]);
const [fixturelineupsdataloaded,setFixtureLineupsDataLoaded] = useState<boolean>(false);
const [fixturelineupsData,setFixtureLineupsData] = useState<Lineups[]>([]);
const [bettingteam,setBettingTeam] = useState<string>('');
const [betprediction,setBetPrediction] = useState<string>('');
const [betAmount,setBetAmount] = useState<number>(0);
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
const FRDCA = process.env.NEXT_PUBLIC_FRD_DEPLOYED_CA;
const BettingCA = process.env.NEXT_PUBLIC_FRD_BETTING_CA;
const BettingFeaturesCA = process.env.NEXT_PUBLIC_FRD_BETTING_CA;
const { open, close } = useWeb3Modal();
const { walletProvider } = useWeb3ModalProvider();

  useEffect(() => {
    try {

        const udetails = JSON.parse(localStorage.getItem("userInfo")!);
        if(udetails && udetails !== null && udetails !== "") {
            const username_ = udetails.username;  
            if(username_) {
                setUsername(username_);
            }
        }else {
          open()
        }

        
        const getUSDEQUIVFRDAMOUNT =  async () => {
          try {
            const config = {
              headers: {
                  "Content-type": "application/json"
              }
            }  
            const {data} = await axios.get("../../../../api/gettokenprice", config);
            setUsdEquivFrdAmount(data.usdequivalentfrdamount);
            setUsdPrice(data.usdprice);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
        getUSDEQUIVFRDAMOUNT();
        
        const fetchData = async () => {
          try {
            const config = {
              headers: {
                  "Content-type": "application/json"
              }
            }  
            const {data} = await axios.get("https://fifarewardbackend-1.onrender.com/api/fixtures/loadfixtures/", config);
            setCountryFixturesdata(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
        

        const fixtureLineups = async (fixtureid: number) => {
          try {
            const config = {
              headers: {
                  "Content-type": "application/json",
                  "x-rapidapi-host": "v3.football.api-sports.io",
                  "x-rapidapi-key": "aa2a3bb1320411e0c7ad474b053c6514"
              }
            }
            const { data } = await axios.get(`https://v3.football.api-sports.io/fixtures/lineups?fixture=${fixtureid}`, config)
            console.log(" fixture  lineups ",data.response)
            if(data.response.length > 0) {
              setFixtureLineupsDataLoaded(true);
              setFixtureLineupsData(data.response);
            }
          } catch (error) {
            
          }
        }

        const fixtureEvents = async (fixtureid: number) => {
          try {
            const config = {
              headers: {
                  "Content-type": "application/json",
                  "x-rapidapi-host": "v3.football.api-sports.io",
                  "x-rapidapi-key": "aa2a3bb1320411e0c7ad474b053c6514"
              }
            }
            const { data } = await axios.get(`https://v3.football.api-sports.io/fixtures/events?fixture=${fixtureid}`, config)
            console.log(" fixture  events ",data.response)
            if(data.response.length > 0) {
              setFixtureEventsDataLoaded(true);
              setFixtureEventsData(data.response);
            }
    
          } catch (error) {
            
          }
        }

        const fixtureStatistics = async (fixtureid: number) => {
          try {
            const config = {
              headers: {
                  "Content-type": "application/json",
                  "x-rapidapi-host": "v3.football.api-sports.io",
                  "x-rapidapi-key": "aa2a3bb1320411e0c7ad474b053c6514"
              }
            }
            const { data } = await axios.get(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${fixtureid}`, config)
            console.log(" fixture  statistics ",data.response)
            if(data.response.length > 0) {
              setFixtureStatisticsDataLoaded(true);
              setFixtureStatisticsData(data.response);
            }
    
          } catch (error) {
            
          }
        }

        const head2head = async (hometeamid: number,awayteamid: number) => {
          try {
            const config = {
              headers: {
                  "Content-type": "application/json",
                  "x-rapidapi-host": "v3.football.api-sports.io",
                  "x-rapidapi-key": "aa2a3bb1320411e0c7ad474b053c6514"
              }
            } 

            const {data} = await axios.get(`https://v3.football.api-sports.io/fixtures/headtohead?h2h=${hometeamid}-${awayteamid}`, config)
            
            if(data.response.length > 0) {
                setFixtureH2HDataLoaded(true);
                setFixtureH2HData(data.response);
            }
            
          } catch (error) {
            
          }
          
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
                const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/fixtures/loadmatch", {
                    matchidparam
                }, config);
                if(data.match !== null) {
                    setIsMatchDataLoaded(true);
                    setMatchData(data.match);

                    head2head(data.match.teams.home.id,data.match.teams.away.id);
                    fixtureEvents(data.match.fixture.id);
                    fixtureLineups(data.match.fixture.id);
                    fixtureStatistics(data.match.fixture.id);
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
  if (walletProvider) {
    try {
      const provider = new ethers.providers.Web3Provider(walletProvider as any);
      const signer = provider.getSigner();
      console.log('bet signer', signer);

      const rembetparticipantscount = parseInt(betParticipantsCount) - 1;
      console.log("rem bet part", rembetparticipantscount);

      const Betcontract = new ethers.Contract(BettingCA!, BettingAbi, signer);
      const amt = betAmount + "000000000000000000";
      const tamount = ethers.BigNumber.from(amt);
      const uniqueId = Math.floor(100000 + Math.random() * 900000);

      try {
        const bCOpenBet = await Betcontract.createBet(
          tamount,
          betprediction,
          bettingteam,
          username,
          matchidparam,
          uniqueId,
          matchparam,
          connectedaddress,
          betParticipantsCount,
          { gasLimit: 1000000 }
        );

        try {
          const receipt = await bCOpenBet.wait();
          if (receipt && receipt.status === 1) {
            // transaction success
            setShowLoading(false);
            setBetOpenSuccess(true);
          }
        } catch (receiptError: any) {
          console.log('Transaction receipt error', receiptError);
          setShowAlertDanger(true);
          seterrorMessage(receiptError.code || receiptError.message);
          setShowLoading(false);
        }
      } catch (transactionError: any) {
        console.log('Transaction error', transactionError);
        setShowAlertDanger(true);
        seterrorMessage(transactionError.code || transactionError.message);
        setShowLoading(false);
      }
    } catch (providerError: any) {
      console.log('Provider error', providerError);
      setShowAlertDanger(true);
      seterrorMessage(providerError.code || providerError.message);
      setShowLoading(false);
    }
  }
};


const Approve = async (e:any) => {
  try {
    e.parentElement.parentElement.parentElement.style.display = 'none';
    if(walletProvider) {
        setShowLoading(true);
        const provider = new ethers.providers.Web3Provider(walletProvider as any);
        const signer = provider.getSigner();
        const FRDContract = new ethers.Contract(FRDCA!, FRDAbi, signer);
        const amt = betAmount + "000000000000000000";
        const tamount = ethers.BigNumber.from(amt);
        const reslt = await FRDContract.approve(BettingCA,tamount);
        
        if(reslt) {
          openBetC();
        }
    }
  } catch (error:any) {
    setShowAlertDanger(true);
    seterrorMessage(error.code);
  }
}

const handleOpenBetForm = async (e:any) => {
    try {
        // setShowLoading(true);
           
        try {
          
          const provider = new ethers.providers.Web3Provider(walletProvider as any);
          const signer = provider.getSigner();

          /* next, create the item */
          let FRDcontract = new ethers.Contract(FRDCA!, FRDAbi, signer);
          
          let transaction = await FRDcontract.balanceOf(connectedaddress);
          
          let frdBal = ethers.utils.formatEther(transaction);
          let inputAlertDiv = document.getElementById("minamuntalert") as HTMLElement;
          let selectAlertDiv = document.getElementById("partpntsalert") as HTMLElement;
          
          
          if((betAmount < usdequivfrdamount) || betAmount == 0) {
              inputAlertDiv.innerHTML = `You can't bet below ${usdequivfrdamount.toLocaleString()} FRD`;
              setShowLoading(false);
              return;
          }else {
            inputAlertDiv.innerHTML = ``;
          }
          
          if(betprediction && betprediction !== '' && betprediction !== null && betprediction !== undefined) {
            selectAlertDiv.innerHTML = "";    
          }else {
              selectAlertDiv.innerHTML = "Select prediction first";
              setShowLoading(false);
              return;
          }

          if(bettingteam && bettingteam !== '' && bettingteam !== null && bettingteam !== undefined) {
            selectAlertDiv.innerHTML = "";
          }else {
            selectAlertDiv.innerHTML = "Select team first";
            setShowLoading(false);
              return;
          }
          if(parseInt(frdBal) < usdequivfrdamount) {
            setShowAlertDanger(true);
            seterrorMessage(`You need a minimum of ${usdequivfrdamount.toLocaleString()}FRD to proceed!`)
            setShowLoading(false);
          }else {
            Approve(e);
          }
          
        } catch (error) {
          setShowAlertDanger(true);
          seterrorMessage(`transaction cancelled /${error}`);
          setShowLoading(false)
        }

  
    } catch (error) {
      console.log(error)
    }
}
  
const closeAlertModal = () => {
  setShowAlertDanger(false);
  setShowBgOverlay(false);
  setShowLoading(false);
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
      let targetDiv = divId.parentElement.parentElement.nextElementSibling;
      targetDiv.style.display = (targetDiv.style.display === 'none') ? 'block' : 'none';
    }
    if(path !== null && path !== undefined) {
      let targetDiv = divId.parentElement.parentElement.parentElement.nextElementSibling;
      targetDiv.style.display = (targetDiv.style.display === 'none') ? 'block' : 'none';
    }
  }else {
    let targetDiv = divId.parentElement.nextElementSibling;
    targetDiv.style.display = (targetDiv.style.display === 'none') ? 'block' : 'none';
  }
  

}

const toggleFixturesH = (divId:any) => {
  
  let targetDiv = divId.parentElement.parentElement.nextElementSibling;
  targetDiv.style.display = (targetDiv.style.display === 'none') ? 'block' : 'none';

}

const closeLeagueFixtures = (divId:any) => {
  
  divId.parentElement.parentElement.parentElement.remove();
  // let svg = divId.getAttribute('data-icon');
  // let path = divId.getAttribute('fill');
  // if(svg !== null && svg !== undefined) {
  //   divId.parentElement.parentElement.parentElement.remove();
  // }
  // if(path !== null && path !== undefined) {
  //   divId.parentElement.parentElement.parentElement.parentElement.remove()
  // }
}

const toggleFixtureAct = (divId:any) => {
  console.log("div Id dd",divId)
  let svg = divId.getAttribute('data-icon');
  let path = divId.getAttribute('fill');
  if((svg !== null && svg !== undefined) || (path !== null && path !== undefined)) {
    if(svg !== null && svg !== undefined) {
      let targetDiv = divId.parentElement.parentElement.nextElementSibling;
      console.log("target div cc",targetDiv);
      targetDiv.style.display = (targetDiv.style.display === 'none') ? 'block' : 'none';
    }
    if(path !== null && path !== undefined) {
      let targetDiv = divId.parentElement.parentElement.parentElement.nextElementSibling;
      console.log("target div cc",targetDiv);
      targetDiv.style.display = (targetDiv.style.display === 'none') ? 'block' : 'none';
    }
  }else {
    let targetDiv = divId.parentElement.nextElementSibling;
    console.log("target div cc",targetDiv);
    targetDiv.style.display = (targetDiv.style.display === 'none') ? 'block' : 'none';
  }
  

}

const toggleFixtureActH = (divId:any) => {
  console.log("div id ff",divId)
  let targetDiv = divId.parentElement.parentElement.nextElementSibling;
    console.log("target div cc",targetDiv);
    targetDiv.style.display = (targetDiv.style.display === 'none') ? 'block' : 'none';
  
}

const closeLeagueFixtureAct = (divId:any) => {
  setShowBgOverlay(false);
  setShowLoading(false);
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
  setShowBgOverlay(false);
  setShowLoading(false);
  divId.parentElement.parentElement.style.display = "none";
  // let svg = divId.getAttribute('data-icon');
  // let path = divId.getAttribute('fill');
  // if(svg !== null && svg !== undefined) {
  //   divId.parentElement.parentElement.style.display = 'none';
  // }
  // if(path !== null && path !== undefined) {
  //   divId.parentElement.parentElement.parentElement.style.display = 'none';
  // }
}

const closeHIWE = (divId:any) => {
  let hiwDiv = document.getElementById("howitworks") as HTMLDivElement;
  hiwDiv.style.display = "none";
  // let svg = divId.getAttribute('data-icon');
  // let path = divId.getAttribute('fill');
  
  // if(svg !== null && svg !== undefined) {
  //   divId.parentElement.parentElement.parentElement.style.display = 'none';
  // }
  // if(path !== null && path !== undefined) {
  //   divId.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
  // }
  setShowBgOverlay(false);
  setShowLoading(false);
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

const openHIWE = () => {
  let hiwdiv = document.getElementById("howitworks") as HTMLDivElement;
  hiwdiv.style.display = (hiwdiv.style.display === 'block') ? 'none' : 'block';
  setShowBgOverlay(true);
}

const placeBet = (divId:any) => {

  // let bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
  
  let svg = divId.getAttribute('data-icon');
  let path = divId.getAttribute('fill');
  console.log("div iop",divId,svg,path)
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
  setShowBgOverlay(false);
  setShowLoading(false);
  console.log("div id herer",divId)
  divId.parentElement.parentElement.style.display = "none";
  // let svg = divId.getAttribute('data-icon');
  // let path = divId.getAttribute('fill');
  
  // let bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;

  // if(svg !== null && svg !== undefined) {
  //   // bgoverlay.style.display = 'none';
  //   console.log("peeeee",divId.parentElement.parentElement)
  //   // divId.parentElement.parentElement.style.display = 'none';
  // }
  // if(path !== null && path !== undefined) {
  //   // bgoverlay.style.display = 'none';
  //   console.log("opppppppp",divId.parentElement.parentElement)
  //   // divId.parentElement.parentElement.parentElement.style.display = 'none';
  // }
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

const setBetAmounts = (e: any) => {
  setBetAmount(Math.ceil(e.target.value));
  setDollarEquiv(Math.ceil(e.target.value * usdprice))
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
  const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/fixtures/searchmatchbykeyword", {
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
    const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/fixtures/loadmatchsearchresult", {
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


const closeBgModal = () => {
  setShowLoading(false);
  setShowBgOverlay(false);
}

  return (
    <>
      <Head>
          <title>Bet - {countryparam} - {leagueparam} - {matchparam} | FifaReward</title>
          <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
      </Head>

      <div className={matchstyle.main}>
      {showBgOverlay && <BgOverlay onChange={closeBgModal}/>}
      {showloading && <Loading/>}
      <div className={matchstyle.search} >
            <div>
              <form>
                  <input type='text' title='input' id="search-input" value={searchkeyword} onClick={handleInputClick} ref={inputRef} onChange={(e) => getKeyWordSearchN(e.target.value)} placeholder='Search by'/><div className={matchstyle.searchicon}><FaMagnifyingGlass onClick={() => loadSearchResults()}/></div>
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
          <button type='button' title='button' onClick={goBack} style={{color: '#151414'}}> {'<< '} back</button> <a href='/'>home</a> {'>'} <a href='/betting'>betting</a> {'>'} <a href={`../../../${countryparam}/${leagueparam}/${matchparam}/${matchidparam}`}>{countryparam?.replace(/-/g, ' ')} {'>'} {leagueparam?.replace(/-/g, ' ')} {'>'} {matchparam?.replace(/-/g, ' ')}</a>
        </div> }

        {showAlertDanger && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
        {betopensuccess && 
            <ActionSuccessModal prop='Bet' onChange={closeActionModalComp}/>
        }
        
        {/* how it works div starts */}
        <div id='howitworks' className={matchstyle.hiwmain}>
          <div className={matchstyle.hiw_c}>
            <div className={matchstyle.hiw_x} onClick={(e) => closeHIWE(e.target)}>{<span style={{color: 'white', fontWeight: 'bolder'}}>x</span>}</div>
            <h3>How It Works</h3>
            <ul>
              <li>
                <FaCircle className={matchstyle.hiwlistcircle} />  Fund your wallet with FRD from <a href='https://pancakeswap.finance/swap?outputCurrency=0x6fe537b0ba874eab212bb8321ad17cf6bb3a0afc'>pancakeswap</a> or any other exchange of your choice
              </li>
              <li>
                <FaCircle className={matchstyle.hiwlistcircle} />  Visit the <a href='../../../../betting'>betting page</a>
              </li>
              <li>
                <FaCircle className={matchstyle.hiwlistcircle} />  Search and choose a game/fixture of your choice
              </li>
              <li>
                <FaCircle className={matchstyle.hiwlistcircle} />  Click on Open Bets, and place a bet by selecting your betting team, prediction, bet participants and betting amount in FRD. 
              </li>
              <li>
                <FaCircle className={matchstyle.hiwlistcircle} />  Your opened bet will be listed in open bets page <a href='../../../../betting/openbetslists'>open bets</a>
              </li>
              <li>
                <FaCircle className={matchstyle.hiwlistcircle} />  Any user can join your bet.
              </li>
              <li>
                <FaCircle className={matchstyle.hiwlistcircle} /> All placed bets are closed after the match or fixture, bet winners get their winning bets automatically in their wallets. 
              </li>
              <li>
                <FaCircle className={matchstyle.hiwlistcircle} /> If your bet didn't find a participant to join, after the fixture, if you win, your winnings will be transferred to your wallet. But if you lose, you can bet again to try your luck next time.  
              </li>
              <li>
                <FaCircle className={matchstyle.hiwlistcircle} /> Draw bets are carried over to a next match
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

                        {/* {fixturelineupsdataloaded && fixturelineupsData.length > 0 ?
                          <div className={matchstyle.lineups_pitch}>
                            {fixturelineupsData.map((lineup,index) => (
                              <div key={index}>
                                <div className={matchstyle.lineups}>
                                  <div>
                                    <div>
                                      <Image src={lineup.coach.photo} alt='logo' width={30} height={40}/>
                                    </div>
                                    <div>
                                      {lineup.coach.name}
                                    </div>
                                  </div>
                                  
                                </div>
                              </div>
                            ))}
                          </div>
                          : ''
                        } */}

                          <div className={matchstyle.tgle} >
                            <div><h3 onClick={(e) => toggleFixturesH(e.target)}>{matchData?.league.name}</h3></div>
                            <div className={matchstyle.drpdwn} onClick={(e) => toggleFixtures(e.target)}>{<span style={{color: 'white', fontWeight: 'bolder'}}></span>}</div>
                            <div className={matchstyle.closeicon} onClick={(e) => closeLeagueFixtures(e.target)}>{<span style={{color: 'gray', fontWeight: 'bolder'}}>x</span>}</div>
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
                                      <div> 
                                        <div><Image src={matchData!.teams.home.logo} className={matchstyle.lg} alt="logo" width={30} height={40} /></div> 
                                        <div>{`${matchData?.teams.home.name}`}</div> 
                                      </div>
                                      <div className={matchstyle.vs}> {matchData?.goals.home != null ? (matchData?.goals.home) : ''} - {matchData?.goals.home != null ? (matchData?.goals.away) : ''}</div>
                                      <div> 
                                        <div><Image src={matchData!.teams.away.logo} className={matchstyle.lg} alt="logo" width={30} height={40} /></div> 
                                        <div>{`${matchData?.teams.away.name}`}</div> 
                                      </div>
                                    </div>
                                </div>
                                <div className={matchstyle.openbet}>
                                    <div className={matchstyle.opb_btns_div}>
                                        <div className={matchstyle.bt_close} onClick={(e) => closeHIWDiv(e.target)}><span style={{color: 'white',fontWeight: 'bolder'}}>x</span></div>
                                        <div className={matchstyle.opb_btns}>
                                            <div className={matchstyle.opb_open} onClick={(e) => placeBet(e.target)}><button type='button' title='button'>Open Bet {<IoIosFootball/>}</button></div>
                                            <div className={matchstyle.opb_hiw} onClick={() => openHIWE()}><button type='button' title='button'>How It Works {<GiToolbox />}</button></div>
                                        </div>
                                    </div>

                                    <div className={matchstyle.pbet} id="pbet_op">
                                      <div className={matchstyle.pbet_x} ><span onClick={(e) => closePBET(e.target)} style={{color: 'white',fontWeight: 'bolder'}}>x</span></div>
                                      <form>
                                          <h3>Place Bet</h3>
                                          <div>
                                            <p>Place bet by selecting the appropriate details</p>
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
                                                      <option> Select team </option>
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
                                                      <option >Select Prediction</option>
                                                      <option value='Win'>Win</option>
                                                      <option value='Lose'>Lose</option>
                                                  </select>
                                              </div>
                                              <small id='predictionalert'></small>
                                          </div>
                                          <div className={matchstyle.form_g}>
                                              <label>Enter amount ({`Min of ${usdequivfrdamount?.toLocaleString()}FRD ($10)`})</label>
                                              <div style={{color: 'white'}}>${dollarequiv?.toLocaleString()}</div>
                                              <input type='number' title='input' required onChange={(e) => setBetAmounts(e)} min={5} placeholder={`${usdequivfrdamount?.toLocaleString()}FRD`} />
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

                                    <div className={matchstyle.sbtn}>
                                      <button type='button' title='buttn' onClick={(e) => firstopenHIW(e.target)}> Bet On ({`${matchData?.teams.home.name} vs ${matchData?.teams.away.name}`}) </button>
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>


                        {/* {fixtureeventsdataloaded && fixtureeventsData.length > 0 ?
                          <div className={matchstyle.fixevents}>
                            <div className={matchstyle.tgle} >
                              <div onClick={(e) => toggleFixtures(e.target)}><h3>Events</h3></div>
                              <div className={matchstyle.drpdwn} onClick={(e) => toggleFixtures(e.target)}>{<FaCaretDown />}</div>
                              <div className={matchstyle.closeicon} onClick={(e) => closeLeagueFixtures(e.target)}>{<FaXmark />}</div>
                            </div>
                            {fixtureeventsData.map((event,index) => (
                              <div key={index}>
                                <div>
                                  <div><Image src={event.team.logo} alt='logo' width={25} height={35} /></div>
                                  <div>{event.team.name}</div>
                                </div>
                                <div >
                                  <div>
                                    {event.assist.name}
                                  </div>
                                  <div>
                                    {event.detail}
                                  </div>
                                </div>
                                <div>
                                  {event.player.name}
                                </div>
                                <div>
                                  {event.time.extra}
                                </div>
                                <div>
                                  {event.time.elapsed}
                                </div>
                              </div>
                            ))}
                          </div>
                          : ''
                        } */}

                        {fixtureh2hdataLoaded && fixtureh2hData?.length > 0 ?
                        <div className={matchstyle.fixh2h}>
                          <div className={matchstyle.tgle} >
                            <div><h3 onClick={(e) => toggleFixtureActH(e.target)}>Head To Head</h3></div>
                            <div className={matchstyle.drpdwn} onClick={(e) => toggleFixtureAct(e.target)}>{<FaCaretDown/>}</div>
                            <div className={matchstyle.closeicon} onClick={(e) => closeLeagueFixtureAct(e.target)}>{<FaXmark/>}</div>
                          </div>

                          <div>
                            {fixtureh2hData?.map((h2h,index) => (
                              <div key={index}>
                                  <div className={matchstyle.h2hdate}>{`${moment(h2h.fixture.date).format('dddd, MMMM Do YYYY')}`}</div>
                                  <div className={matchstyle.h2hd}>
                                      <div className={matchstyle.h2hdb}>
                                        <div>
                                          <Image src={h2h.teams.home.logo} alt='logo' width={25} height={35}/> 
                                        </div>
                                        <div className={matchstyle.h2hname}>
                                          {h2h.teams.home.name}
                                        </div>
                                      </div>
                                      <div className={matchstyle.h2hdc}>
                                        <div>{h2h?.goals.home != null ? (matchData?.goals.home) : ''}</div>
                                        <div className={matchstyle.vs}> - </div>
                                        <div>{h2h?.goals.away != null ? (matchData?.goals.away) : ''}</div>
                                      </div>
                                      <div className={matchstyle.h2hdb}>
                                        <div>
                                          <Image src={h2h.teams.away.logo} alt='logo' width={25} height={35}/>
                                        </div>
                                        <div  className={matchstyle.h2hname}>
                                          {h2h.teams.away.name}
                                        </div>
                                      </div>
                                  </div>
                              </div>
                            ))}
                          </div>

                        </div> : ''
                      }

                      {fixturestatisticsdataloaded && fixturestatisticsData.length > 0 ?
                        <div className={matchstyle.fixstats}>
                            <div className={matchstyle.tgle} >
                              <div><h3 onClick={(e) => toggleFixtureActH(e.target)}>Match Statistics </h3></div>
                              <div className={matchstyle.drpdwn} onClick={(e) => toggleFixtureAct(e.target)}>{<FaCaretDown/>}</div>
                              <div className={matchstyle.closeicon} onClick={(e) => closeLeagueFixtureAct(e.target)}>{<FaXmark/>}</div>
                            </div>
                          
                            <div>
                              <div className={matchstyle.fixstatsd} >
                                
                                <div className={matchstyle.fixstatsdc1}>
                                  <div className={matchstyle.fixstatsdc11}>
                                    <div>
                                      <Image src={fixturestatisticsData[0].team.logo} className={matchstyle.teamlogo} width={25} height={35} alt='logo' style={{textAlign: 'left'}}/>
                                    </div>
                                    <div className={matchstyle.fixstatsname}>
                                      {fixturestatisticsData[0].team.name}
                                    </div>
                                  </div>
                                  <div className={matchstyle.fixstatsds}>
                                    {fixturestatisticsData[0].statistics.map((stat,index) => (
                                      <div key={index}>
                                        <div className={matchstyle.type1}>{stat.type}</div>
                                        <div className={matchstyle.stats1} >
                                          <div className={matchstyle.prog1}><span></span></div>
                                          <div className={matchstyle.val1}>{stat.value === stat.value ? stat.value : '0'}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className={matchstyle.fixstatsdc2}>
                                  <div className={matchstyle.fixstatsdc22}>
                                    <div className={matchstyle.tlogo}>
                                      <Image src={fixturestatisticsData[1].team.logo} className={matchstyle.teamlogo} width={25} height={35} alt='logo' style={{textAlign: 'right',marginRight: '0'}}/>
                                    </div>
                                    <div className={matchstyle.fixstatsname}>
                                      {fixturestatisticsData[1].team.name}
                                    </div>
                                  </div>
                                  <div className={matchstyle.fixstatsds}>
                                    {fixturestatisticsData[1].statistics.map((stat,index) => (
                                      <div key={index}>
                                          <div className={matchstyle.type2}>{stat.type}</div>
                                          <div className={matchstyle.stats2} >
                                            <div className={matchstyle.val2}>{stat.value === stat.value ? stat.value : '0'}</div>
                                            <div className={matchstyle.prog2}><span></span></div>
                                          </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                              </div>
                            </div>

                        </div>  
                        : ''
                    }
                    </div>

                    
                  }
                  {loadedlaguedata &&
                    <div>
                      {leaguecomponent.map(component => component)}
                    </div> 
                  }
                  
                      <SportsWidget />

                  </div>
              </div>
          </div>
          <div className={matchstyle.openbets_list}>
            <div className={matchstyle.opb_h}>
                
              <div className={matchstyle.opb}>
                {/* {isbetDataLoaded ? */}
                <div>
                  <h3>Open Bets</h3>
                  <LoadOpenBetsData onMount={setLoadOpenBetsDataStatus}/>
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
