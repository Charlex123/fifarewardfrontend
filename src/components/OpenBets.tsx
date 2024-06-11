import React, { useEffect, useState, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import openbetsstyle from '../styles/openbets.module.css'
import axios from 'axios';
import dotenv from 'dotenv';
import { useUser } from '../contexts/UserContext';
import Image from 'next/image';
import { ethers } from 'ethers';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import FRDAbi from '../../artifacts/contracts/FifaRewardToken.sol/FifaRewardToken.json';
import BettingAbi from '../../artifacts/contracts/FRDBetting.sol/FRDBetting.json';
import BettingFeaturesAbi from '../../artifacts/contracts/FRDBettingFeatures.sol/FRDBettingFeatures.json';
import { Bets } from './BetsMetadata';
import { BetConditions } from './BetConditionsMetadata';
import footballb from '../assets/images/footaballb.jpg';
import AlertDanger from './AlertDanger';
import footballg from '../assets/images/footballg.jpg';
import Loading from './Loading';
import ActionSuccessModal from './ActionSuccess';
import BgOverlay from './BgOverlay';
import Head from 'next/head';
import { FaCircle, FaFilter, FaMagnifyingGlass, FaXmark } from 'react-icons/fa6';

dotenv.config();
// material
// component




const OpenBets:React.FC<{}> = () => {
  // types.ts

const [username, setUsername] = useState<string>("");
const [betopensuccess,setBetOpenSuccess] = useState<boolean>(false);

const router = useRouter();

const { connectedaddress } = useUser();

const inputRef = useRef<HTMLInputElement>(null);
const [betData,setBetData] = useState<Bets[]>([]);
const [currentPage, setCurrentPage] = useState<number>(1);
const [limit] = useState<number>(10)
const [totalPages, setTotalPages] = useState(0);
const [errorMessage, seterrorMessage] = useState<any>();
const [error, setError] = useState<boolean>(false);
const [showloading, setShowLoading] = useState<boolean>(false);
const [showAlertDanger,setShowAlertDanger] = useState<boolean>(false);
const [bettingteam,setBettingTeam] = useState<string>('');
const [searchkeyword,setSearchKeyWord] = useState<string>('');
const [betprediction,setBetPrediction] = useState<string>('');
const [usdequivfrdamount, setUsdEquivFrdAmount] = useState<number>(0);
const [usdprice, setUsdPrice] = useState<any>();
const [showBgOverlay,setShowBgOverlay] = useState<boolean>(false);
const [showsearchoptions, setShowSearchOptions] = useState<boolean>(false);
const [betconditions,setBetConditions] = useState<BetConditions[]>([]);
const [showbetconditions, setShowBetConditions] = useState<boolean>(false);
const [filterbetAmount, setfilterbetamount] = useState<number>(0);
const FRDCA = process.env.NEXT_PUBLIC_FRD_DEPLOYED_CA;
const BettingCA = process.env.NEXT_PUBLIC_FRD_BETTING_CA;
const BettingFeaturesCA = process.env.NEXT_PUBLIC_FRD_BETTING_FEATURES_CA;
const { open } = useWeb3Modal();
const { walletProvider } = useWeb3ModalProvider();
const Wprovider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545");
const  walletPrivKey: any = process.env.NEXT_PUBLIC_FRD_PRIVATE_KEY as any;
const minfilterbyamount = usdequivfrdamount;
const maxfilterbyamount = 500000;

useEffect(() => {
 
  const udetails = JSON.parse(localStorage.getItem("userInfo")!);
  if(udetails && udetails !== null && udetails !== "" && connectedaddress) {
      const username_ = udetails.username;  
      if(username_) {
          setUsername(username_);
      }
  }else {
    open()
  }
  
  
  // let searchOptions = ["Username","wallet address"];
  // let currentSearchOptionIndex = 0;

  // const rotateSearchOption = () => {
  //   let searchinput = document.getElementById("search-input") as HTMLElement;
  //   searchinput.setAttribute('placeholder','Search by '+searchOptions[currentSearchOptionIndex]);

  //   currentSearchOptionIndex = (currentSearchOptionIndex + 1) % searchOptions.length;
  // }

  // const intervalId = setInterval(rotateSearchOption,6000);

  const handleClickOutside = (event: MouseEvent) => {
    // Check if the clicked element is inside the input or not
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      // Handle closing the event associated with the input
      setShowSearchOptions(false)
    }
  };

  // Add event listener to the body
  document.body.addEventListener('click', handleClickOutside);

  return () => {
    // Clean up the event listener when the component is unmounted
    document.body.removeEventListener('click', handleClickOutside);
    // clearInterval(intervalId);
  };
  
},[betData,limit,currentPage])

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
          setUsdPrice(data.usdprice);
          setfilterbetamount(data.usdequivalentfrdamount);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      getUSDEQUIVFRDAMOUNT();
      
      const fetchData = async () => {

        let provider, signer;
        
        if(walletProvider) {
          provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
          signer = provider.getSigner();
        }else {
          const provider = walletProvider as any || Wprovider as any;
          const wallet = new ethers.Wallet(walletPrivKey as any, provider);
          signer = provider.getSigner(wallet.address);
        }
        
        if(signer) {
          try {
            setShowLoading(true);
            const BetFeaturescontract = new ethers.Contract(BettingFeaturesCA!, BettingFeaturesAbi, signer);
            const loadBets = await BetFeaturescontract.loadAllBets();
            
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
},[])


  const JoinBet = (e: any) => {
    setShowBgOverlay(true);
      e.parentElement.parentElement.nextElementSibling.firstElementChild.style.display = 'block';
  }

  const submitPredictions = async (betId: number, betAmount: number) => {
    let provider, signer;
  
      if (walletProvider) {
        try {
          provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
          signer = provider.getSigner();
  
          if (signer) {
            const Betcontract = new ethers.Contract(BettingCA!, BettingAbi, signer);
            const amt = betAmount + "000000000000000000";
            const tamount = ethers.BigNumber.from(amt);
  
            try {
              const submitpred = await Betcontract.submitPrediction(
                betId, 
                tamount, 
                username, 
                betprediction, 
                bettingteam, 
                { gasLimit: 1000000 }
              );
  
              const receipt = await submitpred.wait();
  
              if (receipt && receipt.status === 1) {
                // transaction success
                setShowLoading(false);
                setBetOpenSuccess(true);
              }
            } catch (error: any) {
              console.log(error)
              setShowAlertDanger(true);
              seterrorMessage(error.code || error.message);
              setShowLoading(false);
            }
          }
        } catch (error: any) {
          console.log("err der",error)
          setShowAlertDanger(true);
          seterrorMessage(error.code || error.message);
          setShowLoading(false);
        }
      }
    
  };

  const JoinBetNow = async (e:any,betId:number,betAmount:any,openedby:string,participants:string,remainingparticipantscount:number) => {
    try {
        let divP = e.parentElement.parentElement.parentElement;
        
        setShowLoading(true);
          try {
            const provider = new ethers.providers.Web3Provider(walletProvider as any);
                const signer = provider.getSigner();
    
                /* next, create the item */
                let FRDcontract = new ethers.Contract(FRDCA!, FRDAbi, signer);
                
                let transaction = await FRDcontract.balanceOf(connectedaddress);
                
                let frdBal = ethers.utils.formatEther(transaction);

                let erAlertDv = e.parentElement.parentElement.previousElementSibling;
          
                if(connectedaddress === openedby) {
                  erAlertDv.innerHTML = "You can't join a bet you opened";
                  return;
                }
                if(remainingparticipantscount === 0) {
                  erAlertDv.innerHTML = "This bet is closed";
                  return;
                }
                if(bettingteam === '') {
                  erAlertDv.innerHTML = "You must select a team!";
                  return;
                }else {
                  erAlertDv.innerHTML = "";
                }

                if(betprediction === '') {
                  erAlertDv.innerHTML = "You must choose a prediction!";
                  return;
                }else {
                  erAlertDv.innerHTML = "";
                }

                const arrayofparticpants = participants.split(',');
                
                if(arrayofparticpants.indexOf(connectedaddress!) !== -1) {
                  erAlertDv.innerHTML = "You can't join this bet again!";
                  return;
                }else {
                  erAlertDv.innerHTML = "";
                }

                if(parseInt(frdBal) < betAmount) {
                  setShowAlertDanger(true);
                  seterrorMessage(`You need a minimum of ${betAmount}FRD to proceed!`)
                  setShowLoading(false);
                }else {
                  divP.style.display = "none";
                  Approve(betId, betAmount)
                }
                
                
          } catch (error) {
            
          }
          
    } catch (error: any) {
      console.log(error)
    }
}

const Approve = async (betId: number,betAmount: number) => {
  try {
      if(walletProvider) {
        setShowLoading(true);
        const provider = new ethers.providers.Web3Provider(walletProvider as any);
        const signer = provider.getSigner();
        const FRDContract = new ethers.Contract(FRDCA!, FRDAbi, signer);
        const amt = betAmount + "000000000000000000";
        const tamount = ethers.BigNumber.from(amt);
        const reslt = await FRDContract.approve(BettingCA,tamount);
        
        if(reslt) {
          submitPredictions(betId, betAmount);
        }
    }
  
  } catch (error:any) {
    setShowAlertDanger(true);
    seterrorMessage(error.code);
  }
}

const closeActionModalComp = () => {
    // let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
    // hiw_bgoverlay.style.display = 'none';
    setShowBgOverlay(false);
    setBetOpenSuccess(false);
    router.push('openbets');
}

const setBetPredictn = (prediction:any) => {
  setBetPrediction(prediction);
} 

const setBetteam = (team:any) => {
  setBettingTeam(team)
} 

const closePBET = (divId:any) => {
  let svg = divId.getAttribute('fill');
  let path = divId.getAttribute('d');
  console.log("here ppp",divId)
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

// const Cancel = (e:any) => {
//   console.log("kerlopppppppp")
//   console.log(e)
// }

// const setLoadOpenBetsDataStatus = () => {
//   setIsBetDataLoaded(true)
// }

const closeHIWE = (divId:any) => {
  let svg = divId.getAttribute('data-icon');
  let path = divId.getAttribute('fill');
  // let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
  // hiw_bgoverlay.style.display = (hiw_bgoverlay.style.display === 'block') ? 'none' : 'block';
  setShowBgOverlay(!showBgOverlay);
  if(svg !== null && svg !== undefined) {
    divId.parentElement.parentElement.parentElement.style.display = 'none';
  }
  if(path !== null && path !== undefined) {
    divId.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
  }
}

 // Function to render page numbers
 const renderPageNumbers = () => {
  let pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button className={openbetsstyle.number} type='button' title='button' key={i} onClick={() => setCurrentPage(i)} disabled={i === currentPage}>
        {i}
      </button>
    );
  }
  return pages;
};

const goBack = () => {
    router.back()
}

const gotoPage = (pageNumber: number) => {
  setCurrentPage(pageNumber);
};

const closeAlertModal = () => {
  setShowAlertDanger(false);
  setShowBgOverlay(false);
  setShowLoading(false)
  setError(false)
}


const loadSearchResults = async () => {
  setShowBgOverlay(true);
  setShowLoading(true);

    let provider, signer;
    
    if(walletProvider) {
      provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
      signer = provider.getSigner();
    }else {
      const provider = walletProvider as any || Wprovider as any;
      const wallet = new ethers.Wallet(walletPrivKey as any, provider);
      signer = provider.getSigner(wallet.address);
    }
    
    if(signer) {
      try {
        const BetFeaturescontract = new ethers.Contract(BettingFeaturesCA!, BettingFeaturesAbi, signer);
        let loadBets;
        if(searchkeyword.length < 30) {
          loadBets = await BetFeaturescontract.getBetsByUsername(searchkeyword);
        }else {
          loadBets = await BetFeaturescontract.getBetsByWallet(searchkeyword);
        }
        
        await loadBets.forEach(async (element:any) => {
            
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
            setShowBgOverlay(false);
            setShowLoading(false);
            return item;
        });
      } catch (error: any) {
        setShowAlertDanger(true);
        seterrorMessage(error.code);
        setShowLoading(false);
      }
      
    }
  
}

const viewBetDetails = async(e:any,betId:number) => {
  let provider, signer;
        
  if(walletProvider) {
    provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
    signer = provider.getSigner();
  }else {
    const provider = walletProvider as any || Wprovider as any;
    const wallet = new ethers.Wallet(walletPrivKey as any, provider);
    signer = provider.getSigner(wallet.address);
  }
  
  if(signer) {
    try {
      setShowLoading(true);
      setShowBgOverlay(true);
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

const closeBetCondtns = (divId:any) => {
  let svg = divId.getAttribute('data-icon');
  let path = divId.getAttribute('fill');
  // let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
  // hiw_bgoverlay.style.display = 'none';
  setShowBgOverlay(false);
  setShowBetConditions(false);
}

const FilterByBetAmount = async (event:any) => {
  const newValue = event.target.value;
  setfilterbetamount(newValue);
  setShowBgOverlay(true);
  setShowLoading(true);
    let provider, signer;
    
    if(walletProvider) {
      provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
      signer = provider.getSigner();
    }else {
      const provider = walletProvider as any || Wprovider as any;
      const wallet = new ethers.Wallet(walletPrivKey as any, provider);
      signer = provider.getSigner(wallet.address);
    }
    
    if(signer) {
      try {
        const BetFeaturescontract = new ethers.Contract(BettingFeaturesCA!, BettingFeaturesAbi, signer);
        const Betcontract = new ethers.Contract(BettingCA!, BettingAbi, signer);
        const amt = filterbetAmount + "000000000000000000";
        const tamount = ethers.BigNumber.from(amt);

        const loadBets = await BetFeaturescontract.getBetsByAmount(tamount);
        
        await loadBets.forEach(async (element:any) => {
          if(element.openedBy != 0x0000000000000000000000000000000000000000) {
            let betAmt = Math.ceil((element.betamount.toString())/(10**18));
            
              const getbetpredictions = await Betcontract.getPredictions(element.betId.toNumber());
              setBetConditions(getbetpredictions);
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
                setShowBgOverlay(false);
                setShowLoading(false);
                return item;
              }else {
                setShowAlertDanger(true);
                seterrorMessage("Bets not found, try again")
                setShowLoading(false);
              }
            });
      } catch (error: any) {
        setShowAlertDanger(true);
        seterrorMessage(error.code);
        setShowLoading(false);
      }
      
    }
};

const FilterByClosedBets = async () => {
  setShowBgOverlay(true);
  setShowLoading(true);
    let provider, signer;
    
    if(walletProvider) {
      provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
      signer = provider.getSigner();
    }else {
      const provider = walletProvider as any || Wprovider as any;
      const wallet = new ethers.Wallet(walletPrivKey as any, provider);
      signer = provider.getSigner(wallet.address);
    }
    
    if(signer) {
      try {
        const BetFeaturescontract = new ethers.Contract(BettingFeaturesCA!, BettingFeaturesAbi, signer);
        const Betcontract = new ethers.Contract(BettingCA!, BettingAbi, signer);
        const loadBets = await BetFeaturescontract.getBetsByStatus("closed");
        console.log(" cloesd bets",loadBets)
        await loadBets.forEach(async (element:any) => {
         
          if(element.openedBy != 0x0000000000000000000000000000000000000000) {
            let betAmt = Math.ceil((element.betamount.toString())/(10**18));
            
            const getbetpredictions = await Betcontract.getPredictions(element.betId.toNumber());
            setBetConditions(getbetpredictions);
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
              setShowBgOverlay(false);
              setShowLoading(false);
              return item;
          }else {
            setShowAlertDanger(true);
            seterrorMessage("No closed bet found, try again")
            setShowLoading(false);
          }

        });
      } catch (error: any) {
        setShowAlertDanger(true);
        seterrorMessage(error.code);
        setShowLoading(false);
      }
      
    }
}

const FilterByOpenBets = async () => {
  setShowBgOverlay(true);
  setShowLoading(true);
    let provider, signer;
    
    if(walletProvider) {
      provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
      signer = provider.getSigner();
    }else {
      const provider = walletProvider as any || Wprovider as any;
      const wallet = new ethers.Wallet(walletPrivKey as any, provider);
      signer = provider.getSigner(wallet.address);
    }
    
    if(signer) {
      try {
        
        const BetFeaturescontract = new ethers.Contract(BettingFeaturesCA!, BettingFeaturesAbi, signer);
        const Betcontract = new ethers.Contract(BettingCA!, BettingAbi, signer);
        const loadBets = await BetFeaturescontract.getBetsByStatus("open");
        console.log("load open vbets",loadBets)
        await loadBets.forEach(async (element:any) => {
          if(element.openedBy != 0x0000000000000000000000000000000000000000) {
            let betAmt = Math.ceil((element.betamount.toString())/(10**18));
            const getbetpredictions = await Betcontract.getPredictions(element.betId.toNumber());
            setBetConditions(getbetpredictions);
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
              setShowBgOverlay(false);
              setShowLoading(false);
              return item;
            }else {
              setShowAlertDanger(true);
              seterrorMessage("No open bet found, try again")
              setShowLoading(false);
            }
          });
          
      } catch (error: any) {
        setShowAlertDanger(true);
        seterrorMessage(error.code);
        setShowLoading(false);
      }
      
    }
};

const toggleAddress = (e:any) => {
  let fulladdress = e.previousElementSibling as HTMLSpanElement;
  fulladdress.style.display = (fulladdress.style.display === 'block') ? 'none' : 'block';
}

const closeBgModal = () => {
  setShowLoading(false);
  setShowBgOverlay(false);
}

const toggleBetFilter = () => {
  let filterbyDiv = document.getElementById("opb_hi") as HTMLDivElement;
  filterbyDiv.style.display = filterbyDiv.style.display === "block" ? "none" : "block";
}

const closeBetFilter = () => {
  let filterbyDiv = document.getElementById("opb_hi") as HTMLDivElement;
  filterbyDiv.style.display = "none";
}

  return (
    <>
    <Head>
        <title>Open Bets List | FifaReward</title>
        <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
    </Head>
    {showloading && <Loading/>}
    {showAlertDanger && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
    {/* <div className={openbetsstyle.hiw_overlay} id="hiw_overlay"></div> */}
    {showBgOverlay && <BgOverlay onChange={closeBgModal}/>}
      <div className={openbetsstyle.main}>
        <div className={openbetsstyle.search}>
          <div>
            <form>
                <input type='text' title='input' id="search-input" value={searchkeyword} ref={inputRef} onChange={loadSearchResults} placeholder='Search by username or wallet address'/><div className={openbetsstyle.searchicon}><FaMagnifyingGlass onClick={() => loadSearchResults()}/></div>
                {/* {showsearchoptions && 
                  <div className={openbetsstyle.searchop} >
                    {keywordsearchresults?.map((result,index) => (
                    <div key={index}>
                      <div className={openbetsstyle.ft2} onClick={(e) => UpKeyWordSearch(e.target,result.match,result.openedby)}>
                        {result.match}
                      </div>
                      <div className={openbetsstyle.sc2} onClick={(e) => UpKeyWordSearch(e.target,result.match,result.openedby)}>
                        {result.openedby}
                      </div>
                      <div className={openbetsstyle.th2} onClick={(e) => UpKeyWordSearch(e.target,result.match,result.openedby)}>
                        {result.betstatus}
                      </div>
                    </div>
                    ))}
                  </div>
                } */}
            </form>
          </div>
        </div>

        <div className={openbetsstyle.headbg}>
          <Image src={footballb} alt='banner' style={{width: '100%',height: '120px'}}/>
        </div>
        <div className={openbetsstyle.breadcrum}>
          <button type='button' title='button' onClick={goBack} style={{color: '#151414'}}> {'<< '} back</button> 
        </div> 

        {betopensuccess && 
            <ActionSuccessModal prop='Bet join' onChange={closeActionModalComp}/>
        }

        {showbetconditions && 
          <div className={openbetsstyle.betcondtns}>
            <div className={openbetsstyle.betcondtns_m}>
              <div className={openbetsstyle.betcondtns_x} onClick={(e) => closeBetCondtns(e.target)}>{<FaXmark />}</div>
                <h3>Bet participants and their predictions</h3>
                {betconditions.map((betcon, index) => (
                  <div key={index} className={openbetsstyle.betprd}>
                    <div>
                      <div>{betcon.username}</div>
                    </div>
                    <div>
                      <h3>Prediction</h3>
                      <div>
                        <div><span>Team: </span> {betcon.bettingteam}</div>
                        <div><span>Prediction: </span> {betcon.prediction}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
      }
        
        {/* how it works div starts */}
        <div id='howitworks' className={openbetsstyle.hiwmain}>
          <div className={openbetsstyle.hiw_c}>
            <div className={openbetsstyle.hiw_x} onClick={(e) => closeHIWE(e.target)}>{<FaXmark />}</div>
            <h3>How It Works</h3>
            <ul>
              <li>
                <FaCircle className={openbetsstyle.hiwlistcircle} /> Sign up with Fifa Rewards using this link <a href='fifareward'>Join Fifa Reward</a>
              </li>
              <li>
                <FaCircle className={openbetsstyle.hiwlistcircle} />  Fund your wallet with FRD or USDT
              </li>
              <li>
                <FaCircle className={openbetsstyle.hiwlistcircle} />  Visit the betting page
              </li>
              <li>
                <FaCircle className={openbetsstyle.hiwlistcircle} />  Search and choose a game/fixture of your choice
              </li>
              <li>
                <FaCircle className={openbetsstyle.hiwlistcircle} />  Click on Open Bets, and open a bet
              </li>
              <li>
                <FaCircle className={openbetsstyle.hiwlistcircle} />  Your opened bet will be listed in open bets page <a>open bets</a>
              </li>
              <li>
                <FaCircle className={openbetsstyle.hiwlistcircle} />  Look for a bet partner/partners (min. of 2, max. of 6) who will close your bet
              </li>
              <li>
                <FaCircle className={openbetsstyle.hiwlistcircle} /> Bet closed after the match, winners (must be a win) get funded according to their bets 
              </li>
              <li>
                <FaCircle className={openbetsstyle.hiwlistcircle} /> Draw bets are carried over to a next match
              </li>
            </ul>
          </div>
        </div>
        {/* how it works div starts */}

        <div className={openbetsstyle.main_in}>
  
        <div className={openbetsstyle.filter}>
            <div className={openbetsstyle.filter_c}>
                <div>
                  <button type="button" title='filter bet' onClick={toggleBetFilter}>
                    <FaFilter style={{color: '#e28305'}}/><span style={{color: '#151414'}}>Filter</span>
                  </button>
                </div>
            </div>
        </div>
  
          <div className={openbetsstyle.opb_h} id="opb_hi">
          
          {betData.length > 0 && 
            <div className={openbetsstyle.filter}>
              <div className={openbetsstyle.filterclose}><button className={openbetsstyle.filterclosebtn} onClick={closeBetFilter}><FaXmark size='20' style={{color: '#151414'}}/></button></div>
              <h3>Filter By</h3>
              <div>
                <div>
                  <button type='button' title='button' onClick={FilterByOpenBets} style={{cursor: 'pointer'}}>Open Bets {'>>'}</button>
                </div>
                <div>
                  <button type='button' title='button' onClick={FilterByClosedBets} style={{cursor: 'pointer'}}>Closed Bets {'>>'}</button>
                </div>
                <div className={openbetsstyle.amountprog}>
                  <div>Bet Amount </div>
                  <div style={{color: '#151414'}}>${(Math.ceil(filterbetAmount * usdprice)).toLocaleString()+'.00'}</div>
                  <div className={openbetsstyle.fba}>{`${filterbetAmount.toLocaleString()}`} <span>FRD</span></div>
                  <div>
                    <input title='bet amount'
                      type="range"
                      id="horizontalInput"
                      min={minfilterbyamount}
                      max={maxfilterbyamount}
                      step={1}
                      value={filterbetAmount}
                      onChange={FilterByBetAmount}
                      style={{ width: '100%',height: '5px', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
            </div> 
          }
          <div className={openbetsstyle.opb_banner}>
            <Image src={footballg} alt='banner' style={{width: '100%',height: '320px',marginTop: '20px'}}/>
          </div>
          </div>
          <div className={openbetsstyle.openbetmain}>
            <div className={openbetsstyle.table_c}>
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
                      {/* <td><div className={openbetsstyle.div}>{index+1}</div></td> */}
                      <td><div className={openbetsstyle.div}>{index+1}</div></td>
                      <td><div className={openbetsstyle.div}>{openbet.uniquebetId.toString()}</div></td>
                      <td><div className={openbetsstyle.div}>{openbet.matchId.toString()}</div></td>
                      <td><div className={openbetsstyle.div}>{(openbet.betamount.toLocaleString())} {<span className={openbetsstyle.amtunit}>FRD</span>} ({`$${Math.ceil(openbet.betamount * usdprice)}`}) </div></td>
                      <td><div className={openbetsstyle.divaddress}><span>{openbet.openedBy.substring(0,8)+'...'}</span><span className={openbetsstyle.fulladdr}>{openbet.openedBy}</span><button type='button' onClick={(e) => toggleAddress(e.target)}>View</button></div></td>
                      <td><div className={openbetsstyle.div}>{openbet.totalbetparticipantscount.toString()}</div></td>
                      <td><div className={openbetsstyle.div}>{(openbet.totalbetparticipantscount.toNumber()) - (openbet.remainingparticipantscount.toNumber())}</div></td>
                      <td><div className={openbetsstyle.div}>({openbet.participants}) <div className={openbetsstyle.bdet}><button type='button' title='button' onClick={(e) => viewBetDetails(e.target,openbet.betId.toNumber())} style={{cursor: 'pointer'}}> view bet details </button></div></div></td>
                      <td><div className={openbetsstyle.div}>{openbet.remainingparticipantscount.toString()}</div></td>
                      <td className={openbetsstyle.stat}><div className={openbetsstyle.div}>{openbet.remainingparticipantscount.toNumber() > 0 ? <span className={openbetsstyle.betstatusopened}>Open</span> : <span className={openbetsstyle.betstatusclosed}>Closed</span>}</div></td>
                      {openbet.remainingparticipantscount.toNumber() > 0 
                      ? 
                      <td className={openbetsstyle.jb}><div className={openbetsstyle.div}><button className={openbetsstyle.open} type='button' title='button' style={{fontWeight: '600',fontSize: '14px'}} onClick={(e) => JoinBet(e.target)}>Join Bet</button></div></td> 
                      : 
                      <td className={openbetsstyle.jb}><div className={openbetsstyle.div}><button className={openbetsstyle.closed} type='button' title='button' disabled >Bet Closed</button></div></td>}
                      <td>
                        <div className={openbetsstyle.pbet}>
                          <div className={openbetsstyle.pbet_x} >{<FaXmark onClick={(e) => closePBET(e.target)}/>}</div>
                              <h3>Bet Details</h3>
                              <div><p>Below are the details of this <span className={openbetsstyle.obet}>Open Bet</span></p></div>
                                <div className={openbetsstyle.form_g}>
                                  <ul>
                                    <li>
                                        <div>
                                            <div>
                                                Bet Id
                                            </div>
                                            <div className={openbetsstyle.betdet}>
                                              {openbet.uniquebetId.toString()}
                                            </div>
                                        </div>
                                      </li>
                                      <li>
                                        <div>
                                            <div>
                                                Match Id
                                            </div>
                                            <div className={openbetsstyle.betdet}>
                                              {openbet.matchId.toString()}
                                            </div>
                                        </div>
                                      </li>
                                      <li>
                                        <div>
                                            <div>
                                                Match
                                            </div>
                                            <div className={openbetsstyle.betdet}>
                                              {`${openbet.matchfixture.replace(/-/g, ' ')}`}
                                            </div>
                                        </div>
                                      </li>
                                      <li>
                                        <div>
                                            <div>
                                                Max no of participants
                                            </div>
                                            <div className={openbetsstyle.betdet}>
                                              {openbet.totalbetparticipantscount.toString()}
                                            </div>
                                        </div>
                                      </li>
                                      <li>
                                        <div>
                                            <div>
                                                Remaining Participants
                                            </div>
                                            <div className={openbetsstyle.betdet}>
                                              {openbet.remainingparticipantscount.toString()}
                                            </div>
                                        </div>
                                      </li>
                                  </ul>
                                </div>
                                {/* <div className={openbetsstyle.form_g}>
                                    <div className={openbetsstyle.betp}>
                                        Participants joined
                                    </div>
                                    <div className={openbetsstyle.betpp}>
                                      <div>
                                      {openbet.participants}
                                      </div>
                                    </div>
                                </div> */}
                                <div className={openbetsstyle.form_g}>
                                    <label>Which team are you betting on?</label>
                                    <div>
                                        <select title='select' required onChange={(e) => setBetteam(e.target.value)}>
                                            <option> Select team </option>
                                            <option value={`${openbet.matchfixture.split('vs')[0].replace(/-/g, ' ')}`}>{`${openbet.matchfixture.split('vs')[0].replace(/-/g,' ')}`}</option>
                                            <option value={`${openbet.matchfixture.split('vs')[1].replace(/-/g, ' ')}`}>{`${openbet.matchfixture.split('vs')[1].replace(/-/g, ' ')}`}</option>
                                        </select>
                                    </div>
                                    <small id='teamalert'></small>
                                </div>
                                <div className={openbetsstyle.form_g}>
                                    <label>Select Prediction</label>
                                    <div>
                                        <select title='select' required onChange={(e) => setBetPredictn(e.target.value)}>
                                            <option >Select Prediction</option>
                                            <option value='Win'>Win</option>
                                            <option value='Lose'>Lose</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={openbetsstyle.form_g}>
                                    <p>You are joining this bet with {openbet.betamount.toLocaleString()}FRD <span style={{color: '#e28304'}}>${Math.ceil((openbet.betamount * usdprice))+'.00'}</span> </p>
                                </div>
                                <div className={openbetsstyle.error_alert}></div>
                                <div className={openbetsstyle.form_btn}>
                                    <div>
                                      <button type='button' className={openbetsstyle.sub_btn} onClick={(e) => JoinBetNow(e.target,openbet.betId.toNumber(),openbet.betamount,openbet.totalbetparticipantscount.toString(),openbet.openedBy,openbet.remainingparticipantscount.toNumber())} title='button'>Confirm</button>
                                    </div>
                                    {/* <div>
                                      <button type='button' className={openbetsstyle.cancel_btn} onClick={(e) => Cancel(e.target)} title='button'>Cancel</button>
                                    </div> */}
                                </div>
                            </div>
                          <div>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {betData.length > 10 &&
              <div className={openbetsstyle.paginate_btns}>
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
            
          </div>
        </div>
      </div>
    </>
  );
}

export default OpenBets
