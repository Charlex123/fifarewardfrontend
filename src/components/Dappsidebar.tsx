import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
import Image from 'next/image';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import pimg from '../assets/images/default_avatar.jpeg';
import dappsidebarstyles from "../styles/dappsidebar.module.css";
// component
import { ThemeContext } from '../contexts/theme-context';
import { FaArtstation, FaChevronDown, FaChevronUp, FaCircleXmark, FaGaugeHigh, FaGear, FaGift, FaRobot, FaUserGroup } from 'react-icons/fa6';
import { GiGamepad, GiMineralHeart } from 'react-icons/gi';
import { IoIosFootball } from 'react-icons/io';
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
  const { address } = useWeb3ModalAccount();
  const [shortwalletaddress, setShortWalletAddress] = useState<any>("NA");
  const [isSideBarToggled, setIsSideBarToggled] = useState(false)
  const [profileimage,setProfileImage] = useState<string>('');
  const [dappsidebartoggle, setSideBarToggle] = useState(false);
  // const [dropdwnIcon1, setDropdownIcon1] = useState(<FaChevronDown className={dappsidebarstyles.sidebarlisttoggle}/>);
  // const [dropdwnIcon2, setDropdownIcon2] = useState(<FaChevronDown className={dappsidebarstyles.sidebarlisttoggle}/>);
  const [dropdwnIcon3, setDropdownIcon3] = useState(<FaChevronDown className={dappsidebarstyles.sidebarlisttoggle}/>);
  const [isWalletAddressUpdated,setisWalletAddressUpdated] = useState(false);

  
  // const { disconnect } = useDisconnect();

  
  const closeDappConAlerted = () => {
    setisWalletAddressUpdated(!isWalletAddressUpdated);
  }
  useEffect(() => {
    
    const shrtwa = address?.substring(0,12)+' ...';
          setShortWalletAddress(shrtwa);
  
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
  
  
 }, [address,router])

 // Function to toggle the navigation menu
 const toggleSideBar = () => {
    onChange(false);
  };

  // const toggleIconUp1 = () => {
      // setDropdownIcon1(<FaChevronUp className={dappsidebarstyles.sidebarlisttoggle}/>)
  // }
  // const toggleIconUp2 = () => {
      // setDropdownIcon2(<FaChevronUp className={dappsidebarstyles.sidebarlisttoggle}/>)
  // }
  const toggleIconUp3 = () => {
      setDropdownIcon3(<FaChevronUp className={dappsidebarstyles.sidebarlisttoggle}/>)
  }

  // const toggleIconDown1 = () => {
      // setDropdownIcon1(<FaChevronDown className={dappsidebarstyles.sidebarlisttoggle}/>)
  // }
  // const toggleIconDown2 = () => {
      // setDropdownIcon2(<FaChevronDown className={dappsidebarstyles.sidebarlisttoggle}/>)
  // }

 
  return (
    <>
      <nav className={`${dappsidebarstyles.sidebar} ${theme === 'dark' ? dappsidebarstyles['darkmod'] : dappsidebarstyles['lightmod']}`}>
          {!isSideBarToggled && (
            <div className={dappsidebarstyles.overlay_dapp}></div>
          )}
          <button title='togglebtn' className={dappsidebarstyles.sidebar_toggle_btn_} type='button' onClick={toggleSideBar}>
            <FaCircleXmark size={28} color='#f1f1f1' className={dappsidebarstyles.navlisttoggle_}/> 
          </button>
            <div className={dappsidebarstyles.sidebar_container}>
              <div className={dappsidebarstyles.sidebar_container_p}>
                <div className={dappsidebarstyles.pprorofile}>
                  <div><Image src={profileimage ? pimg : pimg } width={30} height={30} alt='logo' className={dappsidebarstyles.pimage} style={{borderRadius: '50%',marginRight: '5px'}} /> {shortwalletaddress}</div>
                </div>
                <ul className={dappsidebarstyles.upa}>
                  <li>
                    <a href='/dapp' rel='noopener noreferrer' className={dappsidebarstyles.si}> <FaGaugeHigh/> Dapp</a>
                  </li>
                  <li>
                    <a href='https://pancakeswap.finance/swap?outputCurrency=0x6fe537b0ba874eab212bb8321ad17cf6bb3a0afc' rel='noopener noreferrer' className={dappsidebarstyles.buytafa}>BUY FRD</a>
                  </li>
                  <li>
                    <a href='/fanforum' rel='noopener noreferrer' className={dappsidebarstyles.si}><FaRobot/> Forum </a>
                  </li>
                  <li><a href='/rewards' rel='noopener noreferrer' className={dappsidebarstyles.linka}> <FaGift/> Rewards</a></li>
                  <li className={dappsidebarstyles.ld}><a href='/stakes' rel='noopener noreferrer'>Stake FRD</a></li>
                  <li><a href='/gaming' rel='noopener noreferrer' className={dappsidebarstyles.linka}> <GiGamepad/> Gaming</a></li>
                  <li>
                    <a href='/betting/mybets' rel='noopener noreferrer' className={dappsidebarstyles.si}><IoIosFootball/> Bets</a>
                  </li>
                  <li>
                    <a href='nft//mynfts' rel='noopener noreferrer' className={dappsidebarstyles.si}> <FaArtstation/> NFTs</a>
                  </li>
                  <li>
                    <a href='/farming' rel='noopener noreferrer' className={dappsidebarstyles.si}> <GiMineralHeart/> Farm FRD</a>
                  </li>
                  <li>
                    <a href='/referrals' rel='noopener noreferrer' className={dappsidebarstyles.si}> <FaUserGroup/> Referrals</a>
                  </li>
                  <li className={dappsidebarstyles.ld}>
                    <a href='/fanforum' rel='noopener noreferrer' className={dappsidebarstyles.si}>Chat Forum</a>
                  </li>
                  <li>
                    <a href='/settings' rel='noopener noreferrer' className={dappsidebarstyles.si}> <FaGear/> Settings</a>
                  </li>
              </ul>
              
              </div>
          </div>
      </nav>
    </>
  );
}

export default Dappsidebar