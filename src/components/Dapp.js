import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
// import DappSideBar from './Dappsidebar';
// material

// import Loading from "./Loading";
// import AlertMessage from "./AlertMessage";
import dappstyles from "../styles/dapp.module.css";
import dappconalertstyles from "../styles/dappconnalert.module.css";
import dappsidebarstyles from '../styles/dappsidebar.module.css';
// component
import { useWeb3React } from "@web3-react/core";
import { ethers } from 'ethers';
import Web3 from 'web3';
import ws from 'ws';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useDisconnect } from '@web3modal/ethers5/react';
import axios from 'axios';
import AlertMessage from './AlertMessage';
import { ThemeContext } from '../contexts/theme-context';
import DappNav from './Dappnav';
import TAFAAbi from '../../artifacts/contracts/TAFA.sol/TAFA.json';
import StakeAbi from '../../artifacts/contracts/Stake.sol/Stake.json';
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

  // Replace 'YOUR_API_KEY' with your BscScan API key
const apiKey = process.env.BSCSCAN_APIKEY;

// Replace 'YOUR_WALLET_ADDRESS' with the BSC wallet address you want to track
const walletAddressToTrack = '0x5951d5Cb5cFb9022B5ab5e9848fD1454C6dA7842';

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
  const [walletaddress, setWalletAddress] = useState("NA");  
  const [isWalletAddressUpdated,setisWalletAddressUpdated] = useState(false);

  const [signature, setSignature] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [sponsorWalletAddress, setsponsorWalletAddress] = useState("");
  const [userObjId, setUserObjId] = useState(""); // Initial value
  const [verified, setVerified] = useState();
  
  const { open } = useWeb3Modal();
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

  

  const closeDappConAlerted = () => {
    setisWalletAddressUpdated(!isWalletAddressUpdated);
  }
  useEffect(() => {
    
    const udetails = JSON.parse(localStorage.getItem("userInfo"));
    if(udetails && udetails !== null && udetails !== "") {
      const username_ = udetails.username;  
      if(username_) {
        setUsername(username_);
        setUserId(udetails.userId)
        setUserObjId(udetails._id)
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

  if(isConnected) {
    setWalletAddress(address)

    async function getSponsorWalletAddress() {
      try {
        const config = {
        headers: {
            "Content-type": "application/json"
        }
        }  
        const {data} = await axios.post("https://tafabackend.onrender.com/api/users/getsponsorwalletaddress", {
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
      const provider = new ethers.providers.Web3Provider(walletProvider)
      const signer = provider.getSigner();
      const StakeContract = new ethers.Contract(StakeAddress, StakeAbi.abi, signer);
      const reslt = await StakeContract.addReferrer(sponsorWalletAddress);
      console.log("Account Balance: ", reslt);
    }
    
      async function updateWalletAddress() {
        try {
          const config = {
          headers: {
              "Content-type": "application/json"
          }
          }  
          const {data} = await axios.post("https://tafabackend.onrender.com/api/users/updatewalletaddress/", {
            walletaddress,
            username
          }, config);
          console.log('update wallet data', data.message);
          // setisWalletAddressUpdated(!isWalletAddressUpdated);
        } catch (error) {
          console.log(error)
        }
    }
    updateWalletAddress();
  }



  // Replace 'YOUR_BSC_NODE_WS_URL' with the BSC WebSocket URL
  const bscWsUrl = 'wss://go.getblock.io/1e188a9b60fd41fbbc97b7909dfec3e2';
  // Assuming you have a properly initialized web3 instance
  const web3 = new Web3.providers.WebsocketProvider(bscWsUrl);
  // new Web3('https://bsc-dataseed1.binance.org:443');
  const options = {
    fromBlock: '0x0',
    address: '0xcd5485b34c9902527bbee21f69312fe2a73bc802',
  };
  
  const handleSubscriptionError = (error) => {
    console.error('Error when watching incoming transactions:', error.message);
  };
  
  const handleSubscriptionData = (log) => {
    console.log('Got something back:', log);
    // Your continued code...
  };
  
  const subscribeToLogs = async () => {
    try {
      const subscription = await web3.eth.subscribe('logs', options);
      subscription.on('data', handleSubscriptionData);
    } catch (error) {
      handleSubscriptionError(error);
    }
  };  
  // Start the subscription
  subscribeToLogs();

//   const subscription = web3.eth.subscribe('logs', {
//     address: '0x5951d5Cb5cFb9022B5ab5e9848fD1454C6dA7842',
//     topics: ['0x12345...']
// }, function(error, result){
//     if (!error)
//         console.log('sub result',result);
// });
  

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
        <DappNav/>
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
                <button onClick={() => open()} className={dappstyles.connect}>Connect Wallet</button>
                ) : (
                <button onClick={() => disconnect()} className={dappstyles.connected}><span>connected</span>Disconnect</button>
                )}
              </div>
              <button title='togglebtn' className={dappstyles.sidebar_toggle_btn} type='button' onClick={toggleSideBar}>
                <FontAwesomeIcon icon={faAlignJustify} size='lg' className={dappstyles.navlisttoggle}/> 
              </button>
                <div className={dappstyles.reflink}>
                    <div className={dappstyles.reflinkdex}>Ref Link: <input title="input" value={referralLink} onChange={(e) => setreferralLink(e.target.value)} /><button type='button' onClick={handleCopyClick}>{buttonText}</button> </div>
                    <div><small>Share referral link to earn more tokens!</small></div>
                    <div>Connected Wallet: <span style={{color: 'orange'}}>{walletaddress}</span></div>
                </div>

                <div className={dappstyles.head}>
                    <div className={dappstyles.uname}><span>Hi, {username}</span></div>
                    <h1>
                        WELCOME TO TAFAXTRA 
                    </h1>
                    <p>TAFAXtra is a smart contract platform that replicates the traditional Certificate of Deposit but on the blockchain. It allows users to stake their TAFA tokens to earn fixed interest, 2% daily ROI. It also has NFT functionality, and is backed by ownership of Validator Nodes.</p>
                    <p>A community DAO manages the TAFA Vault, which collects fees from trade tax and early unstakes. The usage of these funds will be voted on by the community, to use on things such as purchasing additional Validator Nodes, Marketing, Conferences, Token Burns etc.</p>
                    <div className={dappstyles.get_sd_btns}>
                      <a title='get started' href='/stakes' rel='noopener noreferrer' className={dappstyles.getstarted}>Stake TaFaXtra</a>
                      <a href='https://pancakeswap.finance/swap?outputCurrency=0x5ae155F89308CA9050f8Ce1C96741BaDd342C26B' rel='noopener noreferrer' className={dappstyles.learnmore}>Buy TafaXtra</a>
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
        <DappFooter />
    </>
  );
}

export default Dapp