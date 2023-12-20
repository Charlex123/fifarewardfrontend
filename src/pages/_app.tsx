import type { AppProps } from "next/app";
import React from 'react';
import ThemeContextProvider from '../contexts/theme-context';
import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Web3ModalProvider } from "../contexts/Web3Modal";

export const metadata = {
  title: "TafaXtra Dapp",
  description: "TafaXtra Staking Dapp",
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