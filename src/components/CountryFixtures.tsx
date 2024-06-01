import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import bettingstyle from '../styles/betting.module.css'
import axios from 'axios';
import dotenv from 'dotenv';
import Image from 'next/image';
import footballg from '../assets/images/footballg.jpg';
import footballb from '../assets/images/footaballb.jpg';
import moment from 'moment';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import Calendar from 'react-calendar';
import Loading from './Loading';
import ActionSuccessModal from './ActionSuccess';
import LeagueFixtures from './LeagueFixtures';
import BgOverlay from './BgOverlay';
import LoadSampleOpenBetsData from './LoadOpenBets';
import LoadFixturesSearchResults from './LoadFixturesSearchResults';
import FixturesByDate from './FixturesByDate';
import FixturesByCalenderDate from './FixturesByCalenderDate';
import TodaysFixtures from './TodaysFixtures';
import LiveFixtures from './LiveFixtures';
import { Fixture } from './FixtureMetadata';
import { FaCalendarDays, FaCaretDown, FaCircle, FaMagnifyingGlass, FaXmark } from 'react-icons/fa6';
dotenv.config();
// material
// component

type DateValuePiece = Date | null;
// type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];

interface KeyWordSearch {
  league: {
    name: string,
    country: string
  }
}

interface League {
  leagueId: number;
  leagueName: string;
  leagueCountry: string;
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
interface LeagueC {
  id: number,
  name: string,
  country: string
}

interface CupLeagues {
  count: number,
  league: LeagueC,
}

interface Countries {
  _id: string,
  leagues: CountriesLeagues[],
  totalFixturesInCountry: number
} 

const CountryFixtures:React.FC<{}> = () => {

  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [calendarIcon] = useState<any>(<FaCalendarDays/>);
  const [drpdwnIcon] = useState<any>(<FaCaretDown/>);
  const [today_d,setToday_d] = useState<any>();
  const [today_dm,setToday_dm] = useState<any>();
  const [todaym,setTodaym] = useState<any>();
  const [tomorrow_d,setTomorrow_d] = useState<any>();
  const [tomorrow_dm,setTomorrow_dm] = useState<any>();
  const [tomorrowm,setTomorrowm] = useState<any>();
  const [nexttomorrow_d,setNextTomorrow_d] = useState<any>();
  const [nexttomorrow_dm,setNextTomorrow_dm] = useState<any>();
  const [nexttomorrowm,setNextTomorrowm] = useState<any>();
  const [nextthree_d,setNextThree_d] = useState<any>();
  const [nextthree_dm,setNextThree_dm] = useState<any>();
  const [nextthree_daysm,setNextThree_daysm] = useState<any>();
  const [nextfour_d,setNextFour_d] = useState<any>();
  const [nextfour_dm,setNextFour_dm] = useState<any>();
  const [nextfour_daysm,setNextFour_daysm] = useState<any>();
  const [datevalue, setNewDateValue] = useState<any>(new Date());
  const [showcalender, setShowCalendar] = useState<boolean>(false);
  const [loadedlaguedata,setLoadedLeagueData] = useState<any>(false);
  const [countryfixturesdata, setCountryFixturesdata] = useState<Countries[]>([]);
  const [cupfixturesdata, setCupFixturesdata] = useState<CupLeagues[]>([]);
  const [leaguecomponent,setLeagueComponent] = useState<JSX.Element[]>([]);
  const [loadcount, setLoadCount] = useState<number>(0);
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const [betopensuccess,setBetOpenSuccess] = useState<boolean>(false);
  const [showBgOverlay,setShowBgOverlay] = useState<boolean>(false);
  const [isbetDataLoaded,setIsBetDataLoaded] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [isLoggedIn,setIsloggedIn] = useState<boolean>(false);
  const [showsearchoptions, setShowSearchOptions] = useState<boolean>(false);
  const[searchkeyword,setSearchKeyWord] = useState<string>('');
  const [keywordsearchresults,setKeywordSearchResults] = useState<KeyWordSearch[]>([]);
  const [showloading, setShowLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState(0);

  const router = useRouter();
  const {leaguecountry} = router.query
  console.log("countryparam",leaguecountry)
  const normalizedLeagueCountry = leaguecountry ? String(leaguecountry) : '';

  useEffect(() => {
    try {

      const udetails = JSON.parse(localStorage.getItem("userInfo")!);
      if(!isConnected) {
        open()
      }
      
      const getDates:any = () => {
        let today_d_ = "Today";
        let today_dm_ = moment().format('DD, MMM');
        let today_m = moment().format("YYYY-MM-DD");
        let tomorrow_d_ = moment().add(1,'day').format('ddd');
        let tomorrow_dm_ = moment().add(1,'day').format('DD, MMM');
        let tomorrow_m = moment().add(1,'day').format("YYYY-MM-DD");
        let nexttomorrow_d_ = moment().add(2,'day').format('ddd');
        let nexttomorrow_dm_ = moment().add(2,'day').format('DD, MMM');
        let nexttomorrow_m = moment().add(2,'day').format('YYYY-MM-DD');
        let nextthree_d_ = moment().add(3,'day').format('ddd');
        let nextthree_dm_ = moment().add(3,'day').format('DD, MMM');
        let nextthree_dm = moment().add(3,'day').format('YYYY-MM-DD');
        let nextfour_d_ = moment().add(4,'day').format('ddd');
        let nextfour_dm_ = moment().add(4,'day').format('DD, MMM');
        let nextfour_dm = moment().add(4,'day').format('YYYY-MM-DD');
        
        setToday_d(today_d_);
        setToday_dm(today_dm_);
        setTodaym(today_m);
        setTomorrow_d(tomorrow_d_);
        setTomorrow_dm(tomorrow_dm_);
        setTomorrowm(tomorrow_m)
        setNextTomorrow_d(nexttomorrow_d_);
        setNextTomorrow_dm(nexttomorrow_dm_);
        setNextTomorrowm(nexttomorrow_m)
        setNextThree_d(nextthree_d_);
        setNextThree_dm(nextthree_dm_);
        setNextThree_daysm(nextthree_dm)
        setNextFour_d(nextfour_d_);
        setNextFour_dm(nextfour_dm_);
        setNextFour_daysm(nextfour_dm)
      }
      getDates()

    }catch(error) 
    {
      console.log(error)
    }
    
    if(loadcount <= 0) {
      const fetchData = async () => {
        try {
          setShowLoading(true);
          const config = {
            headers: {
                "Content-type": "application/json"
            }
          }  
          const {data} = await axios.get("https://fifareward.onrender.com/api/fixtures/loadfixtures/", config);
          setCountryFixturesdata(data.fixtures);
          setTotalPages(data.totalPages);
          setShowLoading(false);
          setLoadCount(1);
          console.log("country fixures",data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();

      const fetchcupLeagues = async () => {
        try {
          setShowLoading(true);
          const config = {
            headers: {
                "Content-type": "application/json"
            }
          }  
          const {data} = await axios.get("https://fifareward.onrender.com/api/fixtures/loadcupfixtures/", config);
          setCupFixturesdata(data.fixtures);
          setShowLoading(false);
          setLoadCount(1);
          console.log("cup fixures",data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchcupLeagues();

      const fetchTodayFixtures = async () => {
        try {
          const newleagueComponent = <TodaysFixtures />;
          setLoadedLeagueData(true);
          setLeagueComponent([newleagueComponent].map((component, index) => React.cloneElement(component, { key: index })));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchTodayFixtures();
    }

    
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

  
},[countryfixturesdata,isbetDataLoaded,totalPages,showloading])

const getleagueFixtures = async (leagueid:number, event:any) => {
    try {
      
      if(event.target.getAttribute("title") == "div") {
        let el = event.target.firstElementChild.firstElementChild.nextElementSibling;
        el.style.backgroundColor = (el.style.backgroundColor === "#ffffff") ? "lightblue" : "#ffffff";
      }
      else if(event.target.getAttribute("title") == "span_") {
        event.target.style.backgroundColor = (event.target.style.backgroundColor === "#ffffff") ? "lightblue" : "#ffffff";
      }
      else if(event.target.getAttribute("title") == "span___") {
        console.log(" prev el sibl",event.target.previousElementSibling)
        event.target.previousElementSibling.style.backgroundColor = (event.target.previousElementSibling.style.backgroundColor === "#ffffff") ? "lightblue" : "#ffffff";
      }

      const newleagueComponent = <LeagueFixtures leagueid={leagueid} />;
      setLoadedLeagueData(true);
      setLeagueComponent([
        newleagueComponent,
        ...leaguecomponent.map((component, index) => React.cloneElement(component, { key: index }))
      ]);
    } catch (error) {
      console.log(error)
    }
}

const loadfixturesbyDate = (date:string) => {
  try {
    console.log("fix date madedsf",date)
    const newleagueComponent = <FixturesByDate date={date} />;
    setLoadedLeagueData(true);
    setLeagueComponent([
      newleagueComponent,
      ...leaguecomponent.map((component, index) => React.cloneElement(component, { key: index }))
    ]);
  } catch (error) {
    console.log(error);
  }
}

const onChangeCalenderDate = async (datev:any) => {
  try {
    console.log('load leagues by calender date',moment(datev).format("YYYY-MM-DD"));
    setNewDateValue(datev);
    const newcalDate = moment(datev).format("YYYY-MM-DD");
    const newleagueComponent = <FixturesByCalenderDate date={newcalDate} />;
    setLoadedLeagueData(true);
    setLeagueComponent([
      newleagueComponent,
      ...leaguecomponent.map((component, index) => React.cloneElement(component, { key: index }))
    ]);
    setShowCalendar(false);
  } catch (error) {
    console.log(error)
  }
}

const loadliveFixtures = async (live:string) => {
  try {
    console.log('load live leagues',live)
    const newleagueComponent = <LiveFixtures live={live} />;
    setLoadedLeagueData(true);
    setLeagueComponent([
      newleagueComponent,
      ...leaguecomponent.map((component, index) => React.cloneElement(component, { key: index }))
    ]);
  } catch (error) {
    console.log(error)
  }
}

const toggleShowCalendar = () => {
  setShowCalendar(!showcalender)
}

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

const setLoadOpenBetsDataStatus = () => {
  setIsBetDataLoaded(true)
}

const closeActionModalComp = () => {
  // let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
  // hiw_bgoverlay.style.display = 'none';
  setShowBgOverlay(false);
  setBetOpenSuccess(false);
  router.push('openbets');
}

const goBack = () => {
  router.back()
}

// Import your JSON data here
// const countryfixturescount: Countries[] = countryfixturesdata.fixtures;

const getKeyWordSearchN = async (keyword:any) => {
  // search database and return documents with similar keywords
  setSearchKeyWord(keyword)
  const config = {
      headers: {
          "Content-type": "application/json"
      }
  }  
  const {data} = await axios.post("https://fifareward.onrender.com/api/fixtures/searchfixtbykeyword", {
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
    const newfixtureComponent = <LoadFixturesSearchResults searchkeyword={searchkeyword} />;
    setLoadedLeagueData(true);
    setLeagueComponent([
      newfixtureComponent,
      ...leaguecomponent.map((component, index) => React.cloneElement(component, { key: index }))
    ]);
  } catch (error) {
    console.log(error)
  }
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

const closeBgModal = () => {
  setShowLoading(false);
  setShowBgOverlay(false);
}

  return (
    <>
    {/* {showloading && <Loading/>} */}
    {/* <div className={bettingstyle.hiw_overlay} id="hiw_overlay"></div> */}
    {showBgOverlay && <BgOverlay onChange={closeBgModal}/>}
      <div className={bettingstyle.main}>
        <div className={bettingstyle.search} >
            <div>
              <form>
                  <input type='text' title='input' id="search-input" value={searchkeyword} onClick={handleInputClick} ref={inputRef} onChange={(e) => getKeyWordSearchN(e.target.value)} placeholder='Search by'/><div className={bettingstyle.searchicon}><FaMagnifyingGlass onClick={() => loadSearchResults()}/></div>
                  {showsearchoptions &&
                    <div className={bettingstyle.searchop} ref={divRef} >
                      { keywordsearchresults?.map((result,index) => (
                      <div  key={index}>
                        <div className={bettingstyle.ft2} onClick={(e) => UpKeyWordSearch(e.target)}>
                          {result.league.country}
                        </div>
                        <div className={bettingstyle.sc2} onClick={(e) => UpKeyWordSearch(e.target)}>
                          {result.league.name}
                        </div>
                      </div>
                      ))}
                    </div>
                  }
              </form>
            </div>
          </div>

        <div className={bettingstyle.headbg}>
          <Image src={footballb} alt='banner' style={{width: '100%',height: '120px'}}/>
        </div>
        <div className={bettingstyle.breadcrum}>
          <button type='button' title='button' onClick={goBack}> {'<< '} back</button> <a href='/'>home</a> {'>'} <a href='/betting'>betting</a> {'>'} <a href={`../../../${normalizedLeagueCountry?.replace(/-/g, ' ')}`}>{normalizedLeagueCountry?.replace(/-/g, ' ')}</a>
        </div>
        
        {betopensuccess && 
            <ActionSuccessModal prop='Bet' onChange={closeActionModalComp}/>
        }
        {/* how it works div starts */}
        <div id='howitworks' className={bettingstyle.hiwmain}>
          <div className={bettingstyle.hiw_c}>
            <div className={bettingstyle.hiw_x} onClick={(e) => closeHIWE(e.target)}>{<FaXmark />}</div>
            <h3>How It Works</h3>
            <ul>
              <li>
                <FaCircle className={bettingstyle.hiwlistcircle} /> Sign up with Fifa Rewards using this link <a href='./register'>Join Fifa Reward</a>
              </li>
              <li>
                <FaCircle className={bettingstyle.hiwlistcircle} />  Fund your wallet with FRD or USDT
              </li>
              <li>
                <FaCircle className={bettingstyle.hiwlistcircle} />  Visit the betting page
              </li>
              <li>
                <FaCircle className={bettingstyle.hiwlistcircle} />  Search and choose a game/fixture of your choice
              </li>
              <li>
                <FaCircle className={bettingstyle.hiwlistcircle} />  Click on Open Bets, and open a bet
              </li>
              <li>
                <FaCircle className={bettingstyle.hiwlistcircle} />  Your opened bet will be listed in open bets page <a href='../betting/openbetslists' target='_blank'>open bets</a>
              </li>
              <li>
                <FaCircle className={bettingstyle.hiwlistcircle} />  Look for a bet partner/partners (min. of 2, max. of 6) who will close your bet
              </li>
              <li>
                <FaCircle className={bettingstyle.hiwlistcircle} /> Bet closed after the match, winners (must be a win) get funded according to their bets 
              </li>
              <li>
                <FaCircle className={bettingstyle.hiwlistcircle} /> Draw bets are carried over to a next match
              </li>
            </ul>
          </div>
        </div>
        {/* how it works div starts */}

        <div className={bettingstyle.main_in}>
          <div className={bettingstyle.leagues}>
            <div className={bettingstyle.gf}><h3>Games</h3></div>
            {/* {countryfixturesdata && 
              <div className={bettingstyle.filter}>
              <h3>Filter By</h3>
              <div>
                <div>
                  <button type='button' title='button' onClick={FilterByOpenBets}>Open Bets {'>>'}</button>
                </div>
                <div>
                  <button type='button' title='button' onClick={FilterByClosedBets}>Closed Bets {'>>'}</button>
                </div>
              </div>
            </div> 
            } */}
            {cupfixturesdata ? <div>
              <div className={bettingstyle.fb}><h3>By Leagues/Cups</h3></div>
              {cupfixturesdata.map((league,index) => (
                <div key={index}>
                  <ul>
                    <li>
                        <div className={bettingstyle.lita} onClick={(e) => getleagueFixtures(league.league.id,e)}>
                          <div>{league.league.name}</div>
                          <div>{league.count}</div>
                        </div>
                    </li>
                  </ul>
                </div>
            ))}
              <div className={bettingstyle.fb}><h3>By Country</h3></div>
              {countryfixturesdata.map((country,index) => (
                <div key={index}>
                  <ul>
                    <li>
                        <div className={bettingstyle.leagued}>
                          <div>
                            {country.leagues.map((league,index) => (
                              <div className={bettingstyle.lde} onClick={(e) => getleagueFixtures(league.leagueId,e)} title="div"  key={index}>
                                <div className={bettingstyle.ldef}>
                                  <input type='checkbox' title="input" className={bettingstyle.mchkbox} id={country._id} />
                                  <span className={bettingstyle.chkbox} onClick={(e) => getleagueFixtures(league.leagueId,e)} title="span_">&nbsp;&nbsp;</span> <span onClick={(e) => getleagueFixtures(league.leagueId,e)} title="span___">{league.leagueName}</span>
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
                  <div className={bettingstyle.live}><button type='button' title='button' onClick={() => loadliveFixtures('live')}>Live</button></div>
                  <div className={bettingstyle.today}><button type='button' title='button' onClick={() => loadfixturesbyDate(todaym)}><div className={bettingstyle.dbdate}>{today_d}</div><div>{today_dm}</div></button></div>
                  <div className={bettingstyle.tom}><button type='button' title='button' onClick={() => loadfixturesbyDate(tomorrowm)}><div className={bettingstyle.dbdate}>{tomorrow_d}</div><div>{tomorrow_dm}</div></button></div>
                  <div className={bettingstyle.nxttom}><button type='button' title='button' onClick={() => loadfixturesbyDate(nexttomorrowm)}><div className={bettingstyle.dbdate}>{nexttomorrow_d}</div><div>{nexttomorrow_dm}</div></button></div>
                  <div className={bettingstyle.threed}><button type='button' title='button' onClick={() => loadfixturesbyDate(nextthree_daysm)}><div className={bettingstyle.dbdate}>{nextthree_d}</div><div>{nextthree_dm}</div></button></div>
                  <div className={bettingstyle.fourd}><button type='button' title='button' onClick={() => loadfixturesbyDate(nextfour_daysm)}><div className={bettingstyle.dbdate}>{nextfour_d}</div><div>{nextfour_dm}</div></button></div>
                  <div className={bettingstyle.cal}><button type='button' title='button' onClick={() =>toggleShowCalendar()}>{calendarIcon} {drpdwnIcon}</button></div>
                </div>
                {
                  showcalender && (
                  <div className={bettingstyle.calndar}>
                    <Calendar onChange={onChangeCalenderDate} value={datevalue} showWeekNumbers />
                  </div>
                  )
                }
                
              </div>
              <div className={bettingstyle.betwrap}>
                  <div className={bettingstyle.betwrapin} id='betwrapin'>
                  {/* {istodaysfixturesLoaded ? 
                    <div>
                      {todaysfixtures.map(country => (country.leagues.map(league => (
                        <div className={bettingstyle.league_wrap}>
                          <div className={bettingstyle.tgle} >
                            <div onClick={(e) => toggleFixtures(e.target)}><h3>{league.leagueName}</h3></div>
                            <div className={bettingstyle.drpdwn} onClick={(e) => toggleFixtures(e.target)}>{<FaCaretDown />}</div>
                            <div className={bettingstyle.closeicon} onClick={(e) => closeLeagueFixtures(e.target)}>{<FaXmark />}</div>
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
                      ))))}
                      {todaysfixtures?.map((league,index:number) => (
                      <div className={bettingstyle.league_wrap} key={index}>
                        <div className={bettingstyle.tgle} >
                          <div onClick={(e) => toggleFixtures(e.target)}><h3>{league.leagueName}</h3></div>
                          <div className={bettingstyle.drpdwn} onClick={(e) => toggleFixtures(e.target)}>{<FontAwesomeIcon icon={faCaretDown}/>}</div>
                          <div className={bettingstyle.closeicon} onClick={(e) => closeLeagueFixtures(e.target)}>{<FontAwesomeIcon icon={faXmark}/>}</div>
                        </div>
                        <div className={bettingstyle.league_wrap_in} >
                          {league.fixtures.map(fixture => (
                            <a href={`/betting/${league.leagueCountry.replace(/ /g, '-')}/${league.leagueName.replace(/ /g, '-')}/${fixture.teams.home.name.replace(/ /g, '-')}-vs-${fixture.teams.away.name.replace(/ /g, '-')}/${fixture?.fixture.id}`} key={fixture?.fixture.id}>
                              <div className={bettingstyle.fixt}>
                                <div className={bettingstyle.fixt_d_o}>
                                  <div className={bettingstyle.fixt_d}>
                                    <span>Date</span> {`${moment(fixture?.fixture.date).format('DD/MM ddd')}`}
                                  </div>
                                  <div className={bettingstyle.dd}>
                                      <div><span>Time</span>{`${moment(fixture?.fixture.timestamp).format('hh:mm a')}`}</div>
                                      <div className={bettingstyle.fid}>ID: {fixture?.fixture.id}</div>
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
                                  <div>
                                    <button type='button' title='button'>Open Bet <FontAwesomeIcon icon={faSoccerBall} /> </button>
                                  </div>
                                </div>
                            </div>
                            </a>
                          ))}
                          {todaysfixtures?.length > 0 && 
                            <div className={bettingstyle.paginate_btns}>
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
                    ))}
                    </div>
                  : <div> <Loading/> </div>
                  } */}
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
                
              <div className={bettingstyle.opb}>
              {/* {isbetDataLoaded ? */}
                <div>
                  <h3>Open Bets</h3>
                  {<LoadSampleOpenBetsData onMount={setLoadOpenBetsDataStatus}/>}
                </div> 
                {/* <div><Loading /></div> */}
                {/* } */}
                <div className={bettingstyle.opb_full_list}><a href='../../betting/openbetslists'>See All Open Bets ...</a></div>
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

export default CountryFixtures
