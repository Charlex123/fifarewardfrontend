import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faClock, faEye, faEyeSlash, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
// import DappSideBar from './Dappsidebar';
// material

// import Loading from "./Loading";
// import AlertMessage from "./AlertMessage";
import dappstyles from "../styles/dapp.module.css";
import dappconalertstyles from "../styles/dappconnalert.module.css";
import dappsidebarstyles from '../styles/dappsidebar.module.css';
// component
import { useWeb3React } from "@web3-react/core";
// import { providers } from "ethers";
import axios from 'axios';
import CountdownTimer from './CountDownTimer';
import { ethers } from 'ethers';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useDisconnect } from '@web3modal/ethers5/react';
import TAFAAbi from '../../artifacts/contracts/TAFA.sol/TAFA.json';
import StakeAbi from '../../artifacts/contracts/Stake.sol/Stake.json';
import { ThemeContext } from '../contexts/theme-context';
import DappNav from './Dappnav';
import DappFooter from './DappFooter';
import { fas, faCheck, faCheckCircle, faChevronDown,faAlignJustify, faCircleDollarToSlot, faGift, faHandHoldingDollar, faPeopleGroup, faChevronUp, faAngleDoubleRight, faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome, faFacebook,faDiscord, faTelegram, faMedium, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';



library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const Dapp = () =>  {

  const router = useRouter();

  const TAFAAddress = "0x5ae155f89308ca9050f8ce1c96741badd342c26b";
  const StakeAddress = "0xE182a7e66E95a30F75971B2924346Ef5d187CE13";

  const { theme, setHandleDrawer, changeTheme, isDark } = useContext(ThemeContext);
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

  const [signature, setSignature] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();
  const [walletaddress, setWalletAddress] = useState("NA"); 
  const [stakeAmount, setstakeAmount] = useState(50);
  const [stakeDuration, setstakeDuration] = useState(2592000);
  const [showTimer, setShowTimer] = useState(false);
  const [showWithdrawStake, setShowWithdrawStake] = useState(false);
  
  // const { isOpen, onOpen, onClose, closeWeb3Modal,openWeb3Modal } = useContext(Web3ModalContext);
  const { open, close } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();

  const [referralLink, setreferralLink] = useState('');
  const [buttonText, setButtonText] = useState("Copy");
  
  const handleChange = (event) => {
    const newValue = event.target.value;
    setstakeAmount(newValue);
};

const handleCopyClick = () => {
   // Create a temporary textarea element
   const textArea = document.createElement('textarea');
   
   // Set the value of the textarea to the text you want to copy
   textArea.value = referralLink;

   // Append the textarea to the document
   document.body.appendChild(textArea);

   // Select the text inside the textarea
   textArea.select();

   // Execute the copy command
   document.execCommand('copy');

   // Remove the temporary textarea
   document.body.removeChild(textArea);

   // Set the state to indicate that the text has been copied
   setButtonText("Copied");

   // Reset the state after a brief period (optional)
   setTimeout(() => {
      setButtonText("Copy");
   }, 1500);
 };

  
  // async function onSignMessage() {
  //   const provider = new ethers.providers.Web3Provider(walletProvider)
  //   const signer = provider.getSigner()
  //   const signature = await signer?.signMessage('Hello Web3Modal Ethers')
  //   console.log(signature)
  // }

  const closeDappConAlert = () => {
    setDappConnector(!dappConnector);
  }

  const closeWAlert = () => {
    setWAlert(!wAlert);
  }

  const handleStakeDuration = (e) => {
    setstakeDuration(e.target.value)
  }

  // define contract data
  
  const StakeTAFA = async (e) => {
    try {
      setWAlert(!wAlert);
      const provider = new ethers.providers.Web3Provider(walletProvider)
      const signer = provider.getSigner()
      const StakeContract = new ethers.Contract(StakeAddress, StakeAbi.abi, signer);
      const reslt = await StakeContract.stake(StakeAddress,stakeAmount);
      console.log(reslt)
    } catch (error) {
      console.log(error)
    }
  }

  const Approve = async (e) => {
    
    try {
      setWAlert(!wAlert);
      // setShowTimer(!showTimer);
      const provider = new ethers.providers.Web3Provider(walletProvider)
      const signer = provider.getSigner();
      const TAFAContract = new ethers.Contract(TAFAAddress, TAFAAbi, signer);
      const reslt = await TAFAContract.approve(StakeAddress,stakeAmount);
      if(reslt) {
        StakeTAFA();
      }
    } catch (error) {
      setDappConnector(true);
      setErrorMessage("Connect Wallet First");
    }
    
  }

  const checkhasStake = async (e) => {
    
    try {
      // setShowTimer(!showTimer);
      setWAlert(!wAlert);
      const provider = new ethers.providers.Web3Provider(walletProvider)
      const signer = provider.getSigner();
      const stakeContract = new ethers.Contract(StakeAddress, StakeAbi.abi, signer);
      const reslt = await stakeContract.hasStake(signer);
      if(reslt === true) {
        setShowTimer(true)
        StakeTAFA()
      }else if(reslt === false) {
        Approve()
      }
    } catch (error) {
      console.log("Check has wallet");
      setDappConnector(true);
      setErrorMessage("Connect Wallet First");
    }
    
  }

  const calculateReward = async () => {
    try {
      setWAlert(!wAlert);
      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();
      const StakeContract = new ethers.Contract(StakeAddress, StakeAbi.abi, signer);
      const reslt = await StakeContract.calcReward();
      console.log('calc reward error',reslt);
    }catch(error) {
      setDappConnector(true);
      setErrorMessage("No active stake found");
    }
    
  }

  const Withdraw = async () => {
    try {
      setWAlert(!wAlert);
      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();
      const StakeContract = new ethers.Contract(StakeAddress, StakeAbi.abi, signer);
      const reslt = await StakeContract.withdrawStake();
      console.log("Account Balance: ", reslt);
    } catch (error) {
      setDappConnector(true);
      setErrorMessage("You must have stake to withdraw");
    }
  }

  
  useEffect(() => {
    
    localStorage.setItem('staketimer',stakeDuration);

    setstakeDuration(localStorage.getItem('staketimer'))
    const udetails = JSON.parse(localStorage.getItem("userInfo"));
    
    if(udetails && udetails !== null && udetails !== "") {
      const username_ = udetails.username;  
      if(username_) {
        setUsername(username_);
        setUserId(udetails.userId)
        setreferralLink(`https://tafaextra.io/register/${udetails.userId}`);
      }
    }else {
      router.push(`/signin`);
    }

    async function getWalletAddress() {
      try {
        const config = {
        headers: {
            "Content-type": "application/json"
        }
        }  
        const {data} = await axios.post("https://tafabackend.onrender.com/api/users/getwalletaddress/", {
          username
        }, config);
        setWalletAddress(data.message);
      } catch (error) {
        console.log(error)
      }
  }
  getWalletAddress();
  
  
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
  
  
 }, [userId, router,username,address,chainId,isConnected,walletaddress,stakeDuration,wAlert,showTimer,walletProvider])


 // Function to toggle the navigation menu
 const toggleSideBar = () => {
    setSideBarToggle(!dappsidebartoggle);
    setIsSideBarToggled(!isSideBarToggled);
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

const sideBarToggleCheck = dappsidebartoggle ? dappstyles.sidebartoggled : '';

  return (
    <>
        <DappNav/>
        {dappConnector && (<>
            <div className={dappconalertstyles.overlay_dap}></div>
            <div className={dappconalertstyles.dappconalert}>
              <div className={dappconalertstyles.dappconalertclosediv}><button type='button' className={dappconalertstyles.dappconalertclosedivbtn} onClick={closeDappConAlert}><FontAwesomeIcon icon={faXmark}/></button></div>
              <div className={dappconalertstyles.dappconalert_in}>
                {errorMessage}
              </div>
            </div>
          </>) }
        <div className={dappstyles.main_w}>
            <div className={dappstyles.main_c}>
              <div className={`${dappstyles.sidebar} ${sideBarToggleCheck}`}>
                  <nav className={dappsidebarstyles.sidebar}>
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
                              <a href='https://pancakeswap.finance/swap?outputCurrency=0x5ae155F89308CA9050f8Ce1C96741BaDd342C26B' rel='noopener noreferrer' className={dappsidebarstyles.buytafa}>BUY TAFA</a>
                            </li>
                            <li><a href='/stakes' rel='noopener noreferrer' className={dappsidebarstyles.linka}>My Stakes</a></li>
                            <li>
                              <a href='/referrals' rel='noopener noreferrer' className={dappsidebarstyles.si}>Referrals</a>
                            </li>
                            <li className={dappsidebarstyles.drpdwnlist} onMouseEnter={toggleIconUp3} onMouseOut={toggleIconDown3}>
                                Community {dropdwnIcon3}
                                <ul>
                                    {/* <li className={dappsidebarstyles.lista}><a href='/' rel='noopener noreferrer' className={dappsidebarstyles.linka}><FontAwesomeIcon icon={faTwitter} size='lg' className={dappsidebarstyles.sidebardrbdwnbrandicon}/> <span className={dappsidebarstyles.brnd}>Twitter</span></a></li> */}
                                    {/* <li className={dappsidebarstyles.lista}><a href='/' rel='noopener noreferrer' className={dappsidebarstyles.linka}><FontAwesomeIcon icon={faFacebook} size='lg' className={dappsidebarstyles.sidebardrbdwnbrandicon}/> <span className={dappsidebarstyles.brnd}>Facebook</span></a></li> */}
                                    <li className={dappsidebarstyles.lista}><a href='https://t.me/tafaxtraweb' rel='noopener noreferrer' className={dappsidebarstyles.linka}><FontAwesomeIcon icon={faTelegram} size='lg' className={dappsidebarstyles.sidebardrbdwnbrandicon}/> <span className={dappsidebarstyles.brnd}>Telegram</span></a></li>
                                    {/* <li className={dappsidebarstyles.lista}><a href='/' rel='noopener noreferrer' className={dappsidebarstyles.linka}><FontAwesomeIcon icon={faDiscord} size='lg' className={dappsidebarstyles.sidebardrbdwnbrandicon}/> <span className={dappsidebarstyles.brnd}>Discord</span></a></li> */}
                                    {/* <li className={dappsidebarstyles.lista}><a href='/' rel='noopener noreferrer' className={dappsidebarstyles.linka}><FontAwesomeIcon icon={faMedium} size='lg' className={dappsidebarstyles.sidebardrbdwnbrandicon}/> <span className={dappsidebarstyles.brnd}>Medium</span></a></li> */}
                                    {/* <li className={dappsidebarstyles.lista}><a href='/' rel='noopener noreferrer' className={dappsidebarstyles.linka}><FontAwesomeIcon icon={faYoutube} size='lg' className={dappsidebarstyles.sidebardrbdwnbrandicon}/> <span className={dappsidebarstyles.brnd}>YouTube</span></a></li> */}
                                </ul>
                            </li>
                        </ul>
                        <ul className={dappsidebarstyles.upa}>
                            <li className={dappsidebarstyles.ld}><a href='/stakes' rel='noopener noreferrer'>Stake TafaXtra</a></li>
                            <li><button type='button' onClick={logout} className={dappsidebarstyles.linka}>Logout</button></li>
                        </ul>
                        
                        </div>
                    </div>
                </nav>
              </div>
              <div className={`${dappstyles.main} ${sideBarToggleCheck}`}>
              <div className={dappstyles.con_btns}>
              {!isConnected ? (
                <button onClick={() => open()} className={dappstyles.connect}> Connect Wallet</button>
                ) : (
                <button onClick={() => disconnect()} className={dappstyles.connected}><span>connected</span>Disconnect</button>
                )}
              </div>
              <button title='togglebtn' className={dappstyles.sidebar_toggle_btn} type='button' onClick={toggleSideBar}>
                <FontAwesomeIcon icon={faAlignJustify} size='lg' className={dappstyles.navlisttoggle}/> 
              </button>
                <div className={dappstyles.reflink}>
                    <div className={dappstyles.reflinkdex}>Ref Link: <input value={referralLink} onChange={(e) => setreferralLink(e.target.value)} /><button type='button' onClick={handleCopyClick}>{buttonText}</button> </div>
                    <div><small>Share referral link to earn more tokens!</small></div>
                    <div>Connected Wallet: <span style={{color: 'orange'}}>{walletaddress}</span></div>
                </div>

                <div className={dappstyles.stake}>
                    <div className={dappstyles.stake_mod}>
                        <div className={dappstyles.top}><h1>Stake Your TafaXtra</h1></div>
                        <div className={dappstyles.s_m}>
                          <h3>Stake TafaXtra to earn 2% profit daily</h3>
                          <div className={dappstyles.s_m_in}>
                              <div className={dappstyles.s_m_inna}>
                                <div className={dappstyles.s_m_in_c}>
                                    <div className={dappstyles.s_a}>Stake Amount <div>{stakeAmount} TAFA</div></div>
                                    <div className={dappstyles.s_b}>Bonus <div>2% Daily</div></div>
                                </div>
                                <div className={dappstyles.amountprog}>
                                  <input
                                    type="range"
                                    id="horizontalInput"
                                    min={50}
                                    max={50000}
                                    step={1}
                                    value={stakeAmount}
                                    onChange={handleChange}
                                    style={{ width: '100%',height: '5px', cursor: 'pointer' }}
                                  />
                                </div>
                              </div>
                              <div className={dappstyles.s_m_inna}>
                                <h3>Stake Duration</h3>
                                <div className={dappstyles.s_m_in_c}>
                                    <div className={dappstyles.s_a}>
                                      <select onChange={handleStakeDuration}>
                                        <option value="">Select Duration</option>
                                        <option value="30">30 Days</option>
                                        <option value="90">90 Days</option>
                                        <option value="365">365 Days</option>
                                        <option value="1000">1000 Days</option>
                                      </select>
                                    </div>
                                </div>
                              </div>

                              {showTimer && 
                                <>
                                  {/* <div className={dappstyles.staketimer}> <FontAwesomeIcon icon={faClock}/> <CountdownTimer time={stakeDuration} /></div> */}
                                </>
                              }

                              <div className={dappstyles.interest_returns}>
                                <ul>
                                  <li>
                                    <div className={dappstyles.ir_c}>
                                      <div>INTEREST</div> <div>TAFA REWARD</div>
                                    </div>
                                  </li>
                                  <li>
                                    <div className={dappstyles.ir_c}>
                                      <div>Daily</div> <div>2%</div>
                                    </div>
                                  </li>
                                  <li>
                                    <div className={dappstyles.ir_c}>
                                      <div>Weekly</div><div>14%</div>
                                    </div>
                                  </li>
                                  <li>
                                    <div className={dappstyles.ir_c}>
                                      <div>Monthly</div> <div>60%</div>
                                    </div>
                                  </li>
                                  <li>
                                    <div className={dappstyles.ir_c}>
                                      <div>Yearly</div><div>730%</div>
                                    </div>
                                  </li>
                                </ul>
                              </div>

                              <div className={dappstyles.cw_btn_div}>
                                  {wAlert && (
                                    <div className={dappstyles.w_alert}>
                                      <div>Go to your connected wallet and complete transaction</div>
                                      <div className={dappstyles.walertclosediv}><button type='button' className={dappstyles.walertclosedivbtn} onClick={closeWAlert}><FontAwesomeIcon icon={faXmark}/></button></div>
                                    </div>
                                  )}
                                  <div>
                                      <button type='button' className={dappstyles.stakebtn} onClick={checkhasStake}>Stake</button>
                                  </div>
                                  <div>
                                      <button type='button' className={dappstyles.calcrwd} onClick={calculateReward}>Calc Reward</button>
                                  </div>

                                  <div>
                                    <button type='button' className={dappstyles.withd} onClick={Withdraw}>Withdraw</button>
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
        <DappFooter />
    </>
  );
}

export default Dapp