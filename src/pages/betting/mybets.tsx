import React from 'react';
import BackToTop from '../../components/back-to-top/back-to-top';
import ChangeTheme from '../../components/change-theme/change-theme';
import MyBets from '../../components/MyBets';
import BettingNavbar from '../../components/navbar/BettingNavBar';
import Footer from '../../components/Footer';
import FooterNavBar from '../../components/FooterNav';
function Betting() {

  return (
    <>
        <BettingNavbar/>
        <BackToTop />
        <ChangeTheme />
        <MyBets />
        <FooterNavBar />
        <Footer/>
    </>
  )
}

export default Betting
