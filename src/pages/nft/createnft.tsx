import React from 'react';
import BackToTop from '../../components/back-to-top/back-to-top';
import ChangeTheme from '../../components/change-theme/change-theme';
import CreateNFT from '../../components/CreateNFT';
import NFTMarKetPlaceNavBar from '../../components/navbar/NFTMarketPlaceNavbar';
import Footer from '../../components/Footer';

function CreateNFTArt() {

  return (
    <>
        <NFTMarKetPlaceNavBar/>
        <BackToTop />
        <ChangeTheme />
        <CreateNFT />
        <Footer/>
    </>
  )
}

export default CreateNFTArt
