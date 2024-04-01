import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../contexts/theme-context';
import styles from '../../styles/navbar.module.css';
import logo from '../../assets/images/logo.png';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas, faCheck, faCheckCircle, faChevronDown,faAlignJustify, faCircleDollarToSlot, faGift, faPeopleGroup, faChevronUp, faAngleRight, faFootball, faFootballBall, faRobot, faGamepad } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome, faArtstation } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle, faSoccerBall } from '@fortawesome/free-regular-svg-icons';
library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)

function Navbar() {
    const { theme, setHandleDrawer, changeTheme, isDark } = useContext(ThemeContext);
    const [isNavOpen, setNavOpen] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const [dropdwnIcon2, setDropdownIcon2] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={styles.navlisttoggle}/>);
    const [username, setUsername] = useState<string>("");
    const [userId, setUserId] = useState<string>("");  
    const [isLoggedIn,setIsloggedIn] = useState<boolean>(false);

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

    const toggleIconUp2 = () => {
        setDropdownIcon2(<FontAwesomeIcon icon={faChevronUp} size='lg' className={styles.navlisttoggle}/>)
    }
    const toggleIconDown2 = () => {
        setDropdownIcon2(<FontAwesomeIcon icon={faChevronDown} size='lg' className={styles.navlisttoggle}/>)
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
                    {/* <li className={styles.drpdwnlist} onMouseEnter={toggleIconUp1} onMouseOut={toggleIconDown1}>
                        Welcome {dropdwnIcon1}
                        <ul>
                            <li><a href='/#aboutfrd' rel='noopener noreferrer' > <FontAwesomeIcon icon={faAngleRight} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>About FifaReward</span></a></li>
                            <li><a href='/#roadmap' rel='noopener noreferrer' > <FontAwesomeIcon icon={faAngleRight} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>RoadMap</span></a></li>
                            <li><a href='/whitepaper' rel='noopener noreferrer' > <FontAwesomeIcon icon={faAngleRight} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>White Paper</span></a></li>
                        </ul>
                    </li> */}
                    {isLoggedIn &&
                        <li><a href='/dapp' rel='noopener noreferrer'>Dapp</a></li>
                    }
                    <li><a href='/airdrop' rel='noopener noreferrer'>AirDrop</a></li>
                    <li><a href='/stakes' rel='noopener noreferrer'>Stake</a></li>
                    <li><a href='/mining' rel='noopener noreferrer'>Mine</a></li>
                    <li><a href='/nft' rel='noopener noreferrer'>NFT Market Place</a></li>
                    {/* <li><a href='/aichat' rel='noopener noreferrer'>Prediction AI</a></li> */}
                    <li><a href='/betting' rel='noopener noreferrer'>Betting </a></li>
                    <li><a href='/gaming' rel='noopener noreferrer'>Gaming </a></li>
                    
                    <li className={styles.drpdwnlist} onMouseEnter={toggleIconUp2} onMouseOut={toggleIconDown2}>
                        Features {dropdwnIcon2}
                        <ul>
                            <li><a href='/#aboutfrd' rel='noopener noreferrer' > <FontAwesomeIcon icon={faAngleRight} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>About FifaReward</span></a></li>
                            <li><a href='/#roadmap' rel='noopener noreferrer' > <FontAwesomeIcon icon={faAngleRight} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>RoadMap</span></a></li>
                            <li><a href='/whitepaper' rel='noopener noreferrer' > <FontAwesomeIcon icon={faAngleRight} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>White Paper</span></a></li>
                            <li><a href='/#frdstaking' rel='noopener noreferrer' ><FontAwesomeIcon icon={faCircleDollarToSlot} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Staking Rewards</span></a></li>
                            <li><a href='/#betting' rel='noopener noreferrer' ><FontAwesomeIcon icon={faRobot} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Football AI</span></a></li>
                            <li><a href='/#aichat' rel='noopener noreferrer' ><FontAwesomeIcon icon={faSoccerBall} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Betting </span></a></li>
                            <li><a href='/#nft' rel='noopener noreferrer' ><FontAwesomeIcon icon={faArtstation} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>NFT Market Place</span></a></li>
                            <li><a href='/#freeclaim' rel='noopener noreferrer' ><FontAwesomeIcon icon={faGamepad} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Gaming </span></a></li>
                            <li><a href='/#referrals' rel='noopener noreferrer' ><FontAwesomeIcon icon={faPeopleGroup} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Referral</span></a></li>
                        </ul>
                    </li>
                    {/* <li className={styles.drpdwnlist} onMouseEnter={toggleIconUp3} onMouseOut={toggleIconDown3}>
                        Community {dropdwnIcon3}
                        <ul>
                            <li><a href='twitter.com' rel='noopener noreferrer' ><FontAwesomeIcon icon={faTwitter} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Twitter</span></a></li>
                            <li><a href='/' rel='noopener noreferrer' ><FontAwesomeIcon icon={faFacebook} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Facebook</span></a></li>
                            <li><a href='https://t.me/frdxtraweb' rel='noopener noreferrer' ><FontAwesomeIcon icon={faTelegram} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Telegram</span></a></li>
                            <li><a href='https://www.geckoterminal.com/bsc/pools/0x7c0406a570ca1407c412238c173898cd145fd52e' rel='noopener noreferrer' ><FontAwesomeIcon icon={faBandcamp} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Coin Gecko</span></a></li>
                            <li><a href='/' rel='noopener noreferrer' ><FontAwesomeIcon icon={faDiscord} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Discord</span></a></li>
                            <li><a href='/' rel='noopener noreferrer' ><FontAwesomeIcon icon={faMedium} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Medium</span></a></li>
                            <li><a href='/' rel='noopener noreferrer' ><FontAwesomeIcon icon={faYoutube} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>YouTube</span></a></li>
                        </ul>
                    </li> */}
                </ul>
                {!isLoggedIn && 
                    <ul className={styles.upa}>
                        <li className={styles.si}><a href='/signin' rel='noopener noreferrer'>Sign In</a></li>
                        <li className={styles.ld}><a href='/register' rel='noopener noreferrer'>Join Us</a></li>
                    </ul>
                }
                </div>)
                }
            </div>
        </nav>
    );
}

export default Navbar;
