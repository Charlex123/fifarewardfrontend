import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
import DappSideBar from './Dappsidebar';
// material
import { useUser } from '../contexts/UserContext';
// import Loading from "./Loading";
// import AlertMessage from "./AlertMessage";
import dappstyles from "../styles/dapp.module.css";
// component
// import SelectWalletModal from "./web3-Modal";
// import { providers } from "ethers";
import { ThemeContext } from '../contexts/theme-context';
import DappNav from './Dappnav';
import { ethers } from 'ethers';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useDisconnect } from '@web3modal/ethers5/react';
import StakeAbi from '../../artifacts/contracts/FRDStaking.sol/FRDStaking.json';
import DappFooter from './DappFooter';
import ReferralLink from './ReferralLink';
import Head from 'next/head';
import { FaAlignJustify } from 'react-icons/fa6';

const Referrals = () =>  {

  const router = useRouter();
  const FRDCA = process.env.NEXT_PUBLIC_FRD_DEPLOYED_CA;
  const StakeCA = process.env.NEXT_PUBLIC_FRD_STAKING_CA;
  const { connectedaddress } = useUser();
  const { theme } = useContext(ThemeContext);
  const [isNavOpen, setNavOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [stakereferrals, setStakeReferrals] = useState<[]>([]);
  const [betreferrals, setBetReferrals] = useState<[]>([]);
  const [isSideBarToggled, setIsSideBarToggled] = useState(false)
  const [dappsidebartoggle, setSideBarToggle] = useState(false);
  // const [dappConnector,setDappConnector] = useState(false);
  
  // const { isOpen, onOpen, onClose, closeWeb3Modal,openWeb3Modal } = useContext(Web3ModalContext);
  const { open, close } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();
  
  useEffect(() => {
    
    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    if(!udetails) {
      open()
    }else {
      
    }
    
    async function GetReferrals() {
      try {
        const provider = new ethers.providers.Web3Provider(walletProvider as any)
        const signer = provider.getSigner(connectedaddress!);
        const StakeContract = new ethers.Contract(StakeCA!, StakeAbi, signer);
        const stakeref = await StakeContract.getReferrals(connectedaddress);
        setStakeReferrals(stakeref);
        const BetContract = new ethers.Contract(StakeCA!, StakeAbi, signer);
        const betref = await BetContract.getReferrals(connectedaddress);
        setBetReferrals(betref)
      } catch (error: any) {
        
      }
    }
    GetReferrals();

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

 
  return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
  };
  
  
 }, [ router])

 // Function to toggle the navigation menu
 const toggleSideBar = () => {
    setSideBarToggle(!dappsidebartoggle);
    setIsSideBarToggled(!isSideBarToggled);
  };


const sideBarToggleCheck = dappsidebartoggle ? dappstyles.sidebartoggled : '';

  return (
    <>
        <Head>
            <title>Referrals | FifaReward</title>
            <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
        </Head>
        <DappNav/>
        <div className={`${dappstyles.main_w} ${theme === 'dark' ? dappstyles['darktheme'] : dappstyles['lighttheme']}`}>
            <div className={dappstyles.main_c}>
              <div className={`${dappstyles.sidebar} ${sideBarToggleCheck}`}>
                  <DappSideBar onChange={toggleSideBar}/>
              </div>
              <div className={`${dappstyles.main} ${sideBarToggleCheck}`}>
              <div className={dappstyles.con_btns}>
              </div>
              <button title='togglebtn' className={dappstyles.sidebar_toggle_btn} type='button' onClick={toggleSideBar}>
                <FaAlignJustify size='22px' className={dappstyles.navlisttoggle}/> 
              </button>
                <div className={dappstyles.reflink}>
                    <ReferralLink />
                </div>

                <div className={dappstyles.head}>
                    <h1>
                        MY REFERRALS 
                    </h1>
                    { betreferrals.length > 0 ?
                    (<div>
                        <h3>
                            Bet Referrals
                        </h3>
                        <table id="resultTable" className="table01 margin-table">
                            <thead>
                                <tr>
                                    <th id="accountTh" className="align-L">S/N</th>
                                    <th id="balanceTh">Wallet Address</th>
                                </tr>
                            </thead>
                            <tbody id="userData">
                            {betreferrals.map((downline:any, index) =>(
                                <tr key={index}>
                                  <td>{index+1}</td>
                                  <td>{downline.walletaddress}</td>
                              </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>) : 
                    <div className={dappstyles.notfound_p}>
                      <div className={dappstyles.notfound}>No bet referrals found </div>
                    </div> 
                    }

                    { stakereferrals.length > 0 ?
                      (<div>
                          <h3>
                              Stake Referrals
                          </h3>
                          <table id="resultTable" className="table01 margin-table">
                              <thead>
                                  <tr>
                                      <th id="accountTh" className="align-L">S/N</th>
                                      <th id="balanceTh">Wallet Address</th>
                                  </tr>
                              </thead>
                              <tbody id="userData">
                              {stakereferrals.map((downline:any, index) =>(
                                  <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{downline.walletaddress}</td>
                                </tr>
                              ))}
                              </tbody>
                          </table>
                      </div>) : 
                      <div className={dappstyles.notfound_p}>
                        <div className={dappstyles.notfound}>No stake referrals found </div>
                      </div> 
                    }

                </div>
              </div>
            </div>
        </div>
        {/* {dappConnector && 
          (<>
            <div className={dappconalertstyles.overlay_dap}></div>
            <div className={dappconalertstyles.dappconalert}>
              <div className={dappconalertstyles.dappconalertclosediv}><button type='button' className={dappconalertstyles.dappconalertclosedivbtn} onClick={closeDappConAlert}><FontAwesomeIcon icon={faXmark}/></button></div>
              <div className={dappconalertstyles.dappconalert_in}>
                Metamask not found, install metamask to connect to dapp
              </div>
            </div>
          </>)} */}
        <DappFooter />
    </>
  );
}

export default Referrals