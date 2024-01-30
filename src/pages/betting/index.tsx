import React from 'react';
import BackToTop from '../../components/back-to-top/back-to-top';
import ChangeTheme from '../../components/change-theme/change-theme';
import LoadBets from '../../components/Betting';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/Footer';
import FooterNavBar from '../../components/FooterNav';
function Betting() {

  return (
    <>
        <Navbar/>
        <BackToTop />
        <ChangeTheme />
        <LoadBets />
        <FooterNavBar />
        <Footer/>
    </>
  )
}

export default Betting
