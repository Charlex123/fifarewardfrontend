import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import matchstyle from '../styles/match.module.css'
import axios from 'axios';
import dotenv from 'dotenv';
import Image from 'next/image';
import footballg from '../assets/images/footballg.jpg';
import footballb from '../assets/images/footaballb.jpg';
import moment from 'moment';
import Calendar from 'react-calendar';
import Loading from './Loading';
import ActionSuccessModal from './ActionSuccess';
import LoadSampleOpenBetsData from './LoadSampleOpenBets';
import LoginModal from './LoginModal';
import FixtureByDate from './FixtureByDate'
import {  faCaretDown, faCircle,faSoccerBall, faTools, faXmark  } from "@fortawesome/free-solid-svg-icons";
import { faCalendarAlt, faFutbol } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
dotenv.config();
// material
// component

type DateValuePiece = Date | null;

type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];

const MatchData:React.FC<{}> = () => {
  // types.ts



interface Fixture {
  _id: string;
  fid: number;
  fixture: {
      id: number;
      referee: string | null;
      timezone: string;
      date: string;
      timestamp: number;
      periods: {
          first: number;
          second: number;
      };
      venue: {
          id: number | null;
          name: string;
          city: string;
      };
      status: {
          long: string;
          short: string;
          elapsed: number;
      };
  };
  league: {
      id: number;
      name: string;
      country: string;
      logo: string;
      flag: string;
      season: number;
      round: string;
  };
  teams: {
      home: {
        id: number;
        name: string;
        logo: string;
        winner: boolean | null;
      };
      away: {
        id: number;
        name: string;
        logo: string;
        winner: boolean | null;
      };
  };
  goals: {
      home: number;
      away: number;
  };
  score: {
    halftime: { home: number; away: number };
    fulltime: { home: number; away: number };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
  __v: number;
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

const [calendarIcon] = useState<JSX.Element>(<FontAwesomeIcon icon={faCalendarAlt}/>);
const [drpdwnIcon] = useState<JSX.Element>(<FontAwesomeIcon icon={faCaretDown}/>);
const [today_d,setToday_d] = useState<any>();
const [today_dm,setToday_dm] = useState<any>();
const [tomorrow_d,setTomorrow_d] = useState<any>();
const [tomorrow_dm,setTomorrow_dm] = useState<any>();
const [nexttomorrow_d,setNextTomorrow_d] = useState<any>();
const [nexttomorrow_dm,setNextTomorrow_dm] = useState<any>();
const [nextthree_d,setNextThree_d] = useState<any>();
const [nextthree_dm,setNextThree_dm] = useState<any>();
const [nextfour_d,setNextFour_d] = useState<any>();
const [nextfour_dm,setNextFour_dm] = useState<any>();
const [datevalue, onChange] = useState<DateValue>(new Date());
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
const[betAmount,setBetAmount] = useState<string>('5');
const[betParticipantsCount,setBetParticipantsCount] = useState<string>('2');

const [isbetDataLoaded,setIsBetDataLoaded] = useState<boolean>(false);
const router = useRouter();

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
        
        const getDates:any = () => {
            let today_d_ = "Today";
            let today_dm_ = moment().format('DD, MMM');
            let tomorrow_d_ = moment().add(1,'day').format('ddd');
            let tomorrow_dm_ = moment().add(1,'day').format('DD, MMM');
            let nexttomorrow_d_ = moment().add(2,'day').format('ddd');
            let nexttomorrow_dm_ = moment().add(2,'day').format('DD, MMM');
            let nextthree_d_ = moment().add(3,'day').format('ddd');
            let nextthree_dm_ = moment().add(3,'day').format('DD, MMM');
            let nextfour_d_ = moment().add(4,'day').format('ddd');
            let nextfour_dm_ = moment().add(4,'day').format('DD, MMM');
            
            setToday_d(today_d_);
            setToday_dm(today_dm_);
            setTomorrow_d(tomorrow_d_);
            setTomorrow_dm(tomorrow_dm_);
            setNextTomorrow_d(nexttomorrow_d_);
            setNextTomorrow_dm(nexttomorrow_dm_);
            setNextThree_d(nextthree_d_);
            setNextThree_dm(nextthree_dm_);
            setNextFour_d(nextfour_d_);
            setNextFour_dm(nextfour_dm_);
        }
        getDates()

        window.onload = async function() {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }  
            const {data} = await axios.get("http://localhost:9000/api/fixtures/loadfixtures", config);
            setCountryFixturesdata(data);
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

  
},[countryfixturesdata,router.query.match,matchidparam,username])


const handleFormSubmit = async (e:any) => {
    try {
        if(username && username !== null && username !== undefined && username !== '') {
            let inputAlertDiv = document.getElementById("minamuntalert") as HTMLElement;
            let selectAlertDiv = document.getElementById("partpntsalert") as HTMLElement;
            if(betAmount && (parseInt(betAmount) < 5)) {
                inputAlertDiv.innerHTML = "You can't bet below $5";
                return;
            }
            if(!betParticipantsCount) {
                selectAlertDiv.innerHTML = "You must select number of bet participants";
                return;
            }

            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }  
            const {data} = await axios.post("http://localhost:9000/api/users/openbet", {
                betAmount,
                betParticipantsCount,
                matchidparam,
                matchparam,
                username,
                userId
            }, config);
            if(data !== null) {
                console.log('bet data',data)
                let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
                hiw_bgoverlay.style.display = 'block';
                let pDiv = e.parentElement.parentElement.parentElement;
                pDiv.style.display = 'none';
                setBetOpenSuccess(true);
            }
        }else {
            let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
            hiw_bgoverlay.style.display = 'block';
            setShowLoginComp(true);
            e.parentElement.parentElement.parentElement.style.display = 'none';
            console.log('showlogincomp',showloginComp)
        }

        
        console.log('submit handle ran')
    } catch (error) {
      console.log(error)
    }
}
  
const showloginCompNow = () => {
    let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
    hiw_bgoverlay.style.display = 'block';
    setShowLoginComp(true);
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
    router.push('openbetslists');
}

const loadfixturesbyDate = async (date:string) => {
  try {
    console.log('load leagues by date',date)
    const newleagueComponent = <FixtureByDate date={date} />;
    setLoadedLeagueData(true);
    setLeagueComponent([...leaguecomponent, newleagueComponent]);
  } catch (error) {
    console.log(error)
  }
}

const toggleShowCalendar = () => {
setShowCalendar(!showcalender)
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
  let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
  console.log('hiw div',hiwdiv)
  console.log('hiw overlay',hiw_bgoverlay)
  hiwdiv.style.display = (hiwdiv.style.display === 'block') ? 'none' : 'block';
  hiw_bgoverlay.style.display = (hiw_bgoverlay.style.display === 'block') ? 'none' : 'block';

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

  let bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;

  let svg = divId.getAttribute('data-icon');
  let path = divId.getAttribute('fill');
  if((svg !== null && svg !== undefined) || (path !== null && path !== undefined)) {
    if(svg !== null && svg !== undefined) {
      let targetDiv = divId.parentElement.parentElement.parentElement.parentElement.nextElementSibling;
      let targetDivP = divId.parentElement.parentElement.parentElement.parentElement;
      bgoverlay.style.display = 'block';
      targetDivP.style.display = 'none';
      targetDiv.style.display = (targetDiv.style.display === 'block') ? 'none' : 'block';
    }
    if(path !== null && path !== undefined) {
      let targetDiv = divId.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling;
      let targetDivP = divId.parentElement.parentElement.parentElement.parentElement.parentElement;
      bgoverlay.style.display = 'block';
      targetDivP.style.display = 'none';
      targetDiv.style.display = (targetDiv.style.display === 'block') ? 'none' : 'block';
    }
  }else {
    let targetDiv = divId.parentElement.parentElement.parentElement.nextElementSibling;
    let targetDivP = divId.parentElement.parentElement.parentElement;
    bgoverlay.style.display = 'block';
    targetDivP.style.display = 'none';
    targetDiv.style.display = (targetDiv.style.display === 'block') ? 'none' : 'block';
  }
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

const setLoadOpenBetsDataStatus = () => {
  setIsBetDataLoaded(true)
}

const goBack = () => {
  router.back()
}
// Import your JSON data here
const countryfixturescount: Countries[] = countryfixturesdata.fixtures;

  return (
    <>
    <div className={matchstyle.hiw_overlay} id="hiw_overlay"></div>
      <div className={matchstyle.main}>
        <div className={matchstyle.headbg}>
          <Image src={footballb} alt='banner' style={{width: '100%',height: '120px'}}/>
        </div>
        {isparamsLoaded && <div className={matchstyle.breadcrum}>
          <button type='button' title='button' onClick={goBack}> {'<< '} back</button> <a href='/'>home</a> {'>'} <a href='/betting'>betting</a> {'>'} <a href={`/${countryparam}/${leagueparam}/${matchparam}/${matchidparam}`}>{countryparam.replace(/-/g, ' ')} {'>'} {leagueparam.replace(/-/g, ' ')} {'>'} {matchparam.replace(/-/g, ' ')}</a>
        </div> }

        {showloginComp && 
            <div>
                <LoginModal prop={'Open Bet'} onChange={closeLoginModal}/>
            </div>
        }

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
          <div className={matchstyle.leagues}>
            <div className={matchstyle.gf}><h3>Games</h3></div>
            {countryfixturesdata ? <div>
              <div className={matchstyle.fb}><h3>By Country</h3></div>
              {countryfixturescount.map(country => (
                <div key={country._id}>
                  <ul>
                    <li>
                       <div className={matchstyle.leagued}>
                          <div>
                            {country.leagues.map(league => (
                              <div className={matchstyle.lde} key={league.leagueId}>
                                <div className={matchstyle.ldef}>
                                  <input title='title' type='checkbox' disabled className={matchstyle.mchkbox} id={country._id}/>
                                  <span className={matchstyle.chkbox}>&nbsp;&nbsp;</span> <span>{league.leagueName}</span>
                                </div>
                                <div className={matchstyle.ldes}>
                                  ({league.totalFixtures})
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      <div className={matchstyle.lita} >
                        <div>{country._id}</div>
                        <div>{country.totalFixturesInCountry}</div>
                      </div>
                    </li>
                  </ul>
                </div>
            ))}

            </div>: <div> <Loading /> </div>}
          </div>
          <div className={matchstyle.betmain}>
              <div className={matchstyle.betmain_top}>
                <div className={matchstyle.betmain_top_in}>
                  <div className={matchstyle.live}><button type='button' title='button' onClick={() => loadfixturesbyDate('live')}>Live</button></div>
                  <div className={matchstyle.today}><button type='button' title='button' onClick={() => loadfixturesbyDate(today_dm)}><div className={matchstyle.dbdate}>{today_d}</div><div>{today_dm}</div></button></div>
                  <div className={matchstyle.tom}><button type='button' title='button' onClick={() => loadfixturesbyDate(tomorrow_dm)}><div className={matchstyle.dbdate}>{tomorrow_d}</div><div>{tomorrow_dm}</div></button></div>
                  <div className={matchstyle.nxttom}><button type='button' title='button' onClick={() => loadfixturesbyDate(nexttomorrow_dm)}><div className={matchstyle.dbdate}>{nexttomorrow_d}</div><div>{nexttomorrow_dm}</div></button></div>
                  <div className={matchstyle.threed}><button type='button' title='button' onClick={() => loadfixturesbyDate(nextthree_dm)}><div className={matchstyle.dbdate}>{nextthree_d}</div><div>{nextthree_dm}</div></button></div>
                  <div className={matchstyle.fourd}><button type='button' title='button' onClick={() => loadfixturesbyDate(nextfour_dm)}><div className={matchstyle.dbdate}>{nextfour_d}</div><div>{nextfour_dm}</div></button></div>
                  <div className={matchstyle.cal}><button type='button' title='button' onClick={() =>toggleShowCalendar()}>{calendarIcon} {drpdwnIcon}</button></div>
                </div>
                {
                  showcalender && (
                  <div className={matchstyle.calndar}>
                    <Calendar onChange={onChange} value={datevalue} showWeekNumbers />
                  </div>
                  )
                }
                
              </div>
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
                                        <h3>Place Bet</h3>
                                        <div className={matchstyle.form_g}>
                                        <ul>
                                            <li>
                                            <div>
                                                <div>
                                                    Match Id
                                                </div>
                                                <div className={matchstyle.fixid}>
                                                    {matchData?.fixture.id}
                                                </div>
                                            </div>
                                            </li>
                                        </ul>
                                        </div>
                                        <div className={matchstyle.form_g}>
                                            <label>Enter amount ($)</label>
                                            <input type='number' title='input' required onChange={(e) => setBetAmount(e.target.value)} min={5} placeholder={'5'} />
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
                                            <button type='button' onClick={(e) => handleFormSubmit(e.target)} title='button'>Open Bet Now</button>
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
