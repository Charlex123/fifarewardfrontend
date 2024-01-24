import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import openbetsstyle from '../styles/openbets.module.css'
import axios from 'axios';
import dotenv from 'dotenv';
import Image from 'next/image';
import footballb from '../assets/images/footaballb.jpg';
import AlertDanger from './AlertDanger';
import footballg from '../assets/images/footballg.jpg';
import Loading from './Loading';
import ActionSuccessModal from './ActionSuccess';
import LoginModal from './LoginModal';
import { faCircle, faMagnifyingGlass, faXmark  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
dotenv.config();
// material
// component

const OpenBets:React.FC<{}> = () => {
  // types.ts

const [username, setUsername] = useState<string>("");
const [userId, setUserId] = useState<string>("");  
const [isLoggedIn,setIsloggedIn] = useState<boolean>(false);
const [showloginComp,setShowLoginComp] = useState<boolean>(false);
const [betopensuccess,setBetOpenSuccess] = useState<boolean>(false);

const router = useRouter();

interface KeyWordSearch {
  match: string,
  openedby: string,
  betstatus: string
}

interface betcondition {
    bettingteam: string,
    prediction: string
}
interface Betconditions {
  _id: number,
  username: string,
  betcondition: betcondition[]
}

interface Bets {
  betid: number,
  betamount: number,
  match: string,
  matchid: number,
  userId: number,
  openedby: string,
  betcondition: {
    bettingteam: string,
    prediction: string,
  }
  totalparticipantscount: number,
  participantscount: number,
  participants: string,
  remainingparticipantscount: number,
  betstatus: string,
  betresult: string,
  betwinners: string,
  betlosers: string,
  createddate: Date
}
const inputRef = useRef<HTMLInputElement>(null);
const [betData,setBetData] = useState<Bets[]>([]);
const [currentPage, setCurrentPage] = useState<number>(1);
const [limit] = useState<number>(10)
const [totalPages, setTotalPages] = useState(0);
const [errorMessage, seterrorMessage] = useState("");
const [error, setError] = useState<boolean>(false);
const [showloading, setShowLoading] = useState<boolean>(false);
const[bettingteam,setBettingTeam] = useState<string>('');
const[searchkeyword,setSearchKeyWord] = useState<string>('');
const[betprediction,setBetPrediction] = useState<string>('');
const [isBetDataLoaded, setIsBetDataLoaded] = useState<boolean>(false);
const [showsearchoptions, setShowSearchOptions] = useState<boolean>(false);
const [windowloadgetbetruntimes, setwindowloadgetbetruntimes] = useState<number>(0);
const [betconditions,setBetConditions] = useState<Betconditions[]>([]);
const [keywordsearchresults,setKeywordSearchResults] = useState<KeyWordSearch[]>([]);
const [showbetconditions, setShowBetConditions] = useState<boolean>(false);
const [filterbetAmount, setfilterbetamount] = useState<number>(50000);

useEffect(() => {
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
        setShowLoading(true);
        // Your asynchronous code here
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }  
        const {data} = await axios.get(`http://localhost:9000/api/bets/loadbets/${currentPage}/${limit}`, config);
        if(data !== null && data !== undefined) {
            setBetData(data.loadbets);
            setTotalPages(data.totalPages);
            setIsBetDataLoaded(true);
            setwindowloadgetbetruntimes(1);
            setShowLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }else {

  }
  
  let searchOptions = ["Bet Id","Match Id","Match","Username","Opened Bets"];
  let currentSearchOptionIndex = 0;

  // const rotateSearchOption = () => {
  //   let searchinput = document.getElementById("search-input") as HTMLElement;
  //   searchinput.setAttribute('placeholder','Search by '+searchOptions[currentSearchOptionIndex]);

  //   currentSearchOptionIndex = (currentSearchOptionIndex + 1) % searchOptions.length;
  // }

  // const intervalId = setInterval(rotateSearchOption,2000);

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

  const JoinBet = (e: any) => {
    if(username && username !== null && username !== undefined && username !== '') {
      let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
      hiw_bgoverlay.style.display = 'block';
      e.parentElement.parentElement.nextElementSibling.firstElementChild.style.display = 'block';
    }else {
      let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
      hiw_bgoverlay.style.display = 'block';
      setShowLoginComp(true);
      e.parentElement.parentElement.parentElement.style.display = 'none';
      console.log('showlogincomp',showloginComp)
    }
  }

  const JoinBetNow = async (e:any,betId:number,betAmount:any,matchid:number,participantscount:number,openedby:string,status:string,totalparticipantscount:number,participants:string,remainingparticipantscount:number) => {
    try {
        if(username && username !== null && username !== undefined && username !== '') {
          setShowLoading(true);
            let erAlertDv = e.parentElement.parentElement.previousElementSibling;
            if(username === openedby) {
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
            
            if(arrayofparticpants.indexOf(username) !== -1) {
              erAlertDv.innerHTML = "You can't join this bet again!";
              return;
            }else {
              erAlertDv.innerHTML = "";
            }
            
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }  
            
            const {data} = await axios.post("http://localhost:9000/api/bets/joinbet", {
                betAmount,
                betId,
                matchid,
                participantscount,
                bettingteam,
                status,
                totalparticipantscount,
                participants,
                remainingparticipantscount,
                username,
                userId,
                openedby,
                betprediction
            }, config);
            
            if(data !== null) {
                console.log('bet data',data)
                let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
                hiw_bgoverlay.style.display = 'block';
                let pDiv = e.parentElement.parentElement.parentElement;
                pDiv.style.display = 'none';
                setBetOpenSuccess(true);
                setShowLoading(false);
            }
        }else {
            
        }
        
        console.log('submit handle ran')
    } catch (error) {
      console.log(error)
    }
}

const closeLoginModal = () => {
    let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
    hiw_bgoverlay.style.display = 'none';
    setShowLoginComp(false);
}

const closeActionModalComp = () => {
    let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
    hiw_bgoverlay.style.display = 'none';
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
  let svg = divId.getAttribute('data-icon');
  let path = divId.getAttribute('fill');
  
  let bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;

  if(svg !== null && svg !== undefined) {
    bgoverlay.style.display = 'none';
    divId.parentElement.parentElement.style.display = 'none';
  }
  if(path !== null && path !== undefined) {
    bgoverlay.style.display = 'none';
    divId.parentElement.parentElement.parentElement.style.display = 'none';
  }
}

const Cancel = (e:any) => {
  console.log(e)
}

// const setLoadOpenBetsDataStatus = () => {
//   setIsBetDataLoaded(true)
// }

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

const showloginCompNow = () => {
  let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
  hiw_bgoverlay.style.display = 'block';
  setShowLoginComp(true);
}

const goBack = () => {
    router.back()
}

const gotoPage = (pageNumber: number) => {
  setCurrentPage(pageNumber);
};

const closeAlertModal = () => {
  setError(false)
}

const getKeyWordSearchN = async (keyword:any) => {
  // search database and return documents with similar keywords
  setSearchKeyWord(keyword)
  const config = {
      headers: {
          "Content-type": "application/json"
      }
  }  
  const {data} = await axios.post("http://localhost:9000/api/bets/searchbetkeywords", {
      searchkeyword
  }, config);
  if(data) {
    setShowSearchOptions(true);
    setKeywordSearchResults(data.keywordResult);
  }
  
}

const loadSearchResults = async () => {
  // search database and return documents with similar keywords
  setShowLoading(true);
  console.log('search keyword',searchkeyword)
  const config = {
      headers: {
          "Content-type": "application/json"
      }
  }  
  const {data} = await axios.post("http://localhost:9000/api/bets/belistsearch", {
      searchkeyword,
      currentPage,
      limit
  }, config);
  if(data) {
    setShowLoading(false)
    setBetData(data.loadbets);
    setTotalPages(data.totalPages);
    setIsBetDataLoaded(true);
  }
  
}

const viewBetDetails = async(e:any,betId:number) => {
  setShowLoading(true);
  const config = {
      headers: {
          "Content-type": "application/json"
      }
  }  
  const {data} = await axios.post("http://localhost:9000/api/bets/getbetconditions", {
      betId
  }, config);
  if(data) {
    let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
    hiw_bgoverlay.style.display = 'block';
    console.log('bet conditions data',data.betconditions)
    setShowBetConditions(true);
    setShowLoading(false);
    setBetConditions(data.betconditions)
  }
}

const closeBetCondtns = (divId:any) => {
  let svg = divId.getAttribute('data-icon');
  let path = divId.getAttribute('fill');
  let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
  hiw_bgoverlay.style.display = 'none';
  setShowBetConditions(false);
}

const UpKeyWordSearch = (divId: any,match:string,openedby:string) => {
  setSearchKeyWord(divId.innerHTML);
  setShowSearchOptions(false)
}

const handleInputClick = () => {
  // Handle the event when the input is clicked
  setShowSearchOptions(true);
  console.log('Input clicked. Do something!');
};

const FilterByBetAmount = async (event:any) => {
  setShowLoading(true);
  const newValue = event.target.value;
  setfilterbetamount(newValue);
  const config = {
      headers: {
          "Content-type": "application/json"
      }
  }  
  const {data} = await axios.post("http://localhost:9000/api/bets/filterbybetamount", {
      filterbetAmount,
      currentPage,
      limit
  }, config);
  if(data) {
    setShowLoading(false)
    setBetData(data.loadbets);
    setTotalPages(data.totalPages);
    setIsBetDataLoaded(true);
  }
};

const FilterByClosedBets = async () => {
  setShowLoading(true);
  const config = {
    headers: {
          "Content-type": "application/json"
      }
  }  
  const {data} = await axios.post("http://localhost:9000/api/bets/filterbyclosedbets", {
      currentPage,
      limit
  }, config);
  if(data) {
    setShowLoading(false)
    setBetData(data.loadbets);
    setTotalPages(data.totalPages);
    setIsBetDataLoaded(true);
  }
}

const FilterByOpenBets = async () => {

  const config = {
    headers: {
          "Content-type": "application/json"
      }
  }  
  const {data} = await axios.post("http://localhost:9000/api/bets/filterbyopenbets", {
      currentPage,
      limit
  }, config);
  if(data) {
    setShowLoading(false)
    setBetData(data.loadbets);
    setTotalPages(data.totalPages);
    setIsBetDataLoaded(true);
  }
}


  return (
    <>
    {showloading && <Loading/>}
    {error && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
    <div className={openbetsstyle.hiw_overlay} id="hiw_overlay"></div>
      <div className={openbetsstyle.main}>
        <div className={openbetsstyle.search}>
          <div>
            <form>
                <input type='text' title='input' id="search-input" value={searchkeyword} onClick={handleInputClick} ref={inputRef} onChange={(e) => getKeyWordSearchN(e.target.value)} placeholder='Search by'/><div className={openbetsstyle.searchicon}><FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => loadSearchResults()}/></div>
                {showsearchoptions && 
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
                }
            </form>
          </div>
        </div>

        <div className={openbetsstyle.headbg}>
          <Image src={footballb} alt='banner' style={{width: '100%',height: '120px'}}/>
        </div>
        <div className={openbetsstyle.breadcrum}>
          <button type='button' title='button' onClick={goBack}> {'<< '} back</button> 
        </div> 

        {showloginComp && 
            <div>
                <LoginModal prop={'Join Bet'} onChange={closeLoginModal}/>
            </div>
        }

        {betopensuccess && 
            <ActionSuccessModal prop='Bet join' onChange={closeActionModalComp}/>
        }

        {showbetconditions && 
          <div className={openbetsstyle.betcondtns}>
            <div className={openbetsstyle.betcondtns_m}>
              <div className={openbetsstyle.betcondtns_x} onClick={(e) => closeBetCondtns(e.target)}>{<FontAwesomeIcon icon={faXmark} />}</div>
                <h3>Bet participants and their predictions</h3>
                {betconditions.map(betcon => (
                  <div key={betcon._id} className={openbetsstyle.betprd}>
                    <div>
                      <div>{betcon.username}</div>
                    </div>
                    <div>
                      <h3>Prediction</h3>
                      {betcon.betcondition.map(betc => (
                        <div>
                          <div>{betc.bettingteam}</div>
                          <div>{betc.prediction}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
      }
        
        {/* how it works div starts */}
        <div id='howitworks' className={openbetsstyle.hiwmain}>
          <div className={openbetsstyle.hiw_c}>
            <div className={openbetsstyle.hiw_x} onClick={(e) => closeHIWE(e.target)}>{<FontAwesomeIcon icon={faXmark} />}</div>
            <h3>How It Works</h3>
            <ul>
              <li>
                <FontAwesomeIcon icon={faCircle} className={openbetsstyle.hiwlistcircle} /> Sign up with Fifa Rewards using this link <a href='fifareward'>Join Fifa Reward</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={openbetsstyle.hiwlistcircle} />  Fund your wallet with FRD or USDT
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={openbetsstyle.hiwlistcircle} />  Visit the betting page
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={openbetsstyle.hiwlistcircle} />  Search and choose a game/fixture of your choice
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={openbetsstyle.hiwlistcircle} />  Click on Open Bets, and open a bet
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={openbetsstyle.hiwlistcircle} />  Your opened bet will be listed in open bets page <a>open bets</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={openbetsstyle.hiwlistcircle} />  Look for a bet partner/partners (min. of 2, max. of 6) who will close your bet
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={openbetsstyle.hiwlistcircle} /> Bet closed after the match, winners (must be a win) get funded according to their bets 
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={openbetsstyle.hiwlistcircle} /> Draw bets are carried over to a next match
              </li>
            </ul>
          </div>
        </div>
        {/* how it works div starts */}

        <div className={openbetsstyle.main_in}>
          <div className={openbetsstyle.opb_h}>
          {!isLoggedIn &&
            <div className={openbetsstyle.opb_login} id="opb_login">
                <h3>Login To Join Bet</h3>
                <div className={openbetsstyle.opblogin_btns}>
                    <div>
                        <button type='button' title='button' onClick={showloginCompNow}>Login </button>
                    </div>
                    <div>
                        <a href='/register' title='link'>Register </a>
                    </div>
                </div>
            </div>
          }
          {betData.length > 0 && 
            <div className={openbetsstyle.filter}>
              <h3>Filter By</h3>
              <div>
                <div>
                  <button type='button' title='button' onClick={FilterByOpenBets}>Open Bets {'>>'}</button>
                </div>
                <div>
                  <button type='button' title='button' onClick={FilterByClosedBets}>Closed Bets {'>>'}</button>
                </div>
                <div className={openbetsstyle.amountprog}>
                  <div>Bet Amount </div>
                  <div className={openbetsstyle.fba}>{`${filterbetAmount}`} <span>FRD</span></div>
                  <div>
                    <input title='bet amount'
                      type="range"
                      id="horizontalInput"
                      min={50000}
                      max={50000000}
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
                    <th>S/N</th>
                    <th>Bet Id</th>
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
                      <td><div className={openbetsstyle.div}>{index+1}</div></td>
                      <td><div className={openbetsstyle.div}>{openbet.betid}</div></td>
                      <td><div className={openbetsstyle.div}>{openbet.matchid}</div></td>
                      <td><div className={openbetsstyle.div}>{openbet.betamount}{<span className={openbetsstyle.amtunit}>FRD</span>}</div></td>
                      <td><div className={openbetsstyle.div}>{openbet.openedby}</div></td>
                      <td><div className={openbetsstyle.div}>{openbet.totalparticipantscount}</div></td>
                      <td><div className={openbetsstyle.div}>{openbet.participantscount}</div></td>
                      <td><div className={openbetsstyle.div}>({openbet.participants}) <div className={openbetsstyle.bdet}><button type='button' title='button' onClick={(e) => viewBetDetails(e.target,openbet.betid)}> view bet details </button></div></div></td>
                      <td><div className={openbetsstyle.div}>{openbet.remainingparticipantscount}</div></td>
                      <td className={openbetsstyle.stat}><div className={openbetsstyle.div}>{openbet.betstatus == 'open' ? <span className={openbetsstyle.betstatusopened}>{openbet.betstatus}</span> : <span className={openbetsstyle.betstatusclosed}>{openbet.betstatus}</span>}</div></td>
                      {openbet.betstatus === 'open' 
                      ? 
                      <td className={openbetsstyle.jb}><div className={openbetsstyle.div}><button className={openbetsstyle.open} type='button' title='button' onClick={(e) => JoinBet(e.target)}>Join Bet</button></div></td> 
                      : 
                      <td className={openbetsstyle.jb}><div className={openbetsstyle.div}><button className={openbetsstyle.closed} type='button' title='button' disabled >Bet Closed</button></div></td>}
                      <td>
                      <div className={openbetsstyle.pbet}>
                        <div className={openbetsstyle.pbet_x} >{<FontAwesomeIcon icon={faXmark} onClick={(e) => closePBET(e.target)}/>}</div>
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
                                            {openbet.betid}
                                          </div>
                                      </div>
                                    </li>
                                    <li>
                                      <div>
                                          <div>
                                              Match Id
                                          </div>
                                          <div className={openbetsstyle.betdet}>
                                            {openbet.matchid}
                                          </div>
                                      </div>
                                    </li>
                                    <li>
                                      <div>
                                          <div>
                                              Match
                                          </div>
                                          <div className={openbetsstyle.betdet}>
                                            {openbet.match}
                                          </div>
                                      </div>
                                    </li>
                                    <li>
                                      <div>
                                          <div>
                                              Max no of participants
                                          </div>
                                          <div className={openbetsstyle.betdet}>
                                            {openbet.totalparticipantscount}
                                          </div>
                                      </div>
                                    </li>
                                    <li>
                                      <div>
                                          <div>
                                              Remaining Participants
                                          </div>
                                          <div className={openbetsstyle.betdet}>
                                            {openbet.remainingparticipantscount}
                                          </div>
                                      </div>
                                    </li>
                                </ul>
                              </div>
                              <div className={openbetsstyle.form_g}>
                                  <div className={openbetsstyle.betp}>
                                      Participants joined
                                  </div>
                                  <div className={openbetsstyle.betpp}>
                                    <div>
                                    {openbet.participants}
                                    </div>
                                  </div>
                              </div>
                              <div className={openbetsstyle.form_g}>
                                  <label>Which team are you betting on?</label>
                                  <div>
                                      <select title='select' required onChange={(e) => setBetteam(e.target.value)}>
                                          <option value={openbet.match.split('vs')[0]}>{openbet.match.split('vs')[0]}</option>
                                          <option value={openbet.match.split('vs')[1]}>{openbet.match.split('vs')[1]}</option>
                                      </select>
                                  </div>
                                  <small id='teamalert'></small>
                              </div>
                              <div className={openbetsstyle.form_g}>
                                  <label>Select Prediction</label>
                                  <div>
                                      <select title='select' required onChange={(e) => setBetPredictn(e.target.value)}>
                                          <option value='Win'>Win</option>
                                          <option value='Draw'>Draw</option>
                                      </select>
                                  </div>
                              </div>
                              <div className={openbetsstyle.form_g}>
                                  <p>You are joining this bet with {openbet.betamount}FRD</p>
                              </div>
                              <div className={openbetsstyle.error_alert}></div>
                              <div className={openbetsstyle.form_btn}>
                                  <div>
                                    <button type='button' className={openbetsstyle.sub_btn} onClick={(e) => JoinBetNow(e.target,openbet.betid,openbet.betamount,openbet.matchid,openbet.participantscount,openbet.openedby,openbet.betstatus,openbet.totalparticipantscount,openbet.participants,openbet.remainingparticipantscount)} title='button'>Confirm</button>
                                  </div>
                                  <div>
                                    <button type='button' className={openbetsstyle.cancel_btn} onClick={(e) => Cancel(e.target)} title='button'>Cancel</button>
                                  </div>
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
            {betData.length > 0 &&
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
