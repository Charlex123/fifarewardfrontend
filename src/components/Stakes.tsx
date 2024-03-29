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
import FRDAbi from '../../artifacts/contracts/FifaRewardToken.sol/FifaRewardToken.json';
import StakeAbi from '../../artifacts/contracts/FRDStaking.sol/FRDStaking.json';
import { ThemeContext } from '../contexts/theme-context';
import DappNav from './Dappnav';
import DappFooter from './DappFooter';
import { fas, faCheck, faCheckCircle, faChevronDown,faAlignJustify, faCircleDollarToSlot, faGift, faHandHoldingDollar, faPeopleGroup, faChevronUp, faAngleDoubleRight, faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome, faFacebook,faDiscord, faTelegram, faMedium, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';



library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const Staking = () =>  {

  const router = useRouter();

  const FRDAddress = "0x344db0698433Eb0Ca2515d02C7dBAf21be07C295";
  const StakeCA = "0x07cb8A891E67af801BE05E8Ea84dC9a651F9c4AF";

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
  const [showWithdrawStake, setShowWithdrawStake] = useState(false);
  
  // const { isOpen, onOpen, onClose, closeWeb3Modal,openWeb3Modal } = useContext(Web3ModalContext);
  const { open, close } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();

  const [referralLink, setreferralLink] = useState('');
  const [buttonText, setButtonText] = useState("Copy");
  
  
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
  
  const StakeFRD = async () => {
    try {
      // setWAlert(!wAlert);
      if(walletProvider) {
        const provider = new ethers.providers.Web3Provider(walletProvider as any)
        const signer = provider.getSigner();
        console.log('stakes provider',provider);
        console.log('stakes signer',provider);
        const StakeContract = new ethers.Contract(StakeCA, StakeAbi, signer);
        const reslt = await StakeContract.stake(StakeCA,stakeAmount);
        console.log(reslt)
      }
        
    } catch (error:any) {
      console.log(error)
    }
  }
  StakeFRD()

  const Approve = async () => {
    
    try {
      setWAlert(!wAlert);
      // setShowTimer(!showTimer);
      if(walletProvider) {
          const provider = new ethers.providers.Web3Provider(walletProvider as any)
          const signer = provider.getSigner();
          const FRDContract = new ethers.Contract(FRDAddress, FRDAbi, signer);
          const reslt = await FRDContract.approve(StakeCA,stakeAmount);
          if(reslt) {
            StakeFRD();
        }
      }
    } catch (error:any) {
      setDappConnector(true);
      seterrorMessage("Connect Wallet First");
    }
    
  }

  const checkhasStake = async () => {
    
    try {
      // setShowTimer(!showTimer);
      if(walletProvider) {
        setWAlert(!wAlert);
        const provider = new ethers.providers.Web3Provider(walletProvider as any)
        const signer = provider.getSigner();
        const stakeContract = new ethers.Contract(StakeCA, StakeAbi, signer);
        const reslt = await stakeContract.hasStake(signer);
        if(reslt === true) {
          setShowTimer(true)
          StakeFRD()
        }else if(reslt === false) {
          Approve()
        }
      }
    } catch (error) {
      console.log("Check has wallet");
      setDappConnector(true);
      seterrorMessage("Connect Wallet First");
    }
    
  }

  const calculateReward = async () => {
    try {
      if(walletProvider) {
        setWAlert(!wAlert);
        const provider = new ethers.providers.Web3Provider(walletProvider as any);
        const signer = provider.getSigner();
        const StakeContract = new ethers.Contract(StakeCA, StakeAbi, signer);
        const reslt = await StakeContract.calcReward();
        console.log('calc reward error',reslt);
      }
    }catch(error) {
      setDappConnector(true);
      seterrorMessage("No active stake found");
    }
    
  }

  const Withdraw = async () => {
    try {
      if(walletProvider) {
        setWAlert(!wAlert);
        const provider = new ethers.providers.Web3Provider(walletProvider as any);
        const signer = provider.getSigner();
        const StakeContract = new ethers.Contract(StakeCA, StakeAbi, signer);
        const reslt = await StakeContract.withdrawStake();
        console.log("Account Balance: ", reslt);
      }
    } catch (error) {
      setDappConnector(true);
      seterrorMessage("You must have stake to withdraw");
    }
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

    async function getWalletAddress() {
      try {
        const config = {
        headers: {
            "Content-type": "application/json"
        }
        }  
        const {data} = await axios.post("http://localhost:9000/api/users/getwalletaddress/", {
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
  
  
 }, [userId, router,username,address,chainId,isConnected,walletaddress,stakeduration,wAlert,showTimer,walletProvider,isDragging,initialValues])


 // Function to toggle the navigation menu
 const toggleSideBar = () => {
    setSideBarToggle(!dappsidebartoggle);
    setIsSideBarToggled(!isSideBarToggled);
  };

  const toggleIconUp3 = () => {
      setDropdownIcon3(<FontAwesomeIcon icon={faChevronUp} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>)
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

  const handleStakeDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMaxValue = parseInt(event.target.value);

    const percentageChange = ((newMaxValue - stakeduration) / (2360 - 180)) * 100;
    console.log('percent change',percentageChange);
    setstakeduration(newMaxValue);
    setstakeAmount(stakeAmount + Math.round((50000 - 500) * percentageChange / 100));
    calculateprofitPercent(percentageChange)
  };

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
              <div className={dappconalertstyles.dappconalertclosediv}><button title='button' type='button' className={dappconalertstyles.dappconalertclosedivbtn} onClick={closeDappConAlert}><FontAwesomeIcon icon={faXmark}/></button></div>
              <div className={dappconalertstyles.dappconalert_in}>
                {errorMessage}
              </div>
            </div>
          </>) }
        <div className={`${dappstyles.main_w} ${theme === 'dark' ? dappstyles['darktheme'] : dappstyles['lighttheme']}`}>
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
                              <a href='https://pancakeswap.finance/swap?outputCurrency=0x5ae155F89308CA9050f8Ce1C96741BaDd342C26B' rel='noopener noreferrer' className={dappsidebarstyles.buytafa}>BUY FRD</a>
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
                            <li className={dappsidebarstyles.ld}><a href='/stakes' rel='noopener noreferrer'>Stake FRD</a></li>
                            <li><button type='button' onClick={logout} className={dappsidebarstyles.linka}>Logout</button></li>
                        </ul>
                        
                        </div>
                    </div>
                </nav>
              </div>
              <div className={`${dappstyles.main} ${sideBarToggleCheck}`}>
              <div className={dappstyles.con_btns}>
              {!isConnected ? (
                <button onClick={() => open()} className={dappstyles.connect}> Connect Wallet </button>
                ) : (
                <button onClick={() => disconnect()} className={dappstyles.connected}> Disconnect </button>
                )}
              </div>
              <button title='togglebtn' className={dappstyles.sidebar_toggle_btn} type='button' onClick={toggleSideBar}>
                <FontAwesomeIcon icon={faAlignJustify} size='lg' className={dappstyles.navlisttoggle}/> 
              </button>
                <div className={dappstyles.reflink}>
                    <div className={dappstyles.reflinkdex}>Ref Link: <input title='input' value={referralLink} onChange={(e) => setreferralLink(e.target.value)} /><button type='button' onClick={handleCopyClick}>{buttonText}</button> </div>
                    <div><small>Share referral link to earn more tokens!</small></div>
                    <div>Connected Wallet: <span style={{color: 'orange'}}>{walletaddress}</span></div>
                </div>

                <div className={`${dappstyles.stake}`}>
                    <div className={`${dappstyles.stake_mod} ${theme === 'dark' ? dappstyles['darkstakemod'] : dappstyles['lightstakemod']}`}>
                        <div className={dappstyles.top}><h1>Stake FRD</h1></div>
                        <div className={dappstyles.s_m}>
                          <h3>Stake FRD to earn unlimited profit daily</h3>
                          {!showTimer && 
                                <>
                                  <div className={dappstyles.staketimer}> <FontAwesomeIcon icon={faClock} style={{marginRight: '5px',marginTop: '2px'}}/> <CountdownTimer time={stakeduration} /></div>
                                </>
                              }
                          <div className={dappstyles.s_m_in }>
                              <div className={dappstyles.s_m_inna}>
                                <div><label>Stake Amount</label><span className={dappstyles.stkamt_p}> {stakeAmount.toLocaleString()} FRD</span></div>
                                <div className={dappstyles.amountprog}>
                                  <input title='input'
                                    type="range"
                                    id="horizontalInputforamount"
                                    min={500}
                                    max={50000}
                                    step={1}
                                    value={stakeAmount}
                                    onChange={handleChange}
                                    style={{ width: '100%',height: '5px', cursor: 'pointer', backgroundColor: 'orange' , color: 'orange'}}
                                  />
                                </div>
                              </div>
                              <div className={dappstyles.s_m_inna}>
                                <div><label>Stake Duration</label><span className={dappstyles.stkdur_p}> {stakeduration.toLocaleString()} Days</span> <span className={dappstyles.stkdur_y}> {(stakeduration/365).toFixed(1)} Years</span></div>
                                <div className={dappstyles.amountprog}>
                                  <input title='input'
                                    type="range"
                                    id="horizontalInputforstake"
                                    min={180}
                                    max={2360}
                                    step={2}
                                    value={stakeduration}
                                    onChange={handleStakeDuration}
                                    style={{ width: '100%',height: '5px', cursor: 'pointer', backgroundColor: 'orange', color: 'orange' }}
                                  />
                                </div>
                                <div className={dappstyles.s_m_in_c}>
                                    <div className={dappstyles.s_a}>Expected Earning</div>
                                    <div className={dappstyles.s_b}> {earningprofitpercent}% daily</div>
                                </div>
                                {/* <div className={dappstyles.s_m_in_c}>
                                    <div className={dappstyles.s_a}>
                                      <select title='select' onChange={handleStakeDuration}>
                                        <option value="">Select Duration</option>
                                        <option value="30">30 Days</option>
                                        <option value="90">90 Days</option>
                                        <option value="365">365 Days</option>
                                        <option value="1000">1000 Days</option>
                                      </select>
                                    </div>
                                </div> */}
                              </div>

                              {/* <div className={dappstyles.interest_returns}>
                                <ul>
                                  <li>
                                    <div className={dappstyles.ir_c}>
                                      <div>INTEREST</div> <div>FRD REWARD</div>
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
                              </div> */}

                              <div className={dappstyles.cw_btn_div}>
                                  {wAlert && (
                                    <div className={dappstyles.w_alert}>
                                      <div>Go to your connected wallet and complete transaction</div>
                                      <div className={dappstyles.walertclosediv}><button title='button' type='button' className={dappstyles.walertclosedivbtn} onClick={closeWAlert}><FontAwesomeIcon icon={faXmark}/></button></div>
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

export default Staking