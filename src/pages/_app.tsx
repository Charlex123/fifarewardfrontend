import type { AppProps } from "next/app";
import React from 'react';
import ThemeContextProvider from '../contexts/theme-context';
import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Web3ModalProvider } from "../contexts/Web3Modal";
// import '//widgets.api-sports.io/2.0.3/widgets.js';
{/* <script type="module" src="https://widgets.api-sports.io/2.0.3/widgets.js"></script> */}

export const metadata = {
  title: "FifaReward | Bet, Stake, Mine and craeate NFTs of football legends",
  description: "FifaReward | Bet, Stake, Mine and craeate NFTs of football legends",
};

const App = ({ Component, pageProps } : AppProps) => {


  return (
    <>
      <ThemeContextProvider>
        <Web3ModalProvider>
          <Component {...pageProps} />
        </Web3ModalProvider>
      </ThemeContextProvider>
    </>
  );
};

export default App;