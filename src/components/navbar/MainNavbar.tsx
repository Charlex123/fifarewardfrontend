import React, { useContext, useState, useEffect } from 'react';
import styles from '../../styles/navbar.module.css';
import logo from '../../assets/images/logo.png';
import ConnectWallet from '../ConnectWalletButton';
import Image from 'next/image';
import { FaAlignJustify, FaAngleRight, FaArtstation, FaBandcamp, FaChevronDown, FaChevronUp, FaCircleDollarToSlot, FaDiscord, FaFacebook, FaMedium, FaRobot, FaTelegram, FaTwitter, FaUserGroup, FaYoutube } from 'react-icons/fa6';
import { IoIosFootball } from 'react-icons/io';
import { GiGamepad } from 'react-icons/gi';

function Navbar() {
    const [isNavOpen, setNavOpen] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const [dropdwnIcon2, setDropdownIcon2] = useState(<FaChevronDown className={styles.navlisttoggle}/>);
    const [dropdwnIcon3] = useState(<FaChevronDown className={styles.navlisttoggle}/>);
    const [username, setUsername] = useState<string>("");
    const [isMobile,setIsMobile] = useState<boolean>(false);

    useEffect(() => {

        // Function to handle window resize
        const handleResize = () => {
            // Check the device width and update isNavOpen accordingly
            if (window.innerWidth <= 990) {
            setIsMobile(true);
            setNavOpen(false);
            } else {
            setNavOpen(true);
            setIsMobile(false);
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

    const toggleIconUp2 = () => {
        setDropdownIcon2(<FaChevronUp className={styles.navlisttoggle}/>)
    }
    const toggleIconDown2 = () => {
        setDropdownIcon2(<FaChevronDown className={styles.navlisttoggle}/>)
    }

    const toggleIconUp3 = () => {
        setDropdownIcon2(<FaChevronUp className={styles.navlisttoggle}/>)
    }
    const toggleIconDown3 = () => {
        setDropdownIcon2(<FaChevronDown className={styles.navlisttoggle}/>)
    }


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
                    {/* <li className={styles.drpdwnlist} onMouseEnter={toggleIconUp1} onMouseOut={toggleIconDown1}>
                        Welcome {dropdwnIcon1}
                        <ul>
                            <li><a href='/#aboutfrd' rel='noopener noreferrer' > <FaAngleRight className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>About FifaReward</span></a></li>
                            <li><a href='/#roadmap' rel='noopener noreferrer' > <FaAngleRight className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>RoadMap</span></a></li>
                            <li><a href='/whitepaper' rel='noopener noreferrer' > <FaAngleRight className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>White Paper</span></a></li>
                        </ul>
                    </li> */}
                    <li><a href='/whitepaper.pdf' rel='noopener noreferrer'>Whitepaper</a></li>
                    <li><a href='/dapp' rel='noopener noreferrer'>Dapp</a></li>
                    <li><a href='/betting' rel='noopener noreferrer'>Betting </a></li>
                    <li><a href='/fanforum' rel='noopener noreferrer'>Forum</a></li>
                    <li><a href='/stakes' rel='noopener noreferrer'>StakeS</a></li>
                    <li><a href='/farming' rel='noopener noreferrer'>Farm FRD</a></li>
                    <li><a href='/nft' rel='noopener noreferrer'>NFT</a></li>
                    {/* <li><a href='/aichat' rel='noopener noreferrer'>Prediction AI</a></li> */}
                    <li><a href='/gaming' rel='noopener noreferrer'>Gaming </a></li>
                    
                    <li className={styles.drpdwnlist} onMouseEnter={toggleIconUp2} style={{fontSize: '14px', fontWeight: '600'}} onMouseOut={toggleIconDown2}>
                        Features {dropdwnIcon2}
                        <ul>
                            <li><a href='/#aboutfrd' rel='noopener noreferrer' > <FaAngleRight className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>About FifaReward</span></a></li>
                            <li><a href='/#roadmap' rel='noopener noreferrer' > <FaAngleRight className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>RoadMap</span></a></li>
                            <li><a href='/whitepaper.pdf' rel='noopener noreferrer' > <FaAngleRight className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>White Paper</span></a></li>
                            <li><a href='/#frdstaking' rel='noopener noreferrer' ><FaCircleDollarToSlot className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Staking </span></a></li>
                            <li><a href='/#betting' rel='noopener noreferrer' ><FaRobot className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Forum</span></a></li>
                            <li><a href='/#fanforum' rel='noopener noreferrer' ><IoIosFootball className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Betting </span></a></li>
                            <li><a href='/#nft' rel='noopener noreferrer' ><FaArtstation className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>NFT</span></a></li>
                            <li><a href='/#freeclaim' rel='noopener noreferrer' ><GiGamepad className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Gaming </span></a></li>
                            <li><a href='/#referrals' rel='noopener noreferrer' ><FaUserGroup className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Referral</span></a></li>
                        </ul>
                    </li>
                    {isMobile && 
                        <li className={styles.drpdwnlist} onMouseEnter={toggleIconUp3} style={{fontSize: '14px', fontWeight: '600'}} onMouseOut={toggleIconDown3}>
                            Community {dropdwnIcon3}
                            <ul>
                                <li><a href='https://twitter.com/@FRD_Labs' rel='noopener noreferrer' ><FaTwitter className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Twitter</span></a></li>
                                {/* <li><a href='/' rel='noopener noreferrer' ><FaFacebook className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Facebook</span></a></li> */}
                                <li><a href='https://t.me/FifarewardLabs' rel='noopener noreferrer' ><FaTelegram className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Telegram</span></a></li>
                                <li><a href='https://www.geckoterminal.com/bsc/pools/0x6fe537b0ba874eab212bb8321ad17cf6bb3a0afc' rel='noopener noreferrer' ><FaBandcamp className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Coin Gecko</span></a></li>
                                <li><a href='/' rel='noopener noreferrer' ><FaDiscord className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Discord</span></a></li>
                                {/* <li><a href='/' rel='noopener noreferrer' ><FaMedium className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Medium</span></a></li> */}
                                {/* <li><a href='/' rel='noopener noreferrer' ><FaYoutube className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>YouTube</span></a></li> */}
                            </ul>
                        </li>
                    }
                </ul>
                <ConnectWallet />
                </div>)
                }
            </div>
        </nav>
    );
}

export default Navbar;
