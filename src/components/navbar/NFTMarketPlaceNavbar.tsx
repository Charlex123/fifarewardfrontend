import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../contexts/theme-context';
import styles from '../../styles/nftmarketplacenavbar.module.css';

import logo from '../../assets/images/logo.png';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { ethers } from 'ethers';
import ConnectWallet from '../ConnectWalletButton';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useDisconnect } from '@web3modal/ethers5/react';
import { fas, faCheck, faCheckCircle, faChevronDown,faAlignJustify, faCircleDollarToSlot,  faPeopleGroup, faChevronUp, faAngleRight, faFootball, faFootballBall, faRobot, faGamepad } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome, faArtstation } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle, faSoccerBall } from '@fortawesome/free-regular-svg-icons';
library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)

function Navbar() {
    const { theme, setHandleDrawer, changeTheme, isDark } = useContext(ThemeContext);
    const [isNavOpen, setNavOpen] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const [dropdwnIcon1, setDropdownIcon1] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={styles.navlisttoggle}/>);
    const [dropdwnIcon2, setDropdownIcon2] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={styles.navlisttoggle}/>);
    const [dropdwnIcon3, setDropdownIcon3] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={styles.navlisttoggle}/>);
    const [username, setUsername] = useState<string>("");
    const [userId, setUserId] = useState<string>("");  
    const [isLoggedIn,setIsloggedIn] = useState<boolean>(false);
    const { open } = useWeb3Modal();
    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { disconnect } = useDisconnect();

    console.log('chain id',chainId)
    useEffect(() => {

        const udetails = JSON.parse(localStorage.getItem("userInfo")!);
        if(udetails && udetails !== null && udetails !== "") {
        const username_ = udetails.username;  
        if(username_) {
            setUsername(username_);
            setUserId(udetails.userId);
            setIsloggedIn(true);
            
        }
        }else {
            setIsloggedIn(false);
        }
        // Function to handle window resize
        const handleResize = () => {
            // Check the device width and update isNavOpen accordingly
            if (window.innerWidth <= 990) {
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


    // Function to toggle the navigation menu
    const toggleNav = () => {
    setNavOpen(!isNavOpen);
    };

    const toggleIconUp1 = () => {
        setDropdownIcon1(<FontAwesomeIcon icon={faChevronUp} size='lg' className={styles.navlisttoggle}/>)
    }
    const toggleIconUp2 = () => {
        setDropdownIcon2(<FontAwesomeIcon icon={faChevronUp} size='lg' className={styles.navlisttoggle}/>)
    }
    const toggleIconUp3 = () => {
        setDropdownIcon3(<FontAwesomeIcon icon={faChevronUp} size='lg' className={styles.navlisttoggle}/>)
    }

    const toggleIconDown1 = () => {
        setDropdownIcon1(<FontAwesomeIcon icon={faChevronDown} size='lg' className={styles.navlisttoggle}/>)
    }
    const toggleIconDown2 = () => {
        setDropdownIcon2(<FontAwesomeIcon icon={faChevronDown} size='lg' className={styles.navlisttoggle}/>)
    }

    const toggleIconDown3 = () => {
        setDropdownIcon3(<FontAwesomeIcon icon={faChevronDown} size='lg' className={styles.navlisttoggle}/>)
    }


    const shortname = (name:any) => {
        if (name.length > 12) {
            return name.split(' ')[0];
        } else {
            return name;
        }
    };

    console.log('username',username)
    console.log('username',isLoggedIn)
    const navClass = scrolling ? styles.scrolled : '';

    return (
        <nav className={styles.nav}>
            <button title='togglebtn' className={styles.nav_toggle_btn} type='button' onClick={toggleNav}><FontAwesomeIcon icon={faAlignJustify} size='lg' className={styles.toggle_icon}/></button>
            <div className={`${styles.nav_container} ${navClass}`}>
                <div className={styles.logo}>
                <a title='link' href='/' rel='noopener noreferrer'><Image src={logo} alt='logo' className={styles.logoni}/></a>
                </div> 
                
                {isNavOpen && (
                <div className={styles.nav_container_p}>
                <ul className={styles.upa}> 
                    <li><a href='/dapp' rel='noopener noreferrer'>Dapp</a></li>
                    <li><a href='/mining' rel='noopener noreferrer'>Mine</a></li>
                    <li><a href='/stakes' rel='noopener noreferrer'>Stake</a></li>
                    <li><a href='/gaming' rel='noopener noreferrer'>Gaming</a></li>
                    <li><a href='/betting/' rel='noopener noreferrer'>Betting</a></li>
                    <li><a href='/nft/mynfts' rel='noopener noreferrer'>My NFTs</a></li>
                    <li><a href='/nft' rel='noopener noreferrer'> MarketPlace</a></li>
                    <li><a href='/nft/createnft' rel='noopener noreferrer'>Mint</a></li>
                </ul>
                {!isLoggedIn && 
                    <ul className={styles.upa}>
                        <li className={styles.si}><a href='/signin' rel='noopener noreferrer'>Sign In</a></li>
                        <li className={styles.ld}><a href='/register' rel='noopener noreferrer'>Join Us</a></li>
                    </ul>
                }
                <div className={styles.con_btns}>
                {isLoggedIn ? <ConnectWallet /> : ''}
                </div>
                </div>)
                }
            </div>
        </nav>
    );
}

export default Navbar;
