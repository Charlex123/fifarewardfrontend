import React, { useEffect, useState } from 'react';
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
import { faCircle, faXmark  } from "@fortawesome/free-solid-svg-icons";
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

interface Bets {
  betid: number,
  betamount: number,
  match: string,
  matchid: number,
  userId: number,
  openedby: string,
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

const [betData,setBetData] = useState<Bets[]>([]);
const [currentPage, setCurrentPage] = useState<number>(1);
const [limit] = useState<number>(10)
const [totalPages, setTotalPages] = useState(0);
const [errorMessage, seterrorMessage] = useState("");
const [error, setError] = useState<boolean>(false);
const [isBetDataLoaded, setIsBetDataLoaded] = useState<boolean>(false)

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
  
  async function loadOpenBets() {
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
      }
  }loadOpenBets();
  
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
            
            if(username === openedby) {

            }

            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }  
            const {data} = await axios.post("http://localhost:9000/api/users/openbet", {
                betAmount,
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

  return (
    <>
    {error && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
    <div className={openbetsstyle.hiw_overlay} id="hiw_overlay"></div>
      <div className={openbetsstyle.main}>
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
            <ActionSuccessModal prop='Bet' onChange={closeActionModalComp}/>
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
                    <th>Bet Amount</th>
                    <th>Match Id</th>
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
                      <td><div className={openbetsstyle.div}>${openbet.betamount}{<span className={openbetsstyle.amtunit}>(10000FRD)</span>}</div></td>
                      <td><div className={openbetsstyle.div}>{openbet.matchid}</div></td>
                      <td><div className={openbetsstyle.div}>{openbet.openedby}</div></td>
                      <td><div className={openbetsstyle.div}>{openbet.totalparticipantscount}</div></td>
                      <td><div className={openbetsstyle.div}>{openbet.participantscount}</div></td>
                      <td><div className={openbetsstyle.div}>{openbet.participants}</div></td>
                      <td><div className={openbetsstyle.div}>{openbet.remainingparticipantscount}</div></td>
                      <td className={openbetsstyle.stat}><div className={openbetsstyle.div}><span className={openbetsstyle.betstatus}>{openbet.betstatus}</span></div></td>
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
                                            Participant joined
                                        </div>
                                        <div className={openbetsstyle.betdet}>
                                          {openbet.participants}
                                        </div>
                                    </div>
                                  </li>
                                  <li>
                                    <div>
                                        <div>
                                            Remainin Participants
                                        </div>
                                        <div className={openbetsstyle.betdet}>
                                          {openbet.remainingparticipantscount}
                                        </div>
                                    </div>
                                  </li>
                              </ul>
                              </div>
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
          </div>
        </div>
      </div>
    </>
  );
}

export default OpenBets
