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
import { ethers } from 'ethers';
// component
import ConnectWallet from './ConnectWalletButton';
import ReferralLink from './ReferralLink';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { ThemeContext } from '../contexts/theme-context';
import DappNav from './Dappnav';
import FRDabi from "../../artifacts/contracts/FifaRewardToken.sol/FifaRewardToken.json"
import FooterNavBar from './FooterNav';
import Loading from './Loading';
import BgOverlay from './BgOverlay';
import AlertDanger from './AlertDanger';
import AlertMessage from './AlertMessage';
import RewardsBadge from './RewardsBadge';
import ActionSuccessModal from './ActionSuccess';
import HelmetExport from 'react-helmet';
import { fas, faCheck, faCheckCircle, faChevronDown,faAlignJustify, faChevronUp, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome} from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { connected } from 'process';




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
  let [amountmined, setAmountMined] = useState<number>(0.00005);

  const [errorMessage, seterrorMessage] = useState("");
  const [miningstatus, setMiningStatus] = useState<string>("Inactive");
  const [walletaddress, setWalletAddress] = useState("NA"); 
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<number[]>([]);
  const [showloading, setShowLoading] = useState<boolean>(false);
  const [showAlertDanger,setShowAlertDanger] = useState<boolean>(false);
  const [showBgOverlay,setShowBgOverlay] = useState<boolean>(false);
  const [actionsuccess, setActionSuccess] = useState(false);
  const [actionsuccessmessage, setActionSuccessMessage] = useState<string>('');
  // const [deltaX, setDeltaX] = useState(0);
  // const [draggedRangeIndex, setDraggedRangeIndex] = useState<number | null>(null);


  const [showTimer, setShowTimer] = useState(false);
  const miningrate = 0.00005;
  // const { isOpen, onOpen, onClose, closeWeb3Modal,openWeb3Modal } = useContext(Web3ModalContext);
  const { walletProvider } = useWeb3ModalProvider();
  const { address, chainId, isConnected } = useWeb3ModalAccount();

  const [referralLink, setreferralLink] = useState('');

  const FRDContractAddress = process.env.NEXT_PUBLIC_FRD_DEPLOYED_CA;

  let miningInterval: ReturnType<typeof setInterval> | null = null;
  
  const closeDappConAlert = () => {
    setDappConnector(!dappConnector);
  }

  useEffect(() => {

    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    
    if(udetails && udetails !== null && udetails !== "") {
      const username_ = udetails.username;  
      if(username_) {
        setUsername(username_);
        setUserId(udetails.userId)
        setreferralLink(`https://fifareward.io/register/${udetails.userId}`);
        setTimeout(
          function() {
            getminingdetails(udetails.userId);
          }, 3000
        )
      }
    }else {
      router.push(`/signin`);
    }


  const getminingdetails = async (userId:any) => {
          // search database and return documents with similar keywords
          const config = {
              headers: {
                  "Content-type": "application/json"
              }
          }  
          const {data} = await axios.post("http://localhost:9000/api/mining/getminingdetails", {
              userId
          }, config);
          if(data) {
            if(data.message == "no mining details found") {
              setAmountMined(0.00005);
              setMiningStatus("Inactive");
            }else {
              setAmountMined(data.amountmined);
              setMiningStatus(data.miningstatus);
              
              if(data.miningstatus == "Active") (
                incrementMiningAmount(data.amountmined,data.miningstatus)
              )
            }
            
            console.log('mining details',data);
          }
          
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
  
  
 }, [userId, router,username,address,chainId,isConnected,walletaddress,wAlert,showTimer,walletProvider,isDragging,initialValues])

 const updateminedAmount = async (amountmined: number,miningstatus: string ) => {
    try {
      if(miningstatus != "Stopped" && miningstatus != "Inactive") {
        const newamountmined = amountmined.toFixed(6)
        // search database and return documents with similar keywords
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }  
        const {data} = await axios.post("http://localhost:9000/api/mining/updateminedamount", {
            userId, 
            newamountmined,
            miningstatus
        }, config);
        if(data) {
          setAmountMined(data.amountmined);
          setMiningStatus(data.miningstatus);
          console.log('update mine was successful',data);
          console.log(`Total mined: ${newamountmined}`);
        }
      }
  } catch (error) {
    console.error('Error incrementing count:', error);
  }
  

 }

 const incrementMiningAmount = async (amountmined: number,miningstatus: string) => {
  if (!miningInterval) {
    miningInterval = setInterval(function() {
        amountmined += miningrate;
        updateminedAmount(amountmined,miningstatus);
        console.log(" upd mine amt ran",miningInterval);
    }, 60000); // 60000 milliseconds = 1 minute
  }
 }

 const resumeMiningAmount = async (amountmined: number,miningstatus: string) => {
    console.log(" resme mining clicked")
    setInterval(function() {
        amountmined += miningrate;
        updateminedAmount(amountmined,miningstatus);
        console.log(" upd mine amt ran",miningInterval);
    }, 60000); // 60000 milliseconds = 1 minute
 }

 const startMining = async (e: any) => {
  
  try {
      // search database and return documents with similar keywords
      const config = {
          headers: {
              "Content-type": "application/json"
          }
      }  
      const {data} = await axios.post("http://localhost:9000/api/mining/startmining", {
          userId, 
          amountmined,
          miningrate,
          miningstatus
      }, config);
      if(data) {
        setAmountMined(data.amountmined);
        setMiningStatus(data.miningstatus)
        incrementMiningAmount(data.amountmined,data.miningstatus);
      }
  } catch (error) {
    console.error('Error incrementing count:', error);
  }
};

const stopminingCount = async (e: any) => {
  console.log(' min interval',miningInterval);

  // if (miningInterval) {
    // clearInterval(miningInterval);
    // miningInterval = null;
    console.log('Mining stopped.');
      try {
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }  
        const {data} = await axios.post("http://localhost:9000/api/mining/stopmining", {
            userId
        }, config);
        if(data) {
          setAmountMined(data.amountmined);
          setMiningStatus(data.miningstatus);
          console.log('Stoppend mining',data);
        }
    } catch (error) {
      console.error('Error stopping mining:', error);
    }
    
  // }
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
      if(isConnected) {
        setShowLoading(true);
        setShowBgOverlay(true);
        if(walletProvider) {
          if(amountmined < 50) {
            setShowBgOverlay(true);
            setShowAlertDanger(true);
            seterrorMessage("Min withdraw amount is 50FRD, keep mining to accumulate more");
            return;
          }
          const provider = new ethers.providers.Web3Provider(walletProvider as any);
          const signer = provider.getSigner();
          const withdamt = amountmined + "000000000000000000";
          const wamount = ethers.BigNumber.from(withdamt);
          const FRDContract = new ethers.Contract(FRDContractAddress!, FRDabi, signer);
          const reslt = await FRDContract.transfer(address,wamount);
          console.log("Account Balance: ", reslt);
          reslt.wait().then(async (receipt:any) => {
            // console.log(receipt);
            if (receipt && receipt.status == 1) {
                // transaction success.
                setShowLoading(false);
                setShowBgOverlay(false);
                setActionSuccess(true);
                setActionSuccessMessage('Stake withdrawal ');
                updateminedAmount(0,"Stopped");
            }
          })
        }
      }else {
        open();
      }
    } catch (error) {
      // setShowAlertDanger(true);
      // seterrorMessage("You must have stake to withdraw");
    }
  }

  const closeBgModal = () => {
    setShowLoading(false);
    setShowBgOverlay(false);
  }

  const closeAlertModal = () => {
    setShowAlertDanger(false);
    setShowBgOverlay(false);
    setShowLoading(false);
  }

  const closeActionModalComp = () => {
    // let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
    // hiw_bgoverlay.style.display = 'none';
    setShowBgOverlay(false);
    setActionSuccess(false);
  }

const sideBarToggleCheck = dappsidebartoggle ? dappstyles.sidebartoggled : '';

  return (
    <>
        <HelmetExport>
            <title>Mining | FifaReward</title>
            <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
        </HelmetExport>
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
        {actionsuccess && 
                <ActionSuccessModal prop={actionsuccessmessage} onChange={closeActionModalComp}/>
            }
            {showloading && <Loading />}
            {showBgOverlay && <BgOverlay onChange={closeBgModal}/>}
            {showAlertDanger && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
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

                <div className={dappstyles.stk_h1}><h1>FARM FRD</h1></div>
                <div className={dappstyles.stk_p}>
                    <div className={`${dappstyles.stake} ${dappstyles.mine_}`}>
                        <div className={`${dappstyles.stake_mod} ${theme === 'dark' ? dappstyles['darkmod'] : dappstyles['lightmod']}`} style={{borderRadius: '8px'}}>
                            <div className={dappstyles.top}><h1 className={`${theme === 'dark' ? dappstyles['darkmod'] : dappstyles['lightmod']}`}>Start Farming FRD</h1></div>
                            <div className={dappstyles.s_m}>
                              <div className={dappstyles.mine_r}>Mining rate: <span>{miningrate} FRD/minute</span></div>
                              <div className={dappstyles.mine_m}>Mined: <span className={dappstyles.mfrd}>{amountmined}</span><span className={dappstyles.m_frd}>FRD</span></div>
                              <div className={dappstyles.mine_m}>Status: <span className={dappstyles.mfrd}>{miningstatus}</span></div>
                              <div className={dappstyles.s_m_in }>
                                  <div className={dappstyles.cw_btn_div}>
                                      <div className={dappstyles.st_btns}>
                                          <div>
                                          {
                                            (() => {
                                              if(miningstatus == "Active" ) {
                                                return <button type='button' className={dappstyles.stopmining} onClick={(e) => stopminingCount(e.target)}>Stop</button>
                                              }else if(miningstatus == "Inactive") {
                                                return <button type='button' className={dappstyles.calcrwd} onClick={(e) => startMining(e.target)}>Start</button>
                                              }else if(miningstatus == "Stopped") {
                                                return <button type='button' className={dappstyles.calcrwd} onClick={() => resumeMiningAmount(amountmined,"Active")}>Resume</button>
                                              }
                                            })()
                                          }
                                          </div>

                                          <div>
                                            {miningstatus == "Stopped" ? <button type='button' className={dappstyles.withd} onClick={(e) => Withdraw(e.target)}>Withdraw</button> : <button type='button' className={dappstyles.withde}>Withdraw</button>}
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