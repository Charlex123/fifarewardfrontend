import type { AppProps } from "next/app";
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import ThemeContextProvider from '../contexts/theme-context';
import '../styles/globals.css';
import Loading from "../components/Loading";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Web3ModalProvider } from "../contexts/Web3Modal";
// import '//widgets.api-sports.io/2.0.3/widgets.js';
{/* <script type="module" src="https://widgets.api-sports.io/2.0.3/widgets.js"></script> */}

export const metadata = {
  title: "FifaReward | Bet, Stake, Mine and craeate NFTs of football legends",
  description: "FifaReward | Bet, Stake, Mine and craeate NFTs of football legends",
};

const App = ({ Component, pageProps } : AppProps) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    // Remove event listeners on cleanup
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, []);

  return (
    <>
      {loading && <Loading />}
      <ThemeContextProvider>
        <Web3ModalProvider>
          <Component {...pageProps} />
        </Web3ModalProvider>
      </ThemeContextProvider>
    </>
  );
};

export default App;