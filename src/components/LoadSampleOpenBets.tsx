import React, { useEffect, useState } from 'react';
import betstyle from '../styles/loadsampleopenbets.module.css'
import axios from 'axios';

type Props = {
    onMount: () => void
}

const LoadSampleOpenBetsData:React.FC<Props> = ({onMount}) => {
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
        betstatus: string,
        betresult: string,
        betwinners: string,
        betlosers: string,
        createddate: Date
      }

      const [betData,setBetData] = useState<Bets[]>([]);

        useEffect(() => {
            async function loadOpenBets() {
                const config = {
                    headers: {
                        "Content-type": "application/json"
                    }
                }  
                const {data} = await axios.get("http://localhost:9000/api/bets/load4bets", config);
                if(data !== null && data !== undefined) {
                    setBetData(data.loadbets);
                    onMount()
                }
            }loadOpenBets();
        },[onMount,betData])
        

    return (
        <>
            <div className={betstyle.main}>
                {
                    betData.map((bet,index) => (
                        <ul key={index}>
                          <li>
                            <div>
                              <div><span>Opened By</span></div>
                              <div><span>{bet.openedby}</span></div>
                            </div>
                          </li>
                          <li>
                          <div>
                            <div>
                              <span>Bet Id</span>
                            </div>
                            <div>
                              <span>{bet.betid}</span>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div>
                            <div>
                              <span>Status</span>
                            </div>
                            <div>
                              {bet.betstatus == 'open' ? <span className={betstyle.statopen}>{bet.betstatus}</span> : <span className={betstyle.statclosed}>{bet.betstatus}</span>}
                            </div>
                          </div>
                        </li>
                        <li>
                          <div>
                            <div>
                              <span>Match Id</span>
                            </div>
                            <div>
                              <span>{bet.matchid}</span>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div>
                            <div>
                              <span>Match</span>
                            </div>
                            <div className={betstyle.tms}>
                              <div>
                                <span>{bet.match}</span>
                              </div>
                            </div>
                          </div>
                        </li>
                        </ul>
                      ))
                }
            </div>
        </>
    )
}

export default LoadSampleOpenBetsData;