import React, { useEffect, useState } from 'react';
import bettingstyle from '../styles/betting.module.css'
import axios from 'axios';
import dotenv from 'dotenv';
import Image from 'next/image';
import footballg from '../assets/images/footballg.jpg';
import footballb from '../assets/images/footaballb.jpg';
import moment from 'moment';
import Calendar from 'react-calendar';
import Loading from './Loading';
import LeagueFixtures from './LeagueFixtures'
import FixtureByDate from './FixtureByDate'
import { faBasketball, faCaretDown, faChevronLeft, faCircle, faFootball, faFootballBall, faSoccerBall, faTools, faX, faXmark  } from "@fortawesome/free-solid-svg-icons";
import { faBarChart, faCalendar, faCalendarAlt, faFontAwesome, faFutbol } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Overlay } from 'react-bootstrap';
dotenv.config();
// material
// component

type DateValuePiece = Date | null;

type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];

const LoadBetData:React.FC<{}> = () => {

  const [calendarIcon] = useState<any>(<FontAwesomeIcon icon={faCalendarAlt}/>);
  const [drpdwnIcon] = useState<any>(<FontAwesomeIcon icon={faCaretDown}/>);
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
  const [loadedlaguedata,setLoadedLeagueData] = useState<any>(false);
  const [countryfixturesdata, setCountryFixturesdata] = useState<any>('');
  const [leaguecomponent,setLeagueComponent] = useState<JSX.Element[]>([]);

  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string>("");  
  const [isLoggedIn,setIsloggedIn] = useState<boolean>(false);
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

interface League {
  leagueId: number;
  leagueName: string;
  fixtures: Fixture[];
}
interface Country {
  _id: string;
  leagues: League[];
} 

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
      }else {
          setIsloggedIn(false);
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

    }catch(error) 
    {
      console.log(error)
    }

  
},[countryfixturesdata])

const getleagueFixtures = async (leagueid:number) => {
    try {
      const newleagueComponent = <LeagueFixtures leagueid={leagueid} />;
      setLoadedLeagueData(true);
      setLeagueComponent([newleagueComponent, ...leaguecomponent]);
    } catch (error) {
      console.log(error)
    }
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

// Import your JSON data here
const countryfixturescount: Countries[] = countryfixturesdata.fixtures;

  return (
    <>
    <div className={bettingstyle.hiw_overlay} id="hiw_overlay"></div>
      <div className={bettingstyle.main}>
        <div className={bettingstyle.headbg}>
          <Image src={footballb} alt='banner' style={{width: '100%',height: '120px'}}/>
        </div>
        <div className={bettingstyle.breadcrum}>
          <a href='/'>home</a> {'>'} <a href='/betting'>betting</a>
        </div>
        {/* how it works div starts */}
        <div id='howitworks' className={bettingstyle.hiwmain}>
          <div className={bettingstyle.hiw_c}>
            <div className={bettingstyle.hiw_x} onClick={(e) => closeHIWE(e.target)}>{<FontAwesomeIcon icon={faXmark} />}</div>
            <h3>How It Works</h3>
            <ul>
              <li>
                <FontAwesomeIcon icon={faCircle} className={bettingstyle.hiwlistcircle} /> Sign up with Fifa Rewards using this link <a href='fifareward'>Join Fifa Reward</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={bettingstyle.hiwlistcircle} />  Fund your wallet with FRD or USDT
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={bettingstyle.hiwlistcircle} />  Visit the betting page
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={bettingstyle.hiwlistcircle} />  Search and choose a game/fixture of your choice
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={bettingstyle.hiwlistcircle} />  Click on Open Bets, and open a bet
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={bettingstyle.hiwlistcircle} />  Your opened bet will be listed in open bets page <a>open bets</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={bettingstyle.hiwlistcircle} />  Look for a bet partner/partners (min. of 2, max. of 6) who will close your bet
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={bettingstyle.hiwlistcircle} /> Bet closed after the match, winners (must be a win) get funded according to their bets 
              </li>
              <li>
                <FontAwesomeIcon icon={faCircle} className={bettingstyle.hiwlistcircle} /> Draw bets are carried over to a next match
              </li>
            </ul>
          </div>
        </div>
        {/* how it works div starts */}

        <div className={bettingstyle.main_in}>
          <div className={bettingstyle.leagues}>
            <div className={bettingstyle.gf}><h3>Games</h3></div>
            {countryfixturesdata ? <div>
              <div className={bettingstyle.fb}><h3>By Country</h3></div>
              {countryfixturescount.map(country => (
                <div key={country._id}>
                  <ul>
                    <li>
                       <div className={bettingstyle.leagued}>
                          <div>
                            {country.leagues.map(league => (
                              <div className={bettingstyle.lde} onClick={() => getleagueFixtures(league.leagueId)} key={league.leagueId}>
                                <div className={bettingstyle.ldef}>
                                  <input title='title' type='checkbox' className={bettingstyle.mchkbox} id={country._id}/>
                                  <span className={bettingstyle.chkbox}>&nbsp;&nbsp;</span> <span>{league.leagueName}</span>
                                </div>
                                <div className={bettingstyle.ldes}>
                                  ({league.totalFixtures})
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      <div className={bettingstyle.lita} >
                        <div>{country._id}</div>
                        <div>{country.totalFixturesInCountry}</div>
                      </div>
                    </li>
                  </ul>
                </div>
            ))}

            </div>: <div> <Loading /> </div>}
          </div>
          <div className={bettingstyle.betmain}>
              <div className={bettingstyle.betmain_top}>
                <div className={bettingstyle.betmain_top_in}>
                  <div className={bettingstyle.live}><button type='button' title='button' onClick={() => loadfixturesbyDate('live')}>Live</button></div>
                  <div className={bettingstyle.today}><button type='button' title='button' onClick={() => loadfixturesbyDate(today_dm)}><div className={bettingstyle.dbdate}>{today_d}</div><div>{today_dm}</div></button></div>
                  <div className={bettingstyle.tom}><button type='button' title='button' onClick={() => loadfixturesbyDate(tomorrow_dm)}><div className={bettingstyle.dbdate}>{tomorrow_d}</div><div>{tomorrow_dm}</div></button></div>
                  <div className={bettingstyle.nxttom}><button type='button' title='button' onClick={() => loadfixturesbyDate(nexttomorrow_dm)}><div className={bettingstyle.dbdate}>{nexttomorrow_d}</div><div>{nexttomorrow_dm}</div></button></div>
                  <div className={bettingstyle.threed}><button type='button' title='button' onClick={() => loadfixturesbyDate(nextthree_dm)}><div className={bettingstyle.dbdate}>{nextthree_d}</div><div>{nextthree_dm}</div></button></div>
                  <div className={bettingstyle.fourd}><button type='button' title='button' onClick={() => loadfixturesbyDate(nextfour_dm)}><div className={bettingstyle.dbdate}>{nextfour_d}</div><div>{nextfour_dm}</div></button></div>
                  <div className={bettingstyle.cal}><button type='button' title='button' onClick={() =>toggleShowCalendar()}>{calendarIcon} {drpdwnIcon}</button></div>
                </div>
                {
                  showcalender && (
                  <div className={bettingstyle.calndar}>
                    <Calendar onChange={onChange} value={datevalue} showWeekNumbers />
                  </div>
                  )
                }
                
              </div>
              <div className={bettingstyle.betwrap}>
                  <div className={bettingstyle.betwrapin} id='betwrapin'>
                  {countryfixturesdata ? 
                    <div>
                      {/* {betdata.map(country => (country.leagues.map(league => (
                        <div className={bettingstyle.league_wrap}>
                          <div className={bettingstyle.tgle} >
                            <div onClick={(e) => toggleFixtures(e.target)}><h3>{league.leagueName}</h3></div>
                            <div className={bettingstyle.drpdwn} onClick={(e) => toggleFixtures(e.target)}>{<FontAwesomeIcon icon={faCaretDown}/>}</div>
                            <div className={bettingstyle.closeicon} onClick={(e) => closeLeagueFixtures(e.target)}>{<FontAwesomeIcon icon={faXmark}/>}</div>
                          </div>
                          <div className={bettingstyle.league_wrap_in} >
                            {league.fixtures.map(fixture => (
                              <div className={bettingstyle.fixt}>
                                <div className={bettingstyle.fixt_d_o}>
                                  <div className={bettingstyle.fixt_d}>
                                   <span>Date</span> {`${moment(fixture.fixture.date).format('DD/MM ddd')}`}
                                  </div>
                                  <div className={bettingstyle.dd}>
                                      <div><span>Time</span>{`${moment(fixture.fixture.timestamp).format('hh:mm a')}`}</div>
                                      <div className={bettingstyle.fid}>ID: {fixture.fixture.id}</div>
                                  </div>
                                </div>

                                <div className={bettingstyle.fixt_tm}>
                                  <div className={bettingstyle.teams}>
                                    <div>{`${fixture.teams.home.name}`}</div>
                                    <div className={bettingstyle.vs}>Vs</div>
                                    <div>{`${fixture.teams.away.name}`}</div>
                                  </div>
                                </div>
                                <div className={bettingstyle.openbet}>
                                  <div className={bettingstyle.opb_btns_div}>
                                    <div className={bettingstyle.bt_close} onClick={(e) => closeHIWDiv(e.target)}>{<FontAwesomeIcon icon={faXmark}/>}</div>
                                    <div className={bettingstyle.opb_btns}>
                                      <div className={bettingstyle.opb_open} onClick={(e) => placeBet(e.target)}><button type='button' title='button'>Open Bet {<FontAwesomeIcon icon={faFutbol}/>}</button></div>
                                      <div className={bettingstyle.opb_hiw} onClick={(e) => openHIWE(e.target)}><button type='button' title='button'>How It Works {<FontAwesomeIcon icon={faTools} />}</button></div>
                                    </div>
                                  </div>

                                  <div className={bettingstyle.pbet}>
                                    <div className={bettingstyle.pbet_x} >{<FontAwesomeIcon icon={faXmark} onClick={(e) => closePBET(e.target)}/>}</div>
                                    <form>
                                      <h3>Place Bet</h3>
                                      <div className={bettingstyle.form_g}>
                                        <ul>
                                          <li>
                                            <div>
                                                <div>
                                                    Bet Id
                                                </div>
                                                <div>
                                                    987678
                                                </div>
                                            </div>
                                          </li>
                                          <li>
                                            <div>
                                                <div>
                                                    Match Id
                                                </div>
                                                <div>
                                                    {fixture.fixture.id}
                                                </div>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                      <div className={bettingstyle.form_g}>
                                        <label>Enter amount</label>
                                        <input type='number' title='input'/>
                                      </div>
                                      <div className={bettingstyle.form_g}>
                                        <label>Select number of betting participants</label>
                                        <div>
                                          <select title='select'>
                                            <option value='2'>2 Participants</option>
                                            <option value='4'>4 Participants</option>
                                            <option value='6'>6 Participants</option>
                                            <option value='8'>8 Participants</option>
                                            <option value='10'>10 Participants</option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className={bettingstyle.form_g}>
                                        <button type='button' title='button'>Bet</button>
                                      </div>
                                    </form>
                                  </div>

                                  <div>
                                    <button onClick={(e) => firstopenHIW(e.target)}>Open Bet <FontAwesomeIcon icon={faSoccerBall} /> </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))))} */}
                    </div>
                  : <div> <Loading/> </div>
                  }
                  {loadedlaguedata &&
                    <div>
                      {leaguecomponent.map(component => component)}
                    </div> 
                  }
                  </div>
              </div>
          </div>
          <div className={bettingstyle.openbets_list}>
            <div className={bettingstyle.opb_h}>
              <h3>Open Bets</h3>
              <div className={bettingstyle.opb}>
                <ul>
                  <li>
                    <div>
                      <div><span>User</span></div>
                      <div><span>Charles</span></div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <span>Bet Id</span>
                      </div>
                      <div>
                        <span>87788</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <span>Status</span>
                      </div>
                      <div>
                        <span className={bettingstyle.stat}>Open</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <span>Match Id</span>
                      </div>
                      <div>
                        <span>823987</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <span>Teams</span>
                      </div>
                      <div className={bettingstyle.tms}>
                        <div>
                          <span>Man U</span>
                        </div>
                        <div>
                          <span className={bettingstyle.tmsvs}>Vs</span>
                        </div>
                        <div>
                          <span>Chelsea</span>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <ul>
                  <li>
                    <div>
                      <div><span>User</span></div>
                      <div><span>Charles</span></div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <span>Bet Id</span>
                      </div>
                      <div>
                        <span>87788</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <span>Status</span>
                      </div>
                      <div>
                        <span className={bettingstyle.stat}>Open</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <span>Match Id</span>
                      </div>
                      <div>
                        <span>823987</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <span>Teams</span>
                      </div>
                      <div className={bettingstyle.tms}>
                        <div>
                          <span>Man U</span>
                        </div>
                        <div>
                          <span className={bettingstyle.tmsvs}>Vs</span>
                        </div>
                        <div>
                          <span>Chelsea</span>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <ul>
                  <li>
                    <div>
                      <div><span>User</span></div>
                      <div><span>Charles</span></div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <span>Bet Id</span>
                      </div>
                      <div>
                        <span>87788</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <span>Status</span>
                      </div>
                      <div>
                        <span className={bettingstyle.stat}>Open</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <span>Match Id</span>
                      </div>
                      <div>
                        <span>823987</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <span>Teams</span>
                      </div>
                      <div className={bettingstyle.tms}>
                        <div>
                          <span>Man U</span>
                        </div>
                        <div>
                          <span className={bettingstyle.tmsvs}>Vs</span>
                        </div>
                        <div>
                          <span>Chelsea</span>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <ul>
                  <li>
                    <div>
                      <div><span>User</span></div>
                      <div><span>Charles</span></div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <span>Bet Id</span>
                      </div>
                      <div>
                        <span>87788</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <span>Status</span>
                      </div>
                      <div>
                        <span className={bettingstyle.stat}>Open</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <span>Match Id</span>
                      </div>
                      <div>
                        <span>823987</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <div>
                        <span>Teams</span>
                      </div>
                      <div className={bettingstyle.tms}>
                        <div>
                          <span>Man U</span>
                        </div>
                        <div>
                          <span className={bettingstyle.tmsvs}>Vs</span>
                        </div>
                        <div>
                          <span>Chelsea</span>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className={bettingstyle.opb_full_list}><a href='./openbetslist'>See All Open Bets ...</a></div>
                <div className={bettingstyle.opb_banner}>
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

export default LoadBetData
