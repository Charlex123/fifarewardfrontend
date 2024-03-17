import React from 'react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer'
import BackToTop from '../components/back-to-top/back-to-top';
import ChangeTheme from '../components/change-theme/change-theme';
import Airdrop from '../components/Airdrop';

function Airdropping() {

  return (
    <>
      <BackToTop />
      <ChangeTheme />
      <Navbar />
      <Airdrop />
      <Footer />
    </>
  )
}


export default Airdropping
