import React from 'react';
import {Navbar} from '../components';
import Footer from '../components/Footer';
import BackToTop from '../components/back-to-top/back-to-top';
import ChangeTheme from '../components/change-theme/change-theme';
import Whitepaper from '../components/Whitepaper';
// import pdfurl from '../assets/pdfs/TAFAXTRA WHITE PAPER 1.0.0.pdf';

function WhitePaperPage() {

  return (
    <>
      <BackToTop />
      <ChangeTheme />
      <Navbar />
      <Whitepaper url= "https://pdfobject.com/pdf/sample.pdf" />
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

export default WhitePaperPage
