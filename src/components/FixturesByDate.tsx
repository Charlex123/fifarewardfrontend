import React, { useEffect, useState } from 'react';
import { faCaretDown, faXmark, faSoccerBall  } from "@fortawesome/free-solid-svg-icons";
import leaguefixturestyle from '../styles/leaguefixtures.module.css'
import axios from 'axios';
import dotenv from 'dotenv';
import moment from 'moment';
import Loading from './Loading';
import { Fixture } from './FixtureMetadata';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

const FixturesByDate:React.FC<MyComponentProps> = ({date}) => {
  console.log("fixture date in fbd",date)
  const [fixturesd,setFixturesd] = useState<League[]>();
  const [isleagueloaded,setIsleagueLoaded] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showloading, setShowLoading] = useState<boolean>(false);

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
        const {data} = await axios.post("https://fifareward.onrender.com/api/fixtures/loadfixturesbydate", {
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
                        {fixturesd?.map((league,index) => (
                          <div className={leaguefixturestyle.league_wrap} key={index}>
                            <div className={leaguefixturestyle.tgle} >
                              <div onClick={(e) => toggleFixtures(e.target)}><h3>{league.leagueName}</h3></div>
                              <div className={leaguefixturestyle.drpdwn} onClick={(e) => toggleFixtures(e.target)}>{<FontAwesomeIcon icon={faCaretDown}/>}</div>
                              <div className={leaguefixturestyle.closeicon} onClick={(e) => closeLeagueFixtures(e.target)}>{<FontAwesomeIcon icon={faXmark}/>}</div>
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
                                        <div>{`${fixture.teams.home.name}`} {fixture.goals.home != null ? '('+fixture.goals.home+')' : ''}</div>
                                        <div className={leaguefixturestyle.vs}>Vs</div>
                                        <div>{`${fixture.teams.away.name}`} {fixture.goals.away != null ? '('+fixture.goals.away+')' : ''}</div>
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
                              </div>
                              
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

export default FixturesByDate
