import React from 'react';
import BackToTop from '../../components/back-to-top/back-to-top';
import ChangeTheme from '../../components/change-theme/change-theme';
import LoadBets from '../../components/Betting';
import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/Footer';

function Betting() {

  return (
    <>
        <Navbar/>
        <BackToTop />
        <ChangeTheme />
        <LoadBets />
        <Footer/>
    </>
  )
}

export default Betting
