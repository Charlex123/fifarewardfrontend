import React from 'react';
import BackToTop from '../../components/back-to-top/back-to-top';
import ChangeTheme from '../../components/change-theme/change-theme';
import MyNfts from '../../components/MyNFTs';
import NFTMarKetPlaceNavBar from '../../components/navbar/NFTMarketPlaceNavbar';
import Footer from '../../components/Footer';

function MyNFT() {

  return (
    <>
        <NFTMarKetPlaceNavBar/>
        <BackToTop />
        <ChangeTheme />
        <MyNfts />
        <Footer/>
    </>
  )
}

export default MyNFT
