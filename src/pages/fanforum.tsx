import React from 'react';
import BackToTop from '../components/back-to-top/back-to-top';
// import ChangeTheme from '../components/change-theme/change-theme';
import FanForum from '../components/FanForum';
import Navbar from '../components/navbar/MainNavbar';
// import Footer from '../components/Footer';
function Fanforum() {

  return (
    <>
        <Navbar/>
        <BackToTop />
        {/* <ChangeTheme /> */}
        <FanForum />
        {/* <Footer/> */}
    </>
  )
}

export default Fanforum
