import React, { useEffect, useState } from 'react';
import betstyle from '../styles/loadsampleopenbets.module.css'
import { Bets } from './BetsMetadata';
import { ethers } from 'ethers';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import BettingfeaturesAbi from '../../artifacts/contracts/FRDBettingFeatures.sol/FRDBettingFeatures.json';

type Props = {
    onMount: () => void
}

const LoadSampleOpenBetsData:React.FC<Props> = ({onMount}) => {
      const BettingFeaturesCA = process.env.NEXT_PUBLIC_FRD_BETTING_FEATURES_CA;
      const Wprovider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545");
      const  walletPrivKey: any = process.env.NEXT_PUBLIC_FRD_PRIVATE_KEY as any;
      const { open } = useWeb3Modal();
      const { isConnected } = useWeb3ModalAccount();
      const { walletProvider } = useWeb3ModalProvider();

      const [betData,setBetData] = useState<Bets[]>([]);

        useEffect(() => {
          const loadOpenBets = async () => {
            
              console.log(" helo p")
              let provider, signer;
              if(walletProvider) {
                  provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
                  signer = provider.getSigner();
              }else {
                  const provider = walletProvider as any || Wprovider as any;
                  const wallet = new ethers.Wallet(walletPrivKey as any, provider);
                  signer = provider.getSigner(wallet.address);
              }
              if(signer) {
                try {
                  let BetFeaturescontract = new ethers.Contract(BettingFeaturesCA!, BettingfeaturesAbi, signer);
                  let loadBetsByStatus = await BetFeaturescontract.getBetsByStatus("open");
                  
                  await loadBetsByStatus.forEach(async (element:any) => {
                      console.log(" loaded bets",element)
                     
                      let item: Bets = {
                        betId: element.betId,
                        matchId: element.matchId,
                        uniquebetId: element.uniquebetId,
                        betamount: element.betamount,
                        matchfixture: element.matchfixture,
                        openedBy: element.openedBy,
                        totalbetparticipantscount: element.totalbetparticipantscount,
                        remainingparticipantscount: element.remainingparticipantscount,
                        betstatus: element.betstatus,
                        participants: element.participants,
                        betwinners: element.betwinners,
                        betlosers: element.betlosers,
                      }
                      betData.push(item);
                      setBetData(betData);
                      return item;
                  });
                } catch (error: any) {
                  // setShowAlertDanger(true);
                  console.log("error huipo",error.message)
                  // seterrorMessage('');
                }
              }
          };

          loadOpenBets();

        },[])
        

    return (
        <>
            <div className={betstyle.main}>
                {
                    betData.map((bet,index) => (
                        <ul key={index}>
                          <li>
                            <div>
                              <div><span>Opened By</span></div>
                              <div><span>{bet.openedBy.substring(0,12)+'...'}</span></div>
                            </div>
                          </li>
                          <li>
                          <div>
                            <div>
                              <span>Bet Id</span>
                            </div>
                            <div>
                              <span>{bet.uniquebetId.toNumber()}</span>
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
                              <span>{bet.matchId.toNumber()}</span>
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
                                <span>{bet.matchfixture.replace(/-/g, ' ').toLocaleUpperCase()}</span>
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