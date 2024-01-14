import React from 'react';
import BackToTop from '../../components/back-to-top/back-to-top';
import ChangeTheme from '../../components/change-theme/change-theme';
import OpenBets from '../../components/OpenBets';
import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/Footer';

function Betting() {

  return (
    <>
        <Navbar/>
        <BackToTop />
        <ChangeTheme />
        <OpenBets />
        <Footer/>
    </>
  )
}

export default Betting
