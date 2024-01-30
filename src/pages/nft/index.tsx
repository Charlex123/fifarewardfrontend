import React from 'react';
import BackToTop from '../../components/back-to-top/back-to-top';
import ChangeTheme from '../../components/change-theme/change-theme';
import NFTMarketPlace from '../../components/NftMarketPlace';
import NFTMarKetPlaceNavBar from '../../components/navbar/NFTMarketPlaceNavbar';
import Footer from '../../components/Footer';

function NFT() {

  return (
    <>
        <NFTMarKetPlaceNavBar/>
        <BackToTop />
        <ChangeTheme />
        <NFTMarketPlace />
        <Footer/>
    </>
  )
}

export default NFT
