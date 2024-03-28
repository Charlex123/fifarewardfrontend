import React from 'react';
import BackToTop from '../../components/back-to-top/back-to-top';
import ChangeTheme from '../../components/change-theme/change-theme';
import CountryFixtures from '../../components/CountryFixtures';
import BettingNavbar from '../../components/navbar/BettingNavBar';
import Footer from '../../components/Footer';
import FooterNavBar from '../../components/FooterNav';
function Country() {

  return (
    <>
        <BettingNavbar/>
        <BackToTop />
        <ChangeTheme />
        <CountryFixtures />
        <FooterNavBar />
        <Footer/>
    </>
  )
}

export default Country
