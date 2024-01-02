import React from 'react';
import BackToTop from '../components/back-to-top/back-to-top';
import ChangeTheme from '../components/change-theme/change-theme';
import LoadBets from '../components/LoadBets';
import Navbar from '../components/navbar/navbar';
import Footer from '../components/Footer';
function Dapp() {

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

export default Dapp
