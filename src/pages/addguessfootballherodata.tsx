import React from 'react';
import Navbar from '../components/navbar/MainNavbar';
import Footer from '../components/Footer'
import BackToTop from '../components/back-to-top/back-to-top';
// import ChangeTheme from '../components/change-theme/change-theme';
import AddGuessFootballHeroData from '../components/AddGuessFootballHeroData';

function GuessFootballHeroData() {

  return (
    <>
      <BackToTop />
      {/* <ChangeTheme /> */}
      <Navbar />
      <AddGuessFootballHeroData />
      <Footer />
    </>
  )
}


export default GuessFootballHeroData
