import type { AppProps } from "next/app";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ThemeContextProvider from '../contexts/theme-context';
import '../styles/globals.css';
import BgOverlay from "../components/BgOverlay";
import Loading from "../components/Loading";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Web3Modal } from "../contexts/Web3Modal";
import { UserProvider, useUser } from "../contexts/UserContext";

export const metadata = {
  title: "FifaReward | Bet, Stake, Mine and create NFTs of football legends",
  description: "FifaReward | Bet, Stake, Mine and create NFTs of football legends",
};

const App = ({ Component, pageProps }: AppProps) => {
  const [loading, setLoading] = useState(true);
  const [showbgOverlay, setShowBgOverlay] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      console.log('Route change started');
      setLoading(true);
    };

    const handleRouteChangeComplete = () => {
      console.log('Route change completed');
      setLoading(false);
    };

    if (router.isReady) {
      router.events.on('routeChangeStart', handleRouteChangeStart);
      router.events.on('routeChangeComplete', handleRouteChangeComplete);
      router.events.on('routeChangeError', handleRouteChangeComplete);
    }

    // Clean up the event listeners on unmount
    return () => {
      if (router.isReady) {
        router.events.off('routeChangeStart', handleRouteChangeStart);
        router.events.off('routeChangeComplete', handleRouteChangeComplete);
        router.events.off('routeChangeError', handleRouteChangeComplete);
      }
    };
  }, [router.isReady, router.asPath]);

  useEffect(() => {
    if (!router.isReady) {
      setShowBgOverlay(true);
      setLoading(true);
    } else {
      setShowBgOverlay(false);
      setLoading(false);
    }
  }, [router.isReady]);

  const closeBgModal = () => {
    setLoading(false);
    setShowBgOverlay(false);
  };

  return (
    <>
      {loading && <Loading />}
      {showbgOverlay && <BgOverlay onChange={closeBgModal} />}
      <ThemeContextProvider>
        <Web3Modal>
          <UserProvider>
            <UserLoader>
              <Component {...pageProps} />
            </UserLoader>
          </UserProvider>
        </Web3Modal>
      </ThemeContextProvider>
    </>
  );
};

export default App;

const UserLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useUser();

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
};
