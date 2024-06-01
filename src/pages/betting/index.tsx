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