import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import DappSideBar from './Dappsidebar';
// material

// import Loading from "./Loading";
// import AlertMessage from "./AlertMessage";
import dappstyles from "../styles/dapp.module.css";
import dappconalertstyles from "../styles/dappconnalert.module.css";
import dappsidebarstyles from '../styles/dappsidebar.module.css';
// component
import ConnectWallet from './ConnectWalletButton';
import ReferralLink from './ReferralLink';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { ThemeContext } from '../contexts/theme-context';
import DappNav from './Dappnav';
import DappFooter from './DappFooter';
import FooterNavBar from './FooterNav';
import RewardsBadge from './RewardsBadge';
import { fas, faCheck, faCheckCircle, faChevronDown,faAlignJustify, faChevronUp, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome} from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';




library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const Mining = () =>  {

  const router = useRouter();


  const { theme} = useContext(ThemeContext);
  const [isNavOpen, setNavOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [isSideBarToggled, setIsSideBarToggled] = useState(false)
  const [dappsidebartoggle, setSideBarToggle] = useState(false);
  // const [dropdwnIcon1, setDropdownIcon1] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>);
  // const [dropdwnIcon2, setDropdownIcon2] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>);
  const [dropdwnIcon3, setDropdownIcon3] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");  
  const [dappConnector,setDappConnector] = useState(false);
  const [wAlert,setWAlert] = useState(false);
  const [minecount, setMineCount] = useState<number>(0);

  const [errorMessage, seterrorMessage] = useState("");
  const [network, setNetwork] = useState(undefined);
  const [earningprofitpercent, setEarningProfitPercent] = useState<any>(0);
  const [walletaddress, setWalletAddress] = useState("NA"); 
  const [stakeAmount, setstakeAmount] = useState<any>(500);
  const [stakeduration, setstakeduration] = useState<any>(180);
  const [currentstakeprofitPercent,setCurrentstakeprofitPercent] = useState<any>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<number[]>([]);
  // const [deltaX, setDeltaX] = useState(0);
  // const [draggedRangeIndex, setDraggedRangeIndex] = useState<number | null>(null);


  const [showTimer, setShowTimer] = useState(false);
  
  // const { isOpen, onOpen, onClose, closeWeb3Modal,openWeb3Modal } = useContext(Web3ModalContext);
  const { walletProvider } = useWeb3ModalProvider();
  const { address, chainId, isConnected } = useWeb3ModalAccount();

  const [referralLink, setreferralLink] = useState('');
  
  const closeDappConAlert = () => {
    setDappConnector(!dappConnector);
  }

  useEffect(() => {
    
    localStorage.setItem('staketimer',stakeduration);

    setstakeduration(localStorage.getItem('staketimer')!)
    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    
    if(udetails && udetails !== null && udetails !== "") {
      const username_ = udetails.username;  
      if(username_) {
        setUsername(username_);
        setUserId(udetails.userId)
        setreferralLink(`https://fifareward.io/register/${udetails.userId}`);
      }
    }else {
      router.push(`/signin`);
    }

  
  // Function to handle window resize
  const handleResize = () => {
      // Check the device width and update isNavOpen accordingly
      if (window.innerWidth <= 990) {
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

  // Cleanup function to clear the interval, handlescroll and handleresize when the component is unmounted
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
  };
  
  
 }, [userId, router,username,address,chainId,isConnected,walletaddress,stakeduration,wAlert,showTimer,walletProvider,isDragging,initialValues])


 const incrementmineCount = async (e: any) => {
  try {
    const response = await fetch('../api/incrementcount', {
      method: 'POST'
    });
    const data = await response.json();
    setMineCount(data.count);
  } catch (error) {
    console.error('Error incrementing count:', error);
  }
};

 // Function to toggle the navigation menu
 const toggleSideBar = () => {
    setSideBarToggle(!dappsidebartoggle);
    setIsSideBarToggled(!isSideBarToggled);
  };

  const Mine = async (e: any) => {
    try {
      
    } catch (error) {
      
    }
  }

  const Withdraw = async (e: any) => {
    try {
      // setShowLoading(true);
      // setShowBgOverlay(true);
      // if(walletProvider) {
      //   let alertdiv = e.parentElement.parentElement.previousElementSibling.previousElementSibling;
      //   alertdiv.style.display = "block";
      //   const provider = new ethers.providers.Web3Provider(walletProvider as any);
      //   const signer = provider.getSigner();
      //   const StakeContract = new ethers.Contract(StakeCA!, StakeAbi, signer);
      //   const reslt = await StakeContract.withdrawStake(stakeId);
      //   console.log("Account Balance: ", reslt);
      //   setShowLoading(false);
      //   setShowBgOverlay(false);
      //   setActionSuccess(true);
      // }
    } catch (error) {
      // setShowAlertDanger(true);
      // seterrorMessage("You must have stake to withdraw");
    }
  }

  const calculateprofitPercent = async (percntagechange:any) => {
    let nep = parseFloat(percntagechange).toFixed(1);
    console.log('new pppoiiiii',nep)
    let newp = nep;
    setCurrentstakeprofitPercent(newp);
    setEarningProfitPercent(newp);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    // setstakeAmount(newValue);
  };


const sideBarToggleCheck = dappsidebartoggle ? dappstyles.sidebartoggled : '';

  return (
    <>
        <DappNav/>
        {dappConnector && (<>
            <div className={dappconalertstyles.overlay_dap}></div>
            <div className={dappconalertstyles.dappconalert}>
              <div className={dappconalertstyles.dappconalertclosediv}><button title='button' type='button' className={dappconalertstyles.dappconalertclosedivbtn} onClick={closeDappConAlert}><FontAwesomeIcon icon={faXmark}/></button></div>
              <div className={dappconalertstyles.dappconalert_in}>
                {errorMessage}
              </div>
            </div>
          </>) }
        <div className={`${dappstyles.main_w} ${theme === 'dark' ? dappstyles['darktheme'] : dappstyles['lighttheme']}`}>
            <div className={dappstyles.main_c}>
              <div className={`${dappstyles.sidebar} ${sideBarToggleCheck}`}>
                  <DappSideBar onChange={toggleSideBar}/>
              </div>
              <div className={`${dappstyles.main} ${sideBarToggleCheck}`}>
              <div className={dappstyles.con_btns}>
                  <ConnectWallet />
              </div>
              <button title='togglebtn' className={dappstyles.sidebar_toggle_btn} type='button' onClick={toggleSideBar}>
                <FontAwesomeIcon icon={faAlignJustify} size='lg' className={dappstyles.navlisttoggle}/> 
              </button>
              <div>
                <RewardsBadge />
              </div>
              <div>
                <ReferralLink />
              </div>

                <div className={dappstyles.stk_h1}><h1>Mine FRD</h1></div>
                <div className={dappstyles.stk_p}>
                    <div className={`${dappstyles.stake} ${dappstyles.mine_}`}>
                        <div className={`${dappstyles.stake_mod} ${theme === 'dark' ? dappstyles['darkmod'] : dappstyles['lightmod']}`}>
                            <div className={dappstyles.top}><h1 className={`${theme === 'dark' ? dappstyles['darkmod'] : dappstyles['lightmod']}`}>Start Mining FRD</h1></div>
                            <div className={dappstyles.s_m}>
                              <div className={dappstyles.mine_r}>Mining rate: <span>0.1 FRD/hr</span></div>
                              <div className={dappstyles.mine_m}>Mined: <span className={dappstyles.mfrd}>{minecount}</span><span className={dappstyles.m_frd}>FRD</span></div>
                              <div className={dappstyles.s_m_in }>
                                  <div className={dappstyles.cw_btn_div}>
                                      <div className={dappstyles.st_btns}>
                                          <div>
                                              <button type='button' className={dappstyles.calcrwd} onClick={(e) => incrementmineCount(e.target)}>Mine</button>
                                          </div>

                                          <div>
                                            <button type='button' className={dappstyles.withd} onClick={(e) => Withdraw(e.target)}>Withdraw</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
                  {/* end of stake conntainer */}

              </div>
            </div>
        </div>
        {/* {isOpen && (<SelectWalletModal isOpen={isOpen} closeWeb3Modal={closeWeb3Modal} />)} */}
        {/* <DappFooter /> */}
        <FooterNavBar />
    </>
  );
}

export default Mining