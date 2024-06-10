import React, { useState, useEffect } from 'react';
import styles from '../../styles/nftmarketplacenavbar.module.css';

import logo from '../../assets/images/logo.png';
import Image from 'next/image';
import ConnectWallet from '../ConnectWalletButton';
import { FaAlignJustify } from 'react-icons/fa6';

function Navbar() {
    const [isNavOpen, setNavOpen] = useState(false);
    const [scrolling, setScrolling] = useState(false);

    useEffect(() => {

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

    const navClass = scrolling ? styles.scrolled : '';

    return (
        <nav className={styles.nav}>
            <button title='togglebtn' className={styles.nav_toggle_btn} type='button' onClick={toggleNav}><FaAlignJustify className={styles.toggle_icon}/></button>
            <div className={`${styles.nav_container} ${navClass}`}>
                <div className={styles.logo}>
                <a title='link' href='/' rel='noopener noreferrer'><Image src={logo} alt='logo' className={styles.logoni}/></a>
                </div> 
                
                {isNavOpen && (
                <div className={styles.nav_container_p}>
                <ul className={styles.upa}> 
                    <li><a href='/dapp' rel='noopener noreferrer'>Dapp</a></li>
                    <li><a href='/betting' rel='noopener noreferrer'>Betting</a></li>
                    <li><a href='/fanforum' rel='noopener noreferrer'> Forum</a></li>
                    <li><a href='/farming' rel='noopener noreferrer'>Farm FRD</a></li>
                    <li><a href='/stakes' rel='noopener noreferrer'>Stakes</a></li>
                    <li><a href='/gaming' rel='noopener noreferrer'>Gaming</a></li>
                    <li><a href='/nft/mynfts' rel='noopener noreferrer'>My NFTs</a></li>
                    <li><a href='/nft' rel='noopener noreferrer'> MarketPlace</a></li>
                    <li><a href='/nft/createnft' rel='noopener noreferrer'>Mint NFT</a></li>
                </ul>
                
                <div className={styles.con_btns}>
                    <ConnectWallet />
                </div>
                </div>)
                }
            </div>
        </nav>
    );
}

export default Navbar;
