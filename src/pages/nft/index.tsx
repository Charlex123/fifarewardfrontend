import React from 'react';
import BackToTop from '../../components/back-to-top/back-to-top';
import ChangeTheme from '../../components/change-theme/change-theme';
import NFTMarketPlace from '../../components/NftMarketPlace';
import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/Footer';

function NFT() {

  return (
    <>
        <Navbar/>
        <BackToTop />
        <ChangeTheme />
        <NFTMarketPlace />
        <Footer/>
    </>
  )
}

export default NFT
