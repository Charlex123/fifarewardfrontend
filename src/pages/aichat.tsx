import React from 'react';
import BackToTop from '../components/back-to-top/back-to-top';
import ChangeTheme from '../components/change-theme/change-theme';
import LoadOpenAIChat from '../components/LoadOpenAIChat';
import Navbar from '../components/navbar/MainNavbar';
import Footer from '../components/Footer';
function AIChat() {

  return (
    <>
        <Navbar/>
        <BackToTop />
        <ChangeTheme />
        <LoadOpenAIChat />
        <Footer/>
    </>
  )
}

export default AIChat
