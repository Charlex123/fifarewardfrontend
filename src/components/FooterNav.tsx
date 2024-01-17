import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../contexts/theme-context';
import styles from '../styles/footernav.module.css';
import logo from '../assets/images/logo.png';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas, faCheck, faCheckCircle, faChevronDown,faAlignJustify, faCircleDollarToSlot, faGift, faPeopleGroup, faChevronUp, faAngleRight, faFootball, faFootballBall, faRobot, faGamepad } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome, faTelegram, faBandcamp, faArtstation } from '@fortawesome/free-brands-svg-icons'
import { faMessage, faQuestionCircle, faSoccerBall } from '@fortawesome/free-regular-svg-icons';
library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)

function FooterNavBar() {
    const { theme, setHandleDrawer, changeTheme, isDark } = useContext(ThemeContext);
    const [isNavOpen, setNavOpen] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const [dropdwnIcon1, setDropdownIcon1] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={styles.navlisttoggle}/>);
    const [dropdwnIcon2, setDropdownIcon2] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={styles.navlisttoggle}/>);
    const [dropdwnIcon3, setDropdownIcon3] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={styles.navlisttoggle}/>);
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
    }, []);





    return (
        <>
            <nav className={styles.footernav}>
                <div className={styles.nav_container}>
                    <div className={styles.linka}>
                        <a href='/nft' rel='noopener noreferrer'> <div className={styles.tc}>{<FontAwesomeIcon icon={faArtstation}/>}</div>NFT Market</a>
                    </div>
                    <div className={styles.linka}>
                        <a href='/aichat' rel='noopener noreferrer'> <div className={styles.tc}>{<FontAwesomeIcon icon={faMessage}/>}</div> AI Q&A </a>
                    </div>
                    <div className={styles.linka}>
                        <a href='/betting' rel='noopener noreferrer'> <div className={styles.tc}>{<FontAwesomeIcon icon={faSoccerBall}/>}</div> Betting </a>
                    </div>
                    <div className={styles.linka}>
                        <a href='/gaming' rel='noopener noreferrer'> <div className={styles.tc}>{<FontAwesomeIcon icon={faGamepad}/>}</div> Gaming </a>
                    </div>
                    {!isLoggedIn && 
                        <div className={styles.signin}>
                            <a href='/signin' rel='noopener noreferrer'>Sign In</a>
                        </div>
                    }
                </div>
            </nav>
        </>
    );
}

export default FooterNavBar;
