import React, { useEffect, useState } from 'react';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretDown, faChevronLeft  } from "@fortawesome/free-solid-svg-icons";
import bettingstyle from '../styles/betting.module.css'
import axios from 'axios';
import dotenv from 'dotenv';
import moment from 'moment';
import Loading from './Loading';
import LeagueFixtures from './LeagueFixtures'
import { faCalendar, faCalendarAlt, faFontAwesome } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
dotenv.config();
// material
// component

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

  const [fixturesdata, setFixturesdata] = useState<any>('');
  const [showleagueFixtures, setShowleagueFixtures] = useState<any>();
  const [countryName,setCountryName] = useState<string>('');

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
  
  useEffect(() => {
    try {

      const getDates:any = () => {
        let dbfyesterday_d_ = moment().subtract(2,'day').format('ddd');
        let dbfyesterday_dm_ = moment().subtract(2,'day').format('DD, MMM');
        let yesterday_d_ = moment().subtract(1,'day').format('ddd');
        let yesterday_dm_ = moment().subtract(1,'day').format('DD, MMM');
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

      async function loadFixtures() {
        const config = {
            headers: {
                "Content-type": "application/json"
            }
          }  
          const {data} = await axios.get("http://localhost:9000/api/fixtures/loadfixtures", config);
          setFixturesdata(data);
        }
    loadFixtures();
    }catch(error) 
    {
      console.log(error)
    }

  
},[fixturesdata])


// Import your JSON data here
console.log('fixture data',fixturesdata.fixtures)
const betdata: Country[] = fixturesdata.fixtures;

const getleagueFixtures = async (leagueid:any) => {
    
    try {
      const config = {
        headers: {
            "Content-type": "application/json"
        }
      }  
      const {data} = await axios.post("http://localhost:9000/api/leaguefixtures/loadleaguefixtures", {
        leagueid
      }, config);
      setShowleagueFixtures(<LeagueFixtures fixtures={data}/>);
      let betwrapin = document.getElementById("betwrapin");
      console.log('juewsus ',betwrapin)
    } catch (error) {
      console.log(error)
    }
}

  return (
    <>
      <div className={bettingstyle.main}>
        
        <div className={bettingstyle.main_in}>
          <div className={bettingstyle.leagues}>
            <div><h3>Games/Fixtures</h3></div>
            {fixturesdata ? <div>
              <div><h3>Fixtures By Country</h3></div>
              {betdata.map(country => (
                <div key={country._id}>
                  <ul>
                    <li id={country._id}>
                       <div className={bettingstyle.leagued}>
                          <div>
                            {country.leagues.map(league => (
                              <div className={bettingstyle.lde} onClick={() => getleagueFixtures(league.leagueId)}>
                                <div className={bettingstyle.ldef}>
                                  <input type='checkbox' className={bettingstyle.mchkbox} id={country._id}/>
                                  <span className={bettingstyle.chkbox}>&nbsp;&nbsp;</span> <span>{league.leagueName}</span>
                                </div>
                                <div className={bettingstyle.ldes}>
                                  ({league.fixtures.length})
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      <div className={bettingstyle.lita} >
                        <div>{country._id}</div>
                        <div>{country.leagues.map(fixture => fixture.fixtures).reduce((sum,fixture)=> sum + fixture.length,0)}</div>
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
                  <div className={bettingstyle.fix_date}><button>Live</button></div>
                  <div className={bettingstyle.fix_date}><button><div>{today_d}</div><div>{today_dm}</div></button></div>
                  <div className={bettingstyle.fix_date}><button><div>{tomorrow_d}</div><div>{tomorrow_dm}</div></button></div>
                  <div className={bettingstyle.fix_date}><button><div>{nexttomorrow_d}</div><div>{nexttomorrow_dm}</div></button></div>
                  <div className={bettingstyle.fix_date}><button><div>{nextthree_d}</div><div>{nextthree_dm}</div></button></div>
                  <div className={bettingstyle.fix_date}><button><div>{nextfour_d}</div><div>{nextfour_dm}</div></button></div>
                  <div className={bettingstyle.fix_date}><button>{calendarIcon} {drpdwnIcon}</button></div>
                </div>
              </div>
              <div className={bettingstyle.betwrap}>
                  <div className={bettingstyle.betwrapin} id='betwrapin'></div>
              </div>
          </div>
          <div className={bettingstyle.betslip}>
            slip
          </div>
        </div>
      </div>
    </>
  );
}

export default LoadBetData
