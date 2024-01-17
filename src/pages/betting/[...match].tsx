import React from 'react';
import BackToTop from '../../components/back-to-top/back-to-top';
import ChangeTheme from '../../components/change-theme/change-theme';
import MatchData from '../../components/Match';
import Navbar from '../../components/navbar/navbar';
import FooterNavBar from '../../components/FooterNav';
import Footer from '../../components/Footer';

function Betting() {

  return (
    <>
        <Navbar/>
        <BackToTop />
        <ChangeTheme />
        <MatchData />
        <FooterNavBar/>
        <Footer/>
    </>
  )
}

export default Betting
