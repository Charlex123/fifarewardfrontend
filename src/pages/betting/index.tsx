import React,{useState} from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { Bets } from '../../components/BetsMetadata';
import { useWeb3Modal } from '@web3modal/ethers5/react';
// import Loading from '../../components/Loading';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import BettingAbi from '../../../artifacts/contracts/FRDBetting.sol/FRDBetting.json';
import BackToTop from '../../components/back-to-top/back-to-top';
import ChangeTheme from '../../components/change-theme/change-theme';
import LoadBets from '../../components/Betting';
import BettingNavbar from '../../components/navbar/BettingNavBar';
import Footer from '../../components/Footer';
import FooterNavBar from '../../components/FooterNav';

function Betting() {

  return (
    <>
        <BettingNavbar/>
        <BackToTop />
        <ChangeTheme />
        <LoadBets />
        <FooterNavBar />
        <Footer/>
    </>
  )
}

export default Betting

export const getServerSideProps: GetServerSideProps = async (context) => {
  const BettingCA = process.env.NEXT_PUBLIC_FRD_BETTING_CA;
  let betData: Bets[] = [];
  const Wprovider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545");
  const  walletPrivKey: any = process.env.NEXT_PUBLIC_FRD_PRIVATE_KEY as any;

        const provider = Wprovider as any;
        const wallet = new ethers.Wallet(walletPrivKey as any, provider);
        const signer = provider.getSigner(wallet.address);
        console.log(' s signer',signer)
        if(signer) {
          try {
            console.log(" hop in")
            const Betcontract = new ethers.Contract(BettingCA!, BettingAbi, signer);
            
            const loadBets = await Betcontract.loadAllBets();
            // const loaduserBets = await BetFeaturescontract.getUserBets("0x6df7E51F284963b33CF7dAe442E5719da69c312d");
          // console.log("g user bets",loaduserBets);
            console.log(" loaded bets",loadBets)
            await loadBets.forEach(async (element:any) => {
                
                let betAmt = Math.ceil((element.betamount.toString())/(10**18));
                let item: Bets = {
                  betId: element.betId,
                  matchId: element.matchId,
                  uniqueId: element.uniqueId,
                  username: element.username,
                  matchfixture: element.matchfixture,
                  openedBy: element.openedBy,
                  creationType: element.creationType,
                  participant: element.participant,
                  betamount: betAmt,
                  totalbetparticipantscount: element.totalbetparticipantscount,
                  remainingparticipantscount: element.remainingparticipantscount,
                  prediction: element.prediction,
                  bettingteam: element.bettingteam,
                  betstatus: element.betstatus,
                  participants: element.participants,
                  betwinners: element.betwinners,
                  betlosers: element.betlosers,
                }
                betData.push(item);
                console.log("bet data",betData)
                return item;
            });
          } catch (error: any) {
            console.log(" err",error.message)
          }
          
        }

  return {
      props: {
        betData
      }
  }
}
