import React, { useEffect, useState } from 'react';

import leaguefixturestyle from '../styles/leaguefixtures.module.css'
import axios from 'axios';
import dotenv from 'dotenv';
import moment from 'moment';
import Image from 'next/image';
import Loading from './Loading';
import { Fixture } from './FixtureMetadata';
import { FaCaretDown, FaXmark } from 'react-icons/fa6';
import { IoIosFootball } from 'react-icons/io';
dotenv.config();
// material
// component

type MyComponentProps = {
  date: string;
};

interface League {
  leagueName: string;
  leagueId: number;
  leagueCountry: string;
  fixtures: Fixture[];
}

const FixturesByCalenderDate:React.FC<MyComponentProps> = ({date}) => {
  
  const [showloading, setShowLoading] = useState<boolean>(false);
  const [fixturesd,setFixturesd] = useState<League[]>();
  const [isleagueloaded,setIsleagueLoaded] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
      (async () => {
        const fixturedate = date;
        
        try {
          setShowLoading(true);
          const config = {
            headers: {
                "Content-type": "application/json"
            }
          }  
          const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/fixtures/loadfixturesbydate", {
            fixturedate,
            currentPage,
            limit
          }, config);
          setIsleagueLoaded(true)
          setFixturesd(data.leaguefixtures);
          setTotalPages(data.totalPages);
          setShowLoading(false);
        } catch (error) {
          console.log(error)
        }
      })()
  
  },[date,currentPage,limit])

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
  
  // Function to render page numbers
  const renderPageNumbers = () => {
    let pages = [];
  
    let startPage, endPage;
  
    // Calculate start and end pages to display
    if (totalPages <= 7) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 4) {
        startPage = 1;
        endPage = 7;
      } else if (currentPage >= totalPages - 3) {
        startPage = totalPages - 6;
        endPage = totalPages;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }
    }
  
    // Display first 2 pages if not displayed already
    if (startPage > 2) {
      for (let i = 1; i <= 2; i++) {
        pages.push(
          <button className={leaguefixturestyle.number} type='button' title='button' key={i} onClick={() => setCurrentPage(i)} disabled={i === currentPage}>
            {i}
          </button>
        );
      }
      if (startPage > 3) {
        pages.push(<span key="startDots">...</span>);
      }
    }
  
    // Display pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button className={leaguefixturestyle.number} type='button' title='button' key={i} onClick={() => setCurrentPage(i)} disabled={i === currentPage}>
          {i}
        </button>
      );
    }
  
    // Display last 2 pages if not displayed already
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(<span key="endDots">...</span>);
      }
      for (let i = totalPages - 1; i <= totalPages; i++) {
        pages.push(
          <button className={leaguefixturestyle.number} type='button' title='button' key={i} onClick={() => setCurrentPage(i)} disabled={i === currentPage}>
            {i}
          </button>
        );
      }
    }
  
    return pages;
  };

  const gotoPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  

return (
    <>
    {showloading && <Loading/> }
      <div className={leaguefixturestyle.main}>
        <div className={leaguefixturestyle.main_in}>
          <div className={leaguefixturestyle.betwrap}>
            <div className={leaguefixturestyle.betwrapin} id='betwrapin'>
              {
                isleagueloaded ? 
                <div>
                    {fixturesd!.length > 0 ?
                        <div>
                        {fixturesd?.map((league,index) => (
                          <div className={leaguefixturestyle.league_wrap} key={index}>
                            <div className={leaguefixturestyle.tgle} >
                              <div onClick={(e) => toggleFixtures(e.target)}><h3>{league.leagueName}</h3></div>
                              <div className={leaguefixturestyle.drpdwn} onClick={(e) => toggleFixtures(e.target)}>{<FaCaretDown />}</div>
                              <div className={leaguefixturestyle.closeicon} onClick={(e) => closeLeagueFixtures(e.target)}>{<FaXmark />}</div>
                            </div>
                            <div className={leaguefixturestyle.league_wrap_in} >
                              {league.fixtures.map((fixture,index) => (
                                <a href={`/betting/${league.leagueCountry.replace(/ /g, '-')}/${league.leagueName.replace(/ /g, '-')}/${fixture.teams.home.name.replace(/ /g, '-')}-vs-${fixture.teams.away.name.replace(/ /g, '-')}/${fixture?.fixture.id}`} key={index}>
                                  <div className={leaguefixturestyle.fixt}>
                                    <div className={leaguefixturestyle.fixt_d_o}>
                                      <div className={leaguefixturestyle.fixt_d}>
                                        <span>Date</span> {`${moment(fixture?.fixture.date).format('DD/MM ddd')}`}
                                      </div>
                                      <div className={leaguefixturestyle.dd}>
                                          <div><span>Time</span>{`${moment(fixture?.fixture.timestamp).format('hh:mm a')}`}</div>
                                          <div className={leaguefixturestyle.fid}>ID: {fixture?.fixture.id}</div>
                                      </div>
                                    </div>

                                    <div className={leaguefixturestyle.fixt_tm}>
                                      <div className={leaguefixturestyle.teams}>
                                        <div><Image src={fixture.teams.home.logo} className={leaguefixturestyle.lg} alt="logo" width={25} height={30} style={{float: 'left',paddingRight: '5px'}}/> {`${fixture.teams.home.name}`} {fixture.goals.home != null ? (fixture.goals.home) : ''}</div>
                                        <div className={leaguefixturestyle.vs}>Vs</div>
                                        <div>{fixture.goals.away != null ? (fixture.goals.away) : ''} {`${fixture.teams.away.name}`} <Image src={fixture.teams.away.logo} className={leaguefixturestyle.lg} alt="logo" width={25} height={30} style={{float: 'right',paddingLeft: '5px'}} /></div>
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
                              {fixturesd!.length > 10 ? 
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
                      </div> :
                      <div className={leaguefixturestyle.notfound_p}>
                        <div className={leaguefixturestyle.notfound}>No fixtures found at the moment for {date}, please check back later </div>
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

export default FixturesByCalenderDate
