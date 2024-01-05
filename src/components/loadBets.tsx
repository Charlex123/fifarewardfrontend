import React, { useEffect, useState } from 'react';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretDown, faChevronLeft  } from "@fortawesome/free-solid-svg-icons";
import bettingstyle from '../styles/betting.module.css'
import axios from 'axios';
import dotenv from 'dotenv';
import moment from 'moment';
import { faCalendar, faCalendarAlt, faFontAwesome } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
dotenv.config();
// material
// component

const LoadBetData:React.FC<{}> = () => {

  const [calendarIcon] = useState<any>(<FontAwesomeIcon icon={faCalendarAlt}/>);
  const [drpdwnIcon] = useState<any>(<FontAwesomeIcon icon={faCaretDown}/>);
  const [dbfyesterday_d,setDBFYesterday_d] = useState<any>();
  const [dbfyesterday_dm,setDBFYesterday_dm] = useState<any>();
  const [yesterday_d,setYesterday_d] = useState<any>();
  const [yesterday_dm,setYesterday_dm] = useState<any>();
  const [today_d,setToday_d] = useState<any>();
  const [today_dm,setToday_dm] = useState<any>();
  const [tomorrow_d,setTomorrow_d] = useState<any>();
  const [tomorrow_dm,setTomorrow_dm] = useState<any>();
  const [nexttomorrow_d,setNextTomorrow_d] = useState<any>();
  const [nexttomorrow_dm,setNextTomorrow_dm] = useState<any>();

  const [fixturesdata, setFixturesdata] = useState<any>('');

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
      halftime: {
        home: number;
        away: number;
      };
      fulltime: {
        home: number;
        away: number;
      };
      extratime: {
        home: number | null;
        away: number | null;
      };
      penalty: {
        home: number | null;
        away: number | null;
      };
    };
    __v: number;
  }

  interface LeagueFixtures {
    _id: number;
    leagueName: string;
    fixtures: Fixture[];
    fixtureCount: number;
  }

  interface Country {
    name: string;
    leagues: LeagueFixtures[];
    leagueCount: number;
  }
  
  interface Team {
    id: number;
    name: string;
    logo: string;
    winner: boolean | null;
  }

  interface FixturesData {
    fixtures: LeagueFixtures[];
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
        setDBFYesterday_d(dbfyesterday_d_);
        setDBFYesterday_dm(dbfyesterday_dm_);
        setYesterday_d(yesterday_d_);
        setYesterday_dm(yesterday_dm_);
        setToday_d(today_d_);
        setToday_dm(today_dm_);
        setTomorrow_d(tomorrow_d_);
        setTomorrow_dm(tomorrow_dm_);
        setNextTomorrow_d(nexttomorrow_d_);
        setNextTomorrow_dm(nexttomorrow_dm_);
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
          console.log('fixtures data',data)
        }
    loadFixtures();
    }catch(error) 
    {
      console.log(error)
    }

  
},[fixturesdata])

console.log('fixtures data oop',fixturesdata)
// Import your JSON data here
const dataf: FixturesData = fixturesdata;
console.log('fixtures data oop 00-',dataf)
  return (
    <>
      <div className={bettingstyle.main}>
        
        <div className={bettingstyle.main_in}>
          <div className={bettingstyle.leagues}>
            {fixturesdata ? <div>
              {dataf.fixtures.map(league => (
                <div key={league._id}>
                  <h2>{league.leagueName}</h2>
                  {league.fixtures.map(fixture => (
                    <div key={fixture._id}>
                      <p>{fixture.fixture.venue.name} - {fixture.fixture.date}</p>
                      <p>{fixture.teams.home.name} vs {fixture.teams.away.name}</p>
                      <p>Score: {fixture.score.fulltime.home} - {fixture.score.fulltime.away}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>: <div> Loading </div>}
          </div>
          <div className={bettingstyle.betmain}>
          <div className={bettingstyle.betmain_top}>
              <div className={bettingstyle.betmain_top_in}>
                <div className={bettingstyle.fix_date}><button>Live</button></div>
                <div className={bettingstyle.fix_date}><button><div>{dbfyesterday_d}</div><div>{dbfyesterday_dm}</div></button></div>
                <div className={bettingstyle.fix_date}><button><div>{yesterday_d}</div><div>{yesterday_dm}</div></button></div>
                <div className={bettingstyle.fix_date}><button><div>{today_d}</div><div>{today_dm}</div></button></div>
                <div className={bettingstyle.fix_date}><button><div>{tomorrow_d}</div><div>{tomorrow_dm}</div></button></div>
                <div className={bettingstyle.fix_date}><button><div>{nexttomorrow_d}</div><div>{nexttomorrow_dm}</div></button></div>
                <div className={bettingstyle.fix_date}><button>{calendarIcon} {drpdwnIcon}</button></div>
              </div>
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
