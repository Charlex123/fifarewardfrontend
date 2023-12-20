import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../contexts/theme-context';
import styles from '../../styles/navbar.module.css';
import Link from '../link';
import logo from '../../assets/images/logo.png';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas, faCheck, faCheckCircle, faChevronDown,faAlignJustify, faCircleDollarToSlot, faGift, faPeopleGroup, faChevronUp, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome, faTelegram, faBandcamp } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)

function Navbar() {
    const { theme, setHandleDrawer, changeTheme, isDark } = useContext(ThemeContext);
    const [isNavOpen, setNavOpen] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const [dropdwnIcon1, setDropdownIcon1] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={styles.navlisttoggle}/>);
    const [dropdwnIcon2, setDropdownIcon2] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={styles.navlisttoggle}/>);
    const [dropdwnIcon3, setDropdownIcon3] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={styles.navlisttoggle}/>);

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


    const shortname = (name) => {
        if (name.length > 12) {
            return name.split(' ')[0];
        } else {
            return name;
        }
    };

    const navClass = scrolling ? styles.scrolled : '';

    return (
        <nav className={styles.nav}>
            <button title='togglebtn' className={styles.nav_toggle_btn} type='button' onClick={toggleNav}><FontAwesomeIcon icon={faAlignJustify} size='lg' className={styles.toggle_icon}/></button>
            <div className={`${styles.nav_container} ${navClass}`}>
                <div className={styles.logo}>
                <a href='/' rel='noopener noreferrer'><Image src={logo} alt='logo' className={styles.logoni}/></a>
                </div> 
                
                {isNavOpen && (
                <div className={styles.nav_container_p}>
                <ul className={styles.upa}>
                    <li className={styles.drpdwnlist} onMouseEnter={toggleIconUp1} onMouseOut={toggleIconDown1}>
                        Welcome {dropdwnIcon1}
                        <ul>
                            <li><a href='/#abouttafa' rel='noopener noreferrer' > <FontAwesomeIcon icon={faAngleRight} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>About TafaXtra</span></a></li>
                            <li><a href='/#roadmap' rel='noopener noreferrer' > <FontAwesomeIcon icon={faAngleRight} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>RoadMap</span></a></li>
                            <li><a href='/whitepaper' rel='noopener noreferrer' > <FontAwesomeIcon icon={faAngleRight} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>White Paper</span></a></li>
                        </ul>
                    </li>
                    <li><a href='/whitepaper' rel='noopener noreferrer'>White Paper</a></li>
                    <li className={styles.drpdwnlist} onMouseEnter={toggleIconUp2} onMouseOut={toggleIconDown2}>
                        Features {dropdwnIcon2}
                        <ul>
                            <li><a href='/#tafastaking' rel='noopener noreferrer' ><FontAwesomeIcon icon={faCircleDollarToSlot} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Staking Rewards</span></a></li>
                            <li><a href='/#freeclaim' rel='noopener noreferrer' ><FontAwesomeIcon icon={faGift} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>TafaXtra Free Claim</span></a></li>
                            <li><a href='/#referrals' rel='noopener noreferrer' ><FontAwesomeIcon icon={faPeopleGroup} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Referral</span></a></li>
                        </ul>
                    </li>
                    <li className={styles.drpdwnlist} onMouseEnter={toggleIconUp3} onMouseOut={toggleIconDown3}>
                        Community {dropdwnIcon3}
                        <ul>
                            <li><a href='twitter.com' rel='noopener noreferrer' ><FontAwesomeIcon icon={faTwitter} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Twitter</span></a></li>
                            {/* <li><a href='/' rel='noopener noreferrer' ><FontAwesomeIcon icon={faFacebook} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Facebook</span></a></li> */}
                            <li><a href='https://t.me/tafaxtraweb' rel='noopener noreferrer' ><FontAwesomeIcon icon={faTelegram} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Telegram</span></a></li>
                            <li><a href='https://www.geckoterminal.com/bsc/pools/0x7c0406a570ca1407c412238c173898cd145fd52e' rel='noopener noreferrer' ><FontAwesomeIcon icon={faBandcamp} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Coin Gecko</span></a></li>
                            {/* <li><a href='/' rel='noopener noreferrer' ><FontAwesomeIcon icon={faDiscord} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Discord</span></a></li> */}
                            {/* <li><a href='/' rel='noopener noreferrer' ><FontAwesomeIcon icon={faMedium} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>Medium</span></a></li> */}
                            {/* <li><a href='/' rel='noopener noreferrer' ><FontAwesomeIcon icon={faYoutube} size='lg' className={styles.navdrbdwnbrandicon}/> <span className={styles.brnd}>YouTube</span></a></li> */}
                        </ul>
                    </li>
                </ul>
                <ul className={styles.upa}>
                    <li className={styles.si}><a href='/signin' rel='noopener noreferrer'>Sign In</a></li>
                    <li className={styles.ld}><a href='/register' rel='noopener noreferrer'>Join Us</a></li>
                </ul>
                </div>)
                }
            </div>
        </nav>
    );
}

export default Navbar;
