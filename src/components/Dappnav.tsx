import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ThemeContext } from '../contexts/theme-context';
import styles from '../styles/dappnav.module.css';
import logo from '../assets/images/logo.png';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { providers } from "ethers";
import { library } from '@fortawesome/fontawesome-svg-core'
import ConnectWallet from './ConnectWalletButton';
import { fas, faCheck, faCheckCircle, faChevronDown,faAlignJustify, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome, } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)



function Navbar() {
    const { theme } = useContext(ThemeContext);
    const [isNavOpen, setNavOpen] = useState(false);
    const [scrolling, setScrolling] = useState(false);const [dropdwnIcon3, setDropdownIcon3] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={styles.navlisttoggle}/>);

    const router = useRouter();

  

    
    useEffect(() => {

        // const provider = window.localStorage.getItem("provider");
        // if (provider) activate(connectors[provider]);

        // Function to handle window resize
        const handleResize = () => {
            // Check the device width and update isNavOpen accordingly
            if (window.innerWidth <= 1100) {
            setNavOpen(false);
            } else {
            setNavOpen(true);
            }
        };

        // Initial check when the component mounts
        handleResize();

        // Add a resize event listener to update isNavOpen when the window is resized
        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts

        const handleScroll = () => {
            if (window.scrollY > 50) {
            setScrolling(true);
            } else {
            setScrolling(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // async function connectAccount() {
    //     if(window.ethereum)  {
    //         // window.web3 = new Web3(web3.currentProvider);
    //         const accounts = await window.ethereum.request({
    //             method: "eth_requestAccounts",
    //         });
    //         // setAccounts(accounts);
    //     } else {
    //         //  Create WalletConnect Provider
    //         const provider = new WalletConnectProvider({
    //             chainId: 57,
    //             rpc:'https://bsc-dataseed.binance.org/'
    //         });
            
    //         //  Enable session (triggers QR Code modal)
    //         await provider.enable();
    
    //         const web3Provider = new providers.Web3Provider(provider);
    //     }
    // }

    // Function to toggle the navigation menu
    const toggleNav = () => {
    setNavOpen(!isNavOpen);
    };

    const toggleIconUp3 = () => {
        setDropdownIcon3(<FontAwesomeIcon icon={faChevronUp} size='lg' className={styles.navlisttoggle}/>)
    }

    const toggleIconDown3 = () => {
        setDropdownIcon3(<FontAwesomeIcon icon={faChevronDown} size='lg' className={styles.navlisttoggle}/>)
    }

    const logout = () => {
      // Simulate a logout action
      localStorage.removeItem('userInfo');
      router.push(`/signin`);
    };

    // const shortname = (name) => {
    //     if (name.length > 12) {
    //         return name.split(' ')[0];
    //     } else {
    //         return name;
    //     }
    // };

    const navClass = scrolling ? styles.scrolled : '';

    return (
        <nav className={styles.nav}>
            {/* <button title='togglebtn' className={styles.nav_toggle_btn} type='button' onClick={toggleNav}><FontAwesomeIcon icon={faAlignJustify} size='lg' className={styles.toggle_icon}/></button> */}
            <div className={`${styles.nav_container} ${navClass}`}>
                <div className={styles.logo}>
                <a href='/' rel='noopener noreferrer'><Image src={logo} alt='logo' className={styles.logoni}/></a>
                </div> 
                
                {isNavOpen && (
                <div className={styles.nav_container_p}>
                <ul className={styles.upa}>
                    <li>
                      <a href='/dapp' rel='noopener noreferrer' className={styles.si}>Dapp</a>
                    </li>
                    <li>
                      <a href='https://pancakeswap.finance/swap?outputCurrency=0x5ae155F89308CA9050f8Ce1C96741BaDd342C26B' rel='noopener noreferrer' className={styles.buytafa}>BUY FRD</a>
                    </li>
                    {/* <li className={styles.drpdwnlist} onMouseEnter={toggleIconUp3} onMouseOut={toggleIconDown3}>
                        <a href='/aichat' rel='noopener noreferrer' className={styles.si}>AI</a>
                    </li> */}
                    <li>
                      <a href='/rewards' rel='noopener noreferrer' className={styles.si}>Rewards </a>
                    </li>
                    <li className={styles.drpdwnlist} onMouseEnter={toggleIconUp3} onMouseOut={toggleIconDown3}>
                        <a href='/stakes' rel='noopener noreferrer' className={styles.si}> Stakes</a>
                    </li>
                    <li>
                      <a href='/gaming' rel='noopener noreferrer' className={styles.si}>Gaming</a>
                    </li>
                    <li>
                      <a href='/betting/mybets' rel='noopener noreferrer' className={styles.si}>Bets</a>
                    </li>
                    <li>
                      <a href='/nft/mynfts' rel='noopener noreferrer' className={styles.si}> NFTs</a>
                    </li>
                    <li className={styles.drpdwnlist} onMouseEnter={toggleIconUp3} onMouseOut={toggleIconDown3}>
                        <a href='/stakes' rel='noopener noreferrer' className={styles.si}>Mine FRD</a>
                    </li>
                    <li>
                      <a href='/referrals' rel='noopener noreferrer' className={styles.si}>Referrals</a>
                    </li>
                    
                    
                </ul>
                <ul className={styles.upa}>
                        <ConnectWallet />
                    <li className={styles.si}><button onClick={logout} type='button'>Logout</button></li>
                </ul>
                </div>)
                }
            </div>
            {/* {isOpen && (<SelectWalletModal isOpen={isOpen} closeWeb3Modal={closeWeb3Modal} />)} */}
        </nav>
    );
}

export default Navbar;
