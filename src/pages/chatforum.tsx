import React from 'react';
import BackToTop from '../components/back-to-top/back-to-top';
import ChangeTheme from '../components/change-theme/change-theme';
import ChatForum from '../components/ChatForum';
import Navbar from '../components/navbar/MainNavbar';
import Footer from '../components/Footer';
function Chatforum() {

  return (
    <>
        {/* <Navbar/> */}
        <BackToTop />
        <ChangeTheme />
        <ChatForum />
        {/* <Footer/> */}
    </>
  )
}

export default Chatforum
