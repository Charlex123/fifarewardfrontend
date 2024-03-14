import React from 'react';
import Home from '../components/landing/Home';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer'
import BackToTop from '../components/back-to-top/back-to-top';
import ChangeTheme from '../components/change-theme/change-theme';

function HomePage() {

  return (
    <>
      <BackToTop />
      <ChangeTheme />
      <Navbar />
      <Home />
      <Footer />
    </>
  )
}


export default HomePage
