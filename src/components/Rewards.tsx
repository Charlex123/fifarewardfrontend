import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
import DappSideBar from './Dappsidebar';
// material
import { useUser } from '../contexts/UserContext';
import Image from 'next/image';
import bronzemedal from '../assets/images/medal.png'
import goldmedal from '../assets/images/gold-medal.png'
import silvermedal from '../assets/images/silver-medal.png'
// import Loading from "./Loading";
// import AlertMessage from "./AlertMessage";
import ConnectWallet from './ConnectWalletButton';
import dappstyles from "../styles/dapp.module.css";
import dappconalertstyles from "../styles/dappconnalert.module.css";
// component
import ReferralLink from './ReferralLink';
import { ethers } from 'ethers';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import StakeAbi from '../../artifacts/contracts/FRDStaking.sol/FRDStaking.json';
import BettingAbi from '../../artifacts/contracts/FRDBetting.sol/FRDBetting.json';
import FRDNFTFeaturesAbi from '../../artifacts/contracts/FRDNFTMarketPlaceFeatures.sol/FRDNFTMarketPlaceFeatures.json';
import { ThemeContext } from '../contexts/theme-context';
import Head from 'next/head';
import DappNav from './Dappnav';
import DappFooter from './DappFooter';
import FooterNavBar from './FooterNav';
import RewardsBadge from './RewardsBadge';
import { FaAlignJustify, FaXmark } from 'react-icons/fa6';

const Rewards = () =>  {

  const router = useRouter();
  const { connectedaddress } = useUser();
  const { theme} = useContext(ThemeContext);
  const [isNavOpen, setNavOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [isSideBarToggled, setIsSideBarToggled] = useState(false)
  const [dappsidebartoggle, setSideBarToggle] = useState(false);
  const [username, setUsername] = useState("");
  const [userbadge, setUserbadge] = useState("");
  const [userId, setUserId] = useState("");  
  const [dappConnector,setDappConnector] = useState(false);

  const [errorMessage, seterrorMessage] = useState("");
  const [walletaddress, setWalletAddress] = useState("NA"); 
  const [initialValues, setInitialValues] = useState<number[]>([]);
  const [stakecount, setStakeCount] = useState<number>(0);
  const [sumofcounts, setSumOfCounts] = useState<number>(0);
  const [betcount, setBetCount] = useState<number>(0);  
  const [nftcount, setNFTCount] = useState<number>(0);
  // const [deltaX, setDeltaX] = useState(0);
  // const [draggedRangeIndex, setDraggedRangeIndex] = useState<number | null>(null);


  
  // const { isOpen, onOpen, onClose, closeWeb3Modal,openWeb3Modal } = useContext(Web3ModalContext);
  const { walletProvider } = useWeb3ModalProvider();
  const { chainId, isConnected } = useWeb3ModalAccount();

  const FRDCA = process.env.NEXT_PUBLIC_FRD_DEPLOY_CA;
  const StakeCA = process.env.NEXT_PUBLIC_FRD_STAKING_CA;
  const BettingCA = process.env.NEXT_PUBLIC_FRD_BETTING_CA;
  const NFTFeaturesCA = process.env.NEXT_PUBLIC_FRD_NFTMARKETPLACE_FEATURES_CA;
  

  const closeDappConAlert = () => {
    setDappConnector(!dappConnector);
  }

  
  useEffect(() => {
    
    const udetails = JSON.parse(localStorage.getItem("userInfo")!);

    // get stake count
    const StakeCount = async () => {
      try {
        // setWAlert(!wAlert);
        if(walletProvider) {
          const provider = new ethers.providers.Web3Provider(walletProvider as any)
          const signer = provider.getSigner();
          
          const StakeContract = new ethers.Contract(StakeCA!, StakeAbi, signer);
          const reslt = await StakeContract.getUserStakeCount(connectedaddress);
          setStakeCount(reslt);
          console.log(reslt)
        }
          
      } catch (error:any) {
        console.log(error)
      }
    }
    StakeCount()

    // get bet count
    const BetCount = async () => {
      try {
        // setWAlert(!wAlert);
        if(walletProvider) {
          const provider = new ethers.providers.Web3Provider(walletProvider as any)
          const signer = provider.getSigner();
          
          const Betting = new ethers.Contract(BettingCA!, BettingAbi, signer);
          const createdbetreslt = await Betting.getBetIdsCreatedByUserCount(connectedaddress);

          const joinedbetreslt = await Betting.getBetIdsUserJoinedCount(connectedaddress);
          sumTwoIntegers(createdbetreslt.toNumber(),joinedbetreslt.toNumber());
        }
          
      } catch (error:any) {
        console.log(error)
      }
    }
    BetCount()

    // get bet count
    const NFTCount = async () => {
      try {
        // setWAlert(!wAlert);
        if(walletProvider) {
          const provider = new ethers.providers.Web3Provider(walletProvider as any)
          const signer = provider.getSigner();
          
          const NFTFeatureContract = new ethers.Contract(NFTFeaturesCA!, FRDNFTFeaturesAbi, signer);
          const reslt = await NFTFeatureContract.getUserNFTMintedCount();
          setNFTCount(reslt);
          console.log(reslt)
        }
          
      } catch (error:any) {
        console.log(error)
      }
    }
    NFTCount();

    function sumTwoIntegers( createdbetcount: number, joinedbetcount: number) {
      try {
        if (Number.isInteger(createdbetcount) && Number.isInteger(joinedbetcount)) {
          const sum = createdbetcount + joinedbetcount;
          console.log("defttr", sum);
          setBetCount(sum);
          return sum;
        } else {
          throw new Error("All arguments must be integers.");
        }
      } catch (error: any) {
        console.log("sum error", error);
      }
    }

    
    function sumThreeIntegers(stakecount: number, betcount: number, nftcount: number) {
      try {
        if (Number.isInteger(stakecount) && Number.isInteger(betcount) && Number.isInteger(nftcount)) {
          const sum = stakecount + betcount + nftcount;
          console.log("defttr", sum);
          setSumOfCounts(sum)
          return sum;
        } else {
          throw new Error("All arguments must be integers.");
        }
      } catch (error: any) {
        console.log("sum error", error);
      }
    }

    // Call the function after 6 seconds
setTimeout(() => {
  sumThreeIntegers(stakecount, betcount, nftcount);
}, 6000);


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
  
  
 }, [userId, router,username,connectedaddress,chainId,isConnected,walletaddress,walletProvider,initialValues])


 // Function to toggle the navigation menu
 const toggleSideBar = () => {
    setSideBarToggle(!dappsidebartoggle);
    setIsSideBarToggled(!isSideBarToggled);
  };



const sideBarToggleCheck = dappsidebartoggle ? dappstyles.sidebartoggled : '';

  return (
    <>
        <Head>
            <title>Rewards | FifaReward</title>
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

                <div className={`${dappstyles.main_w} ${theme === 'dark' ? dappstyles['darktheme'] : dappstyles['lighttheme']}`}>
                  <div className={dappstyles.main_c}>
                    <div className={`${dappstyles.rwds} ${theme === 'dark' ? dappstyles['darkmod'] : dappstyles['lightmod']} `}>
                      <div>
                        <div className={dappstyles.points}>
                          <div>
                            Total Points: {sumofcounts}
                          </div>
                          <div>
                            <span><Image src={bronzemedal} alt='medal' height={30} width={25} style={{float: 'left'}}/> {userbadge}</span>
                          </div>
                        </div>
                        <p>
                          You're a <span className={dappstyles.ubagde}>{userbadge}</span> user with {sumofcounts} total points, you need a minimum of 50 points to be a <span className={dappstyles.ubagde}>silver</span> with it's benefits, engage more in <a href='/nft/createnft' className={dappstyles.cat}>Minting NFT</a>, <a href='/betting' className={dappstyles.cat}>Bet</a>, <a href='/gaming' className={dappstyles.cat}>Gaming</a>, <a href='/stakes' className={dappstyles.cat}>Staking NFT</a>, <a href='/mining' className={dappstyles.cat}>Farming</a>, etc to be upgraded
                          to <span className={dappstyles.ubagde}>silver</span> membership
                        </p>
                      </div>
                      <h3>No rewards found, keep performing actions like minting nfts, betting, staking and mining for more rewards </h3>
                    </div>
                  </div>
                </div>

              </div>
            </div>
        </div>
        {/* {isOpen && (<SelectWalletModal isOpen={isOpen} closeWeb3Modal={closeWeb3Modal} />)} */}
        <DappFooter />
        <FooterNavBar />
    </>
  );
}

export default Rewards