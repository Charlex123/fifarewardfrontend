import React from 'react';
import { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
import DappSideBar from './Dappsidebar';
// material
import FRDAbi from '../../artifacts/contracts/FifaRewardToken.sol/FifaRewardToken.json';
// import Loading from "./Loading";
// import AlertMessage from "./AlertMessage";
import dappstyles from "../styles/dapp.module.css";
import dappconalertstyles from "../styles/dappconnalert.module.css";
import { ethers } from 'ethers';
// component
import ConnectWallet from './ConnectWalletButton';
import ReferralLink from './ReferralLink';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { ThemeContext } from '../contexts/theme-context';
import { useUser } from '../contexts/UserContext';
import DappNav from './Dappnav';
import FRDabi from "../../artifacts/contracts/FifaRewardToken.sol/FifaRewardToken.json"
import FooterNavBar from './FooterNav';
import Loading from './Loading';
import BgOverlay from './BgOverlay';
import AlertDanger from './AlertDanger';
import RewardsBadge from './RewardsBadge';
import ActionSuccessModal from './ActionSuccess';
import Head from 'next/head';
import axios from 'axios';
import { FaAlignJustify, FaXmark } from 'react-icons/fa6';
import { number } from 'prop-types';

const Farming = () =>  {

  const { theme} = useContext(ThemeContext);
  const { connectedaddress } = useUser();
  const [isNavOpen, setNavOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [isSideBarToggled, setIsSideBarToggled] = useState(false)
  const [dappsidebartoggle, setSideBarToggle] = useState(false);
  // const [dropdwnIcon1, setDropdownIcon1] = useState(<FaChevronDown size='22px' className={dappsidebarstyles.sidebarlisttoggle}/>);
  // const [dropdwnIcon2, setDropdownIcon2] = useState(<FaChevronDown size='22px' className={dappsidebarstyles.sidebarlisttoggle}/>);
  const [username, setUsername] = useState("");
  const [dappConnector,setDappConnector] = useState(false);
  const [amountmined, setAmountMined] = useState<number>(0.00005);
  const [usdequivfrdamount, setUsdEquivFrdAmount] = useState<number>(0);
  const [usdprice, setUsdPrice] = useState<number>(0);
  const [errorMessage, seterrorMessage] = useState("");
  const [miningstatus, setMiningStatus] = useState<string>("Inactive");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<number[]>([]);
  const [showloading, setShowLoading] = useState<boolean>(false);
  const [showAlertDanger,setShowAlertDanger] = useState<boolean>(false);
  const [showBgOverlay,setShowBgOverlay] = useState<boolean>(false);
  const [actionsuccess, setActionSuccess] = useState(false);
  const [actionsuccessmessage, setActionSuccessMessage] = useState<string>('');
  const FRDCA = process.env.NEXT_PUBLIC_FRD_DEPLOYED_CA;
  // const [deltaX, setDeltaX] = useState(0);
  // const [draggedRangeIndex, setDraggedRangeIndex] = useState<number | null>(null);


  const [showTimer, setShowTimer] = useState(false);
  const miningrate = 0.00005;
  // const { isOpen, onOpen, onClose, closeWeb3Modal,openWeb3Modal } = useContext(Web3ModalContext);
  const { walletProvider } = useWeb3ModalProvider();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();

  const FRDContractAddress = process.env.NEXT_PUBLIC_FRD_DEPLOYED_CA;

  let miningInterval: ReturnType<typeof setInterval> | null = null;
  
  const closeDappConAlert = () => {
    setDappConnector(!dappConnector);
  }

  useEffect(() => {

    const getUSDEQUIVFRDAMOUNT =  async () => {
      try {
        const config = {
          headers: {
              "Content-type": "application/json"
          }
        }  
        const {data} = await axios.get("../../../../api/gettokenprice", config);
        setUsdEquivFrdAmount(data.usdequivalentfrdamount);
        setUsdPrice(data.usdprice);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getUSDEQUIVFRDAMOUNT();
    
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
  
  
 }, [showTimer,walletProvider,isDragging,initialValues])

 

 useEffect(() => {
  const getMiningDetails = async (address: any) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      };

      const { data } = await axios.post("https://fifarewardbackend-1.onrender.com/api/mining/getminingdetails", {
        address: address
      }, config);

      if (data) {
        if (data.message === "no mining details found") {
          setAmountMined(0.00005);
          setMiningStatus("Inactive");
        } else {
          setAmountMined(data.amountmined);
          setMiningStatus(data.miningstatus);

          if (data.miningstatus === "Active") {
            incrementMiningAmount("Active");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching mining details:", error);
    }
  };

  if (connectedaddress) {
    getMiningDetails(connectedaddress);
  }

  const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
  if (!userInfo) {
    open();
  } else {
    setUsername(userInfo.username);
  }
}, [connectedaddress]);


 const updateminedAmount = async (amountmined: number,miningstatus: string ) => {
    try {
      // setShowBgOverlay(true)
      // setShowLoading(true)
      if(miningstatus != "Stopped" && miningstatus != "Inactive") {
        const newamountmined = amountmined.toFixed(6)
        // search database and return documents with similar keywords
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }  
        const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/mining/updateminedamount", {
            address: connectedaddress, 
            newamountmined,
            miningstatus
        }, config);
        if(data) {
          setAmountMined(data.amountmined);
          setMiningStatus(data.miningstatus);
          setShowLoading(false)
          setShowBgOverlay(false)
        }
      }
  } catch (error) {
    console.error('Error incrementing count:', error);
  }
  

 }

 const getandupdateminingdetails = async (connectedaddress: string,miningstatus: string) => {
  // search database and return documents with similar keywords
  const config = {
      headers: {
          "Content-type": "application/json"
      }
  }  
  const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/mining/getminingdetails", {
      address:connectedaddress
  }, config);
    if(data) {
      setShowBgOverlay(false)
      setShowLoading(false)
      setAmountMined(data.amountmined);
      setMiningStatus(data.miningstatus);
      const newamtmined = data.amountmined + miningrate;
      if(data.miningstatus !== "Stopped" && data.miningstatus !== "Inactive" && miningstatus === "Active") {
        updateminedAmount(newamtmined!,miningstatus);
      }else if(data.miningstatus === "Stopped" && miningstatus === "Active") {
        updateminedAmount(newamtmined!,miningstatus);
      }
      
    }
    
  
}

 const incrementMiningAmount = async (miningstatus: string) => {
  getandupdateminingdetails(connectedaddress!,miningstatus)
  setInterval(function() {
      getandupdateminingdetails(connectedaddress!,miningstatus)
    }, 60000); 
 }

 const resumeMiningAmount = async () => {
    setShowLoading(true)
    setShowBgOverlay(true);
    incrementMiningAmount("Active");
 }

 const startMining = async (e: any) => {
  
  try {
    setShowBgOverlay(true)
    setShowLoading(true)
      // search database and return documents with similar keywords
      try {
        const provider = new ethers.providers.Web3Provider(walletProvider as any);
            const signer = provider.getSigner();

            /* next, create the item */
            let FRDcontract = new ethers.Contract(FRDCA!, FRDAbi, signer);
            
            let transaction = await FRDcontract.balanceOf(connectedaddress);
            
            let frdBal = ethers.utils.formatEther(transaction);

            if(parseInt(frdBal) < usdequivfrdamount) {
              setShowAlertDanger(true);
              seterrorMessage(`You need a minimum of ${usdequivfrdamount.toLocaleString()}FRD to proceed!`)
              setShowLoading(false);
              return;
            }else {
              const config = {
                  headers: {
                      "Content-type": "application/json"
                  }
              }  
              const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/mining/startmining", {
                  address: connectedaddress, 
                  amountmined,
                  miningrate,
                  miningstatus
              }, config);
              if(data) {
                setAmountMined(data.amountmined);
                setMiningStatus(data.miningstatus)
                incrementMiningAmount(data.miningstatus);
                setActionSuccess(true);
                setActionSuccessMessage(`Mining activation `);
                setShowBgOverlay(false)
                setShowLoading(false)
              }
            }

      }catch(error: any) {

      }
      
  } catch (error) {
    console.error('Error incrementing count:', error);
  }
};

const stopminingCount = async (e: any) => {

  // if (miningInterval) {
    // clearInterval(miningInterval);
    // miningInterval = null;
    setShowLoading(true)
    setShowBgOverlay(true)
      try {
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }  
        const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/mining/stopmining", {
            address:connectedaddress
        }, config);
        if(data) {
          setAmountMined(data.amountmined);
          setMiningStatus(data.miningstatus);
          setShowLoading(false)
          setShowBgOverlay(false)
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
          
          try {
            const reslt = await FRDContract.transfer(connectedaddress,wamount);;
            const receipt = await reslt.wait();
  
            if (receipt && receipt.status === 1) {
                setShowLoading(false);
                setShowBgOverlay(false);
                setActionSuccess(true);
                setActionSuccessMessage('Stake withdrawal ');
                updateminedAmount(0,"Stopped");
            }
          } catch (error: any) {
            console.log(error)
            setShowAlertDanger(true);
            seterrorMessage(error.code || error.message);
            setShowLoading(false);
          }

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
        <Head>
            <title>Farm FRD | FifaReward</title>
            <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
        </Head>
        <DappNav/>
        {dappConnector && (<>
            <div className={dappconalertstyles.overlay_dap}></div>
            <div className={dappconalertstyles.dappconalert}>
              <div className={dappconalertstyles.dappconalertclosediv}><button title='button' type='button' className={dappconalertstyles.dappconalertclosedivbtn} onClick={closeDappConAlert}><FaXmark /></button></div>
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
                <FaAlignJustify size='22px' className={dappstyles.navlisttoggle}/> 
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
                        <div className={`${dappstyles.stake_mod}`} style={{borderRadius: '20px'}}>
                            <div className={dappstyles.top}><h1 className={`${theme === 'dark' ? dappstyles['darkmod'] : dappstyles['lightmod']}`}>Start Farming FRD</h1></div>
                            <div className={dappstyles.s_m}>
                              <div className={dappstyles.mine_r}>Mining rate: <span>{miningrate} FRD/minute</span></div>
                              <div className={dappstyles.mine_m}>Mined: <span className={dappstyles.mfrd}>{amountmined}</span><span className={dappstyles.m_frd}>FRD</span></div>
                              <div className={dappstyles.mine_m}>Status: <span className={dappstyles.mfrd}>{miningstatus}</span></div>
                              <div className={dappstyles.s_m_in }>
                                  <div className={dappstyles.cw_btn_div}>
                                      <div className={dappstyles.farm_btns}>
                                          <div>
                                          {
                                            (() => {
                                              if(miningstatus == "Active" ) {
                                                return <button type='button' className={dappstyles.stopmining} style={{color: '#f1f1f1'}} onClick={(e) => stopminingCount(e.target)}>Stop</button>
                                              }else if(miningstatus == "Inactive") {
                                                return <button type='button' className={dappstyles.calcrwd} style={{color: '#f1f1f1'}} onClick={(e) => startMining(e.target)}>Start</button>
                                              }else if(miningstatus == "Stopped") {
                                                return <button type='button' className={dappstyles.calcrwd} style={{color: '#f1f1f1'}} onClick={() => resumeMiningAmount()}>Resume</button>
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

export default Farming