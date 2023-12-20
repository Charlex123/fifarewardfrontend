import React from 'react';
import {
  Landing, Navbar
} from '../components';
import Footer from '../components/Footer'
import BackToTop from '../components/back-to-top/back-to-top';
import ChangeTheme from '../components/change-theme/change-theme';

function HomePage() {

  return (
    <>
      <BackToTop />
      <ChangeTheme />
      <Navbar />
      
      <Landing />
      <Footer />
    </>
  )
}

// export async function getStaticProps() {
//   const res = await fetch('https://dev.to/api/articles?username=charlex123');
//   const data = await res.json();
//   const filteredBlogs = data.sort(() => Math.random() - 0.5);

//   return {
//     props: {
//       blogs: filteredBlogs
//     },
//   };
// }

export default HomePage
