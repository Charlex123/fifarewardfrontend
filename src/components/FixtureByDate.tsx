import React, { useEffect, useState } from 'react';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretDown, faChevronLeft, faXmark, faSoccerBall  } from "@fortawesome/free-solid-svg-icons";
import leaguefixturestyle from '../styles/leaguefixtures.module.css'
import axios from 'axios';
import dotenv from 'dotenv';
import moment from 'moment';
import Loading from './Loading'
import { faCalendar, faCalendarAlt, faFontAwesome } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
dotenv.config();
// material
// component

type MyComponentProps = {
  date: string;
};
interface Fixture {
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
    leagueName: string;
    leagueId: number;
    country: string;
    fixtures: Fixture[];
  }

const LoadLeagueFixtures:React.FC<MyComponentProps> = ({date}) => {
  console.log()
  const [fixturesd,setFixturesd] = useState<League[]>();
  const [isleagueloaded,setIsleagueLoaded] = useState<boolean>(false);
  (async (leagueid) => {
    try {
      const config = {
        headers: {
            "Content-type": "application/json"
        }
      }  
      const {data} = await axios.post("http://localhost:9000/api/fixtures/loadleaguefixtures", {
        date
      }, config);
      setIsleagueLoaded(true)
      setFixturesd(data.leaguefixtures);
      // console.log('fix id ures',fixturesd)
    } catch (error) {
      console.log(error)
    }
  })(date)


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
  
  
return (
    <>
      <div className={leaguefixturestyle.main}>
        <div className={leaguefixturestyle.main_in}>
          <div className={leaguefixturestyle.betwrap}>
            <div className={leaguefixturestyle.betwrapin} id='betwrapin'>
              {
                isleagueloaded ? 
                <div>
                    {fixturesd?.map(league => (
                      <div className={leaguefixturestyle.league_wrap} key={league.leagueId}>
                        <div className={leaguefixturestyle.tgle} >
                          <div onClick={(e) => toggleFixtures(e.target)}><h3>{league.leagueName}</h3></div>
                          <div className={leaguefixturestyle.drpdwn} onClick={(e) => toggleFixtures(e.target)}>{<FontAwesomeIcon icon={faCaretDown}/>}</div>
                          <div className={leaguefixturestyle.closeicon} onClick={(e) => closeLeagueFixtures(e.target)}>{<FontAwesomeIcon icon={faXmark}/>}</div>
                        </div>
                        <div className={leaguefixturestyle.league_wrap_in} >
                          {league.fixtures.map(fixture => (
                            <a href={`/betting/${league.country.replace(/ /g, '-')}/${league.leagueName.replace(/ /g, '-')}/${fixture.teams.home.name.replace(/ /g, '-')}-vs-${fixture.teams.away.name.replace(/ /g, '-')}/${fixture?.fixture.id}`} key={fixture.fixture?.id}>
                              <div className={leaguefixturestyle.fixt}>
                                <div className={leaguefixturestyle.fixt_d_o}>
                                  <div className={leaguefixturestyle.fixt_d}>
                                    <span>Date</span> {`${moment(fixture.fixture?.date).format('DD/MM ddd')}`}
                                  </div>
                                  <div className={leaguefixturestyle.dd}>
                                      <div><span>Time</span>{`${moment(fixture.fixture?.timestamp).format('hh:mm a')}`}</div>
                                      <div className={leaguefixturestyle.fid}>ID: {fixture?.fixture.id}</div>
                                  </div>
                                </div>

                                <div className={leaguefixturestyle.fixt_tm}>
                                  <div className={leaguefixturestyle.teams}>
                                    <div>{`${fixture.teams.home.name}`}</div>
                                    <div className={leaguefixturestyle.vs}>Vs</div>
                                    <div>{`${fixture.teams.away.name}`}</div>
                                  </div>
                                </div>
                                <div className={leaguefixturestyle.openbet}>
                                  <div>
                                    <button type='button' title='button'>Open Bet <FontAwesomeIcon icon={faSoccerBall} /> </button>
                                  </div>
                                </div>
                            </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                </div> : 
                <div><Loading /></div>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoadLeagueFixtures
