import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import DappSideBar from './Dappsidebar';
// material

// import Loading from "./Loading";
// import AlertMessage from "./AlertMessage";
import dappstyles from "../styles/dapp.module.css";
import dappconalertstyles from "../styles/dappconnalert.module.css";
import dappsidebarstyles from "../styles/dappsidebar.module.css";
// component
import ConnectWallet from './ConnectWalletButton';
import { ethers } from 'ethers';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import axios from 'axios';
import AlertMessage from './AlertMessage';
import HelmetExport from 'react-helmet';
import RewardsBadge from './RewardsBadge';
import ReferralLink from './ReferralLink';
import { ThemeContext } from '../contexts/theme-context';
import FooterNavBar from './FooterNav';
import DappNav from './Dappnav';
import StakeAbi from '../../artifacts/contracts/FRDStaking.sol/FRDStaking.json';
import FRDAbi from '../../artifacts/contracts/FifaRewardToken.sol/FifaRewardToken.json';
import DappFooter from './DappFooter';
import EarningsBreakDown from './EarningsBreakingdown';
import { fas, faCheck, faCheckCircle, faChevronDown,faAlignJustify, faCircleDollarToSlot, faGift, faHandHoldingDollar, faPeopleGroup, faChevronUp, faAngleDoubleRight, faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome, faFacebook,faDiscord, faTelegram, faMedium, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';

library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);


const Dapp:React.FC<{}> = () =>  {

  // const dotenv = require("dotenv");
  // dotenv.config();
  const router = useRouter();
  const FRDCA = process.env.NEXT_PUBLIC_FRD_DEPLOYED_CA;
  const StakeCA = process.env.NEXT_PUBLIC_FRD_STAKING_CA;

  console.log("stake ca", StakeCA)
  // Replace 'YOUR_API_KEY' with your BscScan API key
  const apiKey = process.env.NEXT_PUBLIC_BSCSCAN_APIKEY;


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

  if(isConnected) {
    setWalletAddress(address)

    async function getSponsorWalletAddress() {
      try {
        const config = {
        headers: {
            "Content-type": "application/json"
        }
        }  
        const {data} = await axios.post("https://fifareward.onrender.com/api/users/getsponsorwalletaddress", {
          userObjId,
        }, config);
        if(data.message === "You do not have a sponsor") {
        }else {
          setsponsorWalletAddress(data.message);
          Addreferrer();
        }
        
      } catch (error) {
        console.log(error)
      }
  }
  getSponsorWalletAddress();

    async function Addreferrer() {
      // const [accounta] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(walletProvider as any)
      const signer = provider.getSigner();
      const StakeContract = new ethers.Contract(StakeCA!, StakeAbi, signer);
      const reslt = await StakeContract.addReferrer(sponsorWalletAddress);
      console.log("Account Balance: ", reslt);
    }
    
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
  
  
 }, [userId,address,router,isWalletAddressUpdated,username,walletaddress,userObjId,sponsorWalletAddress,isConnected,walletProvider])

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
        <HelmetExport>
            <title>Dapp - Bet, Mint NFTs, Stake, and Mine FRD to earn more FRD  | FifaReward</title>
            <meta name='description' content=' FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
        </HelmetExport>
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
                <FontAwesomeIcon icon={faAlignJustify} size='lg' className={dappstyles.navlisttoggle}/> 
              </button>

              <div>
                <RewardsBadge />
              </div>
              <div>
                <EarningsBreakDown />
              </div>
              <div>
                <ReferralLink />
              </div>

                <div className={dappstyles.head}>
                    <div className={dappstyles.uname}><span>Hi, {username}</span></div>
                    <h1>
                        WELCOME TO FIFAREWARD 
                    </h1>
                    <p>FifaReward is a smart contract platform that replicates the traditional Certificate of Deposit but on the blockchain. It allows users to stake their FRD tokens to earn fixed interest, 2% daily ROI. It also has NFT functionality, and is backed by ownership of Validator Nodes.</p>
                    <p>A community DAO manages the FRD Vault, which collects fees from trade tax and early unstakes. The usage of these funds will be voted on by the community, to use on things such as purchasing additional Validator Nodes, Marketing, Conferences, Token Burns etc.</p>
                    <div className={dappstyles.get_sd_btns}>
                      <a title='get started' href='/stakes' rel='noopener noreferrer' className={dappstyles.getstarted}>Stake FRD</a>
                      <a href='https://pancakeswap.finance/swap?outputCurrency=0x5ae155F89308CA9050f8Ce1C96741BaDd342C26B' rel='noopener noreferrer' className={dappstyles.learnmore}>Buy FRD</a>
                    </div>
                </div>
              </div>
            </div>
        </div>
          {isWalletAddressUpdated &&
          (<>
            <div className={dappconalertstyles.overlay_dap}></div>
            <div className={dappconalertstyles.dappconalerted}>
              <div className={dappconalertstyles.dappconalertclosediv}><button title="button" type='button' className={dappconalertstyles.dappconalertclosedivbtn} onClick={closeDappConAlerted}><FontAwesomeIcon icon={faXmark}/></button></div>
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