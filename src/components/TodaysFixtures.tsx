import React, { useEffect, useState } from 'react';
import leaguefixturestyle from '../styles/leaguefixtures.module.css'
import axios from 'axios';
import dotenv from 'dotenv';
import moment from 'moment';
import Loading from './Loading'
import Image from 'next/image';
import { FaCaretDown, FaXmark } from 'react-icons/fa6';
import { IoIosFootball } from 'react-icons/io';
dotenv.config();
// material
// component

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
      }
    }
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
    leagueCountry: string;
    fixtures: Fixture[];
  }

const TodaysFixtures:React.FC = () => {
  
  const [showloading, setShowLoading] = useState<boolean>(false);
  const [fixturesd,setFixturesd] = useState<League[]>();
  const [isleagueloaded,setIsleagueLoaded] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(2);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    
      (async () => {
        
        try {
          setShowLoading(true);
        
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
        
          const todaysdate = moment().format("YYYY-MM-DD");
          const currentPage = 1; // Default to page 1
          const limit = 10; // Default limit
        
          const { data } = await axios.post<{
            leaguefixtures: {
              _id: number;
              leagueName: string;
              leagueCountry: string;
              fixtures: Fixture[];
            }[];
            totalPages: number;
          }>(
            "https://fifarewardbackend-1.onrender.com/api/fixtures/loadtodaysfixtures",
            {
              todaysdate,
              currentPage,
              limit,
            },
            config
          );
        
          const priorityLeagues = [
            1, 2, 3, 4, 15, 36, 39, 45, 9, 46, 47, 61, 71, 78, 88, 94, 135, 137, 140,
            143, 62, 179, 181, 526, 528, 529, 531, 547, 550, 556,
          ];
        
          // Group fixtures by league and structure as League[]
          const leagueMap = new Map<number, League & { totalPages: number }>();
        
          data.leaguefixtures.forEach((league) => {
            const leagueId = league._id;
            const leagueName = league.leagueName;
            const leagueCountry = league.leagueCountry;
        
            if (!leagueMap.has(leagueId)) {
              leagueMap.set(leagueId, {
                leagueId,
                leagueName,
                leagueCountry,
                fixtures: [],
                totalPages: Math.ceil(league.fixtures.length / limit), // Calculate totalPages for this league
              });
            }
        
            const existingFixtures = leagueMap.get(leagueId)!.fixtures;
            league.fixtures.forEach((fixture) => {
              if (!existingFixtures.some((f) => f.fixture.id === fixture.fixture.id)) {
                existingFixtures.push(fixture);
              }
            });
        
            // Update totalPages for this league based on updated fixtures length
            leagueMap.get(leagueId)!.totalPages = Math.ceil(existingFixtures.length / limit);
          });
        
          const priorityLeagueData: League[] = [];
          const nonPriorityLeagueData: League[] = [];
        
          leagueMap.forEach((league) => {
            console.log("league dsas",league)
            if (priorityLeagues.includes(league.leagueId)) {
              priorityLeagueData.push(league);
            } else {
              nonPriorityLeagueData.push(league);
            }
          });
        
          // Sort priorityLeagueData based on the order in priorityLeagues
          priorityLeagueData.sort(
            (a, b) => priorityLeagues.indexOf(a.leagueId) - priorityLeagues.indexOf(b.leagueId)
          );
        
          // Combine priority leagues followed by non-priority leagues
          const combinedLeagues = [...priorityLeagueData, ...nonPriorityLeagueData];
        
          // Update states
          setIsleagueLoaded(true);
          setFixturesd(combinedLeagues);
          setShowLoading(false);
        
          console.log("Today's league data with total pages:", combinedLeagues);
        } catch (error) {
          console.error("Error while loading today's fixtures:", error);
          setShowLoading(false);
        }
        
        
      })()
      
  
  },[currentPage,limit])

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
    let targetdiv = document.getElementById("fixtureparent") as HTMLElement;
    targetdiv.remove();
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
  
  // Function to render page numbers
 const renderPageNumbers = () => {
  let pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button className={leaguefixturestyle.number} type='button' title='button' key={i} onClick={() => setCurrentPage(i)} disabled={i === currentPage}>
        {i}
      </button>
    );
  }
  return pages;
};

  const gotoPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  

return (
    <>
      {showloading && <Loading />}
      <div className={leaguefixturestyle.main}>
        <div className={leaguefixturestyle.main_in}>
          <div className={leaguefixturestyle.betwrap}>
            <div className={leaguefixturestyle.betwrapin} id='betwrapin'>
              {
                isleagueloaded ? 
                <div>
                    {fixturesd!.length > 0 ? 
                      <div>
                        <div>
                          {fixturesd?.map((league, index) => (
                          <div className={leaguefixturestyle.league_wrap} key={index} id="fixtureparent">
                            <div className={leaguefixturestyle.tgle} >
                              <div onClick={(e) => toggleFixtures(e.target)}><h3>{league.leagueName}</h3></div>
                              <div className={leaguefixturestyle.drpdwn} onClick={(e) => toggleFixtures(e.target)}>{<FaCaretDown />}</div>
                              <div className={leaguefixturestyle.closeicon} onClick={(e) => closeLeagueFixtures(e.target)}>{<FaXmark />}</div>
                            </div>
                            <div className={leaguefixturestyle.league_wrap_in} >
                              {league.fixtures.map(fixture => (
                                <a href={`/betting/${league.leagueCountry.replace(/ /g, '-')}/${league.leagueName.replace(/ /g, '-')}/${fixture.teams.home.name.replace(/ /g, '-')}-vs-${fixture.teams.away.name.replace(/ /g, '-')}/${fixture?.fixture.id}`} key={fixture?.fixture.id}>
                                  <div className={leaguefixturestyle.fixt}>
                                    <div className={leaguefixturestyle.fixt_d_o}>
                                      <div className={leaguefixturestyle.fixt_d}>
                                        <span>Date</span> {`${moment(fixture?.fixture.date).format('DD/MM ddd')}`}
                                      </div>
                                      <div className={leaguefixturestyle.dd}>
                                          <div><span>Time</span>{`${moment(fixture?.fixture.date).format('hh:mm a')}`}</div>
                                          {/* <div className={leaguefixturestyle.fid}>ID: {fixture?.fixture.id}</div> */}
                                      </div>
                                    </div>

                                    <div className={leaguefixturestyle.fixt_tm}>
                                      <div className={leaguefixturestyle.teams}>
                                        <div><Image src={fixture.teams.home.logo} className={leaguefixturestyle.lg} alt="logo" width={25} height={30} style={{float: 'left',paddingRight: '5px', height: '30px'}}/> {`${fixture.teams.home.name}`} {fixture.goals.home != null ? (fixture.goals.home) : '(-)'}</div>
                                        <div className={leaguefixturestyle.vs}>Vs</div>
                                        <div>{fixture.goals.away != null ? (fixture.goals.away) : '(-)'} {`${fixture.teams.away.name}`} <Image src={fixture.teams.away.logo} className={leaguefixturestyle.lg} alt="logo" width={25} height={30} style={{float: 'right',paddingLeft: '5px', height: '30px'}} /></div>
                                      </div>
                                    </div>
                                    <div className={leaguefixturestyle.openbet}>
                                      <div>
                                        <button type='button' title='button'>Open Bet <IoIosFootball /> </button>
                                      </div>
                                    </div>
                                </div>
                                </a>
                              ))}
                              {league.fixtures.length > 10 ? 
                                <div className={leaguefixturestyle.paginate_btns}>
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
                                </div> : ''  
                              }
                            </div>
                          </div>
                        ))}
                        </div>
                        
                    </div> : 
                    <div className={leaguefixturestyle.notfound_p}>
                      <div className={leaguefixturestyle.notfound}>Today's fixtures not found at the moment, please check back later or search by date</div>
                    </div>
                  }
                    
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

export default TodaysFixtures
