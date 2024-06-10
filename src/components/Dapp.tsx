import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
import DappSideBar from './Dappsidebar';
// material
// import Loading from "./Loading";
// import AlertMessage from "./AlertMessage";
import dappstyles from "../styles/dapp.module.css";
import dappconalertstyles from "../styles/dappconnalert.module.css";
import dappsidebarstyles from "../styles/dappsidebar.module.css";
import { useUser } from '../contexts/UserContext';
// component
import ConnectWallet from './ConnectWalletButton';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import Head from 'next/head';
import RewardsBadge from './RewardsBadge';
import ReferralLink from './ReferralLink';
import { ThemeContext } from '../contexts/theme-context';
import FooterNavBar from './FooterNav';
import DappNav from './Dappnav';
import EarningsBreakDown from './EarningsBreakingdown';
import { FaAlignJustify, FaChevronDown, FaChevronUp, FaXmark } from 'react-icons/fa6';



const Dapp:React.FC<{}> = () =>  {

  // const dotenv = require("dotenv");
  // dotenv.config();
  const router = useRouter();
  const StakeCA = process.env.NEXT_PUBLIC_FRD_STAKING_CA;
  const { connectedaddress } = useUser();

  console.log("stake ca", StakeCA)
  // Replace 'YOUR_API_KEY' with your BscScan API key
  const apiKey = process.env.NEXT_PUBLIC_BSCSCAN_APIKEY;


  const { theme } = useContext(ThemeContext);
  const [isNavOpen, setNavOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [isSideBarToggled, setIsSideBarToggled] = useState(false)
  const [dappsidebartoggle, setSideBarToggle] = useState(false);
  // const [dropdwnIcon1, setDropdownIcon1] = useState(<FaChevronDown size='22px' className={dappsidebarstyles.sidebarlisttoggle}/>);
  // const [dropdwnIcon2, setDropdownIcon2] = useState(<FaChevronDown size='22px' className={dappsidebarstyles.sidebarlisttoggle}/>);
  const [dropdwnIcon3, setDropdownIcon3] = useState(<FaChevronDown size='22px' className={dappsidebarstyles.sidebarlisttoggle}/>);
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<number>();  
  const [walletaddress, setWalletAddress] = useState<any>("NA");  
  const [isWalletAddressUpdated,setisWalletAddressUpdated] = useState(false);

  const [sponsorWalletAddress, setsponsorWalletAddress] = useState("");
  const [userObjId, setUserObjId] = useState(""); // Initial value
  
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  // const { disconnect } = useDisconnect();

  
  const closeDappConAlerted = () => {
    setisWalletAddressUpdated(!isWalletAddressUpdated);
  }

  useEffect(() => {
  
  const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    if(!udetails && !connectedaddress ) {
      open()
    }else {
      
    }
// Create an EtherscanProvider with your API key
// const provider = new ethers.providers.EtherscanProvider('bsc', apiKey);

// // Function to check for pending transactions
// async function checkPendingTransactions() {
//   try {
//     // Get the pending transactions for the specified address
//     const transactions = await provider.getTransactionHistory(walletAddressToTrack);

//     const pendingTransactions = transactions.filter(tx => tx.confirmations === 0);

//     if (pendingTransactions.length > 0) {
//       console.log('Pending Transactions:');
//       pendingTransactions.forEach((tx) => {
//         console.log(`Transaction Hash: ${tx.hash}`);
//         console.log(`From: ${tx.from}`);
//         console.log(`To: ${tx.to}`);
//         console.log(`Value: ${ethers.utils.formatUnits(tx.value, 'ether')} BNB`);
//         console.log('---');
//       });
//     } else {
//       console.log('No pending transactions.');
//     }
//   } catch (error) {
//     console.error(`Error checking pending transactions: ${error.message}`);
//   }
// }

// // Set an interval to periodically check for pending transactions (e.g., every 10 seconds)
// setInterval(checkPendingTransactions, 10000);


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
  
  
 }, [userId,connectedaddress,address,router,isWalletAddressUpdated,username,walletaddress,userObjId,sponsorWalletAddress,isConnected,walletProvider])

 // Function to toggle the navigation menu
 const toggleSideBar = () => {

    setSideBarToggle(!dappsidebartoggle);
    setIsSideBarToggled(!isSideBarToggled);
  };

  // const toggleIconUp1 = () => {
  //     setDropdownIcon1(<FaChevronUp size='22px' className={dappsidebarstyles.sidebarlisttoggle}/>)
  // }
  // const toggleIconUp2 = () => {
  //     setDropdownIcon2(<FaChevronUp size='22px' className={dappsidebarstyles.sidebarlisttoggle}/>)
  // }
  const toggleIconUp3 = () => {
      setDropdownIcon3(<FaChevronUp size='22px' className={dappsidebarstyles.sidebarlisttoggle}/>)
  }

  // const toggleIconDown1 = () => {
  //     setDropdownIcon1(<FfaChevronDown size='22px' className={dappsidebarstyles.sidebarlisttoggle}/>)
  // }
  // const toggleIconDown2 = () => {
  //     setDropdownIcon2(<FaChevronDown size='22px' className={dappsidebarstyles.sidebarlisttoggle}/>)
  // }

  const toggleIconDown3 = () => {
      setDropdownIcon3(<FaChevronDown size='22px' className={dappsidebarstyles.sidebarlisttoggle}/>)
  }

  // const logout = () => {
  //   // Simulate a logout action
  //   localStorage.removeItem('userInfo');
  //   router.push(`/signin`);
  // };
//  async function connectAccount() {
//     if(window.ethereum)  {
//         // window.web3 = new Web3(web3.currentProvider);
//         const accounts = await window.ethereum.request({
//             method: "eth_requestAccounts",
//         });
//         // setAccounts(accounts);
//     } else {
//         //  Create WalletConnect Provider
//         const provider = new WalletConnectProvider({
//             chainId: 57,
//             rpc:'https://bsc-dataseed.binance.org/'
//         });
        
//         //  Enable session (triggers QR Code modal)
//         await provider.enable();

//         const web3Provider = new providers.Web3Provider(provider);
//     }
// }

const sideBarToggleCheck = dappsidebartoggle ? dappstyles.sidebartoggled : '';

  return (
    <>
        <Head>
            <title>Dapp - Bet, Mint NFTs, Stake, and Mine FRD to earn more FRD  | FifaReward</title>
            <meta name='description' content=' FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
        </Head>
        <DappNav/>
        <div className={`${dappstyles.main_w} ${theme === 'dark' ? dappstyles['darktheme'] : dappstyles['lighttheme']}`}>
            <div className={dappstyles.main_c}>
              <div className={`${dappstyles.sidebar} ${sideBarToggleCheck}`}>
                <DappSideBar onChange={toggleSideBar} />
              </div>
              <div className={`${dappstyles.main} ${sideBarToggleCheck}`}>
              <div className={dappstyles.con_btns}>
                {/* {!isConnected ? (
                <button title="connect wallet" type="button" onClick={() => open()} className={dappstyles.connect}>Connect Wallet</button>
                ) : (
                <button title="disconnect wallet" type="button" onClick={() => disconnect()} className={dappstyles.connected}> Disconnect </button>
                )} */}
                <ConnectWallet />
              </div>
              <button title='togglebtn' className={dappstyles.sidebar_toggle_btn} type='button' onClick={toggleSideBar}>
                <FaAlignJustify size={28} color='#f1f1f1' className={dappstyles.navlisttoggle}/> 
              </button>
              
              <div className={dappstyles.head}>
                  <div className={dappstyles.uname}><span>Hi, {username}</span></div>
                  <h1>
                      WELCOME TO FIFAREWARD 
                  </h1>
                  <p>Welcome to Fifareward DeFi Protocol, where we aim to revolutionize the world of betting, NFT market place, and gaming through decentralization. We are a team of passionate individuals committed to creating a platform that enables users to experience secure, transparent, and fair betting opportunities, NFT market place etc.</p>
                  <div className={dappstyles.get_sd_btns}>
                    <a title='get started' href='/stakes' rel='noopener noreferrer' className={dappstyles.getstarted}>Stake FRD</a>
                    <a href='https://pancakeswap.finance/swap?outputCurrency=0x6fe537b0ba874eab212bb8321ad17cf6bb3a0afc' rel='noopener noreferrer' className={dappstyles.learnmore}>Buy FRD</a>
                  </div>
              </div>
              
              <div>
                <ReferralLink />
              </div>

              <div>
                <RewardsBadge />
              </div>
              <div>
                <EarningsBreakDown />
              </div>
              
              </div>
            </div>
        </div>
          {isWalletAddressUpdated &&
          (<>
            <div className={dappconalertstyles.overlay_dap}></div>
            <div className={dappconalertstyles.dappconalerted}>
              <div className={dappconalertstyles.dappconalertclosediv}><button title="button" type='button' className={dappconalertstyles.dappconalertclosedivbtn} onClick={closeDappConAlerted}><FaXmark/></button></div>
              <div className={dappconalertstyles.dappconalert_in}>
                Wallet Address Connected To Dapp
              </div>
            </div>
          </>)}
        {/* {isOpen && (<SelectWalletModal isOpen={isOpen} closeWeb3Modal={closeWeb3Modal} />)} */}
        {/* <DappFooter /> */}
        <FooterNavBar/>
    </>
  );
}

export default Dapp