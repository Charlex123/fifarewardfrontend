import React from 'react';
import BackToTop from '../../components/back-to-top/back-to-top';
import ChangeTheme from '../../components/change-theme/change-theme';
import OpenBets from '../../components/OpenBets';
import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/Footer';
import FooterNavBar from '../../components/FooterNav';

function OpenBetsList() {

  return (
    <>
        <Navbar/>
        <BackToTop />
        <ChangeTheme />
        <OpenBets />
        <FooterNavBar />
        <Footer/>
    </>
  )
}

export default OpenBetsList
