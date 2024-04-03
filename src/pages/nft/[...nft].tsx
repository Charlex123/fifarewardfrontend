import React from 'react';
import BackToTop from '../../components/back-to-top/back-to-top';
import ChangeTheme from '../../components/change-theme/change-theme';
import NFTArtP from '../../components/NftArt';
import Navbar from '../../components/navbar/NFTMarketPlaceNavbar';
import Footer from '../../components/Footer';

function NFTArt() {

  return (
    <>
        <Navbar/>
        <BackToTop />
        <ChangeTheme />
        <NFTArtP />
        <Footer/>
    </>
  )
}

export default NFTArt
