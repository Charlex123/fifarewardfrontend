import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";

import dappsidebarstyles from "../styles/dappsidebar.module.css";
// component
import { ThemeContext } from '../contexts/theme-context';
import { fas, faCheck, faCheckCircle, faChevronDown,faAlignJustify, faCircleDollarToSlot, faGift, faHandHoldingDollar, faPeopleGroup, faChevronUp, faAngleDoubleRight, faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome, faFacebook,faDiscord, faTelegram, faMedium, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';

library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);

type Props = {
  onChange: (newValue:boolean) => void
}

const Dappsidebar:React.FC<Props> = ({onChange}) =>  {

  // const dotenv = require("dotenv");
  // dotenv.config();
  const router = useRouter();
  
  const { theme } = useContext(ThemeContext);
  const [isNavOpen, setNavOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [isSideBarToggled, setIsSideBarToggled] = useState(false)
  const [dappsidebartoggle, setSideBarToggle] = useState(false);
  // const [dropdwnIcon1, setDropdownIcon1] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>);
  // const [dropdwnIcon2, setDropdownIcon2] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>);
  const [dropdwnIcon3, setDropdownIcon3] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>);
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<number>(); 
  const [isWalletAddressUpdated,setisWalletAddressUpdated] = useState(false);

  const [userObjId, setUserObjId] = useState(""); // Initial value
  
  // const { disconnect } = useDisconnect();

  
  const closeDappConAlerted = () => {
    setisWalletAddressUpdated(!isWalletAddressUpdated);
  }
  useEffect(() => {
    
    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    if(udetails && udetails !== null && udetails !== "") {
      const username_ = udetails.username;  
      if(username_) {
        setUsername(username_);
        setUserId(udetails.userId)
        setUserObjId(udetails._id)
      }
    }else {
      router.push(`/signin`);
    }

  
    // Function to handle window resize
    const handleResize = () => {
      // Check the device width and update isNavOpen accordingly
      if (window.innerWidth <= 1100) {
      setNavOpen(false);
      setSideBarToggle(true);
      setIsSideBarToggled(true);
      } else {
      setNavOpen(true);
      setSideBarToggle(false);
      setIsSideBarToggled(false);
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
  
  
 }, [userId,router,username,userObjId])

 // Function to toggle the navigation menu
 const toggleSideBar = () => {
    onChange(false);
  };

  // const toggleIconUp1 = () => {
  //     setDropdownIcon1(<FontAwesomeIcon icon={faChevronUp} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>)
  // }
  // const toggleIconUp2 = () => {
  //     setDropdownIcon2(<FontAwesomeIcon icon={faChevronUp} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>)
  // }
  const toggleIconUp3 = () => {
      setDropdownIcon3(<FontAwesomeIcon icon={faChevronUp} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>)
  }

  // const toggleIconDown1 = () => {
  //     setDropdownIcon1(<FontAwesomeIcon icon={faChevronDown} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>)
  // }
  // const toggleIconDown2 = () => {
  //     setDropdownIcon2(<FontAwesomeIcon icon={faChevronDown} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>)
  // }

  const toggleIconDown3 = () => {
      setDropdownIcon3(<FontAwesomeIcon icon={faChevronDown} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>)
  }

  const logout = () => {
    // Simulate a logout action
    localStorage.removeItem('userInfo');
    router.push(`/signin`);
  };
  return (
    <>
      <nav className={`${dappsidebarstyles.sidebar} ${theme === 'dark' ? dappsidebarstyles['darkmod'] : dappsidebarstyles['lightmod']}`}>
          {!isSideBarToggled && (
            <div className={dappsidebarstyles.overlay_dapp}></div>
          )}
          <button title='togglebtn' className={dappsidebarstyles.sidebar_toggle_btn} type='button' onClick={toggleSideBar}>
            <FontAwesomeIcon icon={faXmarkCircle} size='lg' className={dappsidebarstyles.navlisttoggle}/> 
          </button>
            <div className={dappsidebarstyles.sidebar_container}>
              <div className={dappsidebarstyles.sidebar_container_p}>
              <ul className={dappsidebarstyles.upa}>
                  <li>
                    <a href='/dapp' rel='noopener noreferrer' className={dappsidebarstyles.si}>Dapp</a>
                  </li>
                  <li>
                    <a href='https://pancakeswap.finance/swap?outputCurrency=0x5ae155F89308CA9050f8Ce1C96741BaDd342C26B' rel='noopener noreferrer' className={dappsidebarstyles.buytafa}>BUY FRD</a>
                  </li>
                  <li>
                    <a href='/aichat' rel='noopener noreferrer' className={dappsidebarstyles.si}>Prediction AI</a>
                  </li>
                  <li><a href='/rewards' rel='noopener noreferrer' className={dappsidebarstyles.linka}> Rewards</a></li>
                  <li className={dappsidebarstyles.ld}><a href='/stakes' rel='noopener noreferrer'>Stake FRD</a></li>
                  <li><a href='/gaming' rel='noopener noreferrer' className={dappsidebarstyles.linka}> Gaming</a></li>
                  <li>
                    <a href='/bets' rel='noopener noreferrer' className={dappsidebarstyles.si}>Bets</a>
                  </li>
                  <li>
                    <a href='/mynfts' rel='noopener noreferrer' className={dappsidebarstyles.si}>NFTs</a>
                  </li>
                  <li>
                    <a href='/mining' rel='noopener noreferrer' className={dappsidebarstyles.si}>Mine FRD</a>
                  </li>
                  <li>
                    <a href='/referrals' rel='noopener noreferrer' className={dappsidebarstyles.si}>Referrals</a>
                  </li>
                 
              </ul>
              <ul className={dappsidebarstyles.upa}>
                  <li><button type='button' onClick={logout} className={dappsidebarstyles.linka}>Logout</button></li>
              </ul>
              
              </div>
          </div>
      </nav>
    </>
  );
}

export default Dappsidebar