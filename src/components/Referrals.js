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
// import SelectWalletModal from "./web3-Modal";
import { useWeb3React } from "@web3-react/core";
// import { providers } from "ethers";
import axios from 'axios';
import AlertMessage from './AlertMessage';
import { ThemeContext } from '../contexts/theme-context';
import DappNav from './Dappnav';
import { ethers } from 'ethers';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useDisconnect } from '@web3modal/ethers5/react';
import TAFAAbi from '../../artifacts/contracts/TAFA.sol/TAFA.json';
import StakeAbi from '../../artifacts/contracts/Stake.sol/Stake.json';
import DappFooter from './DappFooter';
import { fas, faCheck, faCheckCircle, faChevronDown,faAlignJustify, faCircleDollarToSlot, faGift, faHandHoldingDollar, faPeopleGroup, faChevronUp, faAngleDoubleRight, faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome, faFacebook,faDiscord, faTelegram, faMedium, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';

library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const Referrals = () =>  {

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
  const [walletaddress, setWalletAddress] = useState("NA");  
  const [isWalletAddressUpdated,setisWalletAddressUpdated] = useState(false);
  // const [dappConnector,setDappConnector] = useState(false);

  const [signature, setSignature] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [sponsorWalletAddress, setsponsorWalletAddress] = useState("");
  const [userObjId, setUserObjId] = useState(""); // Initial value
  const [verified, setVerified] = useState();
  const [firstgenreferrals, setFirstGenReferrals] = useState([]);
  const [secondgenreferrals, setSecondGenReferrals] = useState([]);
  const [thirdgenreferrals, setThirdGenReferrals] = useState([]);
  
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
  // const closeDappConAlert = () => {
  //   setDappConnector(!dappConnector);
  // }

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
    console.log('wall address',walletaddress)
    try {
      const config = {
      headers: {
          "Content-type": "application/json"
      }
      }  
      const {data} = await axios.post("https://tafabackend.onrender.com/api/users/getwalletaddress/", {
        username
      }, config);
      console.log('update wallet data', data.message);
      setWalletAddress(data.message);
    } catch (error) {
      console.log(error)
    }
}
getWalletAddress();


    async function getreferrals() {
      try {
         const config = {
         headers: {
            "Content-type": "application/json"
         }
         }  
         const {data} = await axios.get(`https://tafabackend.onrender.com/api/users/getreferrals/${udetails.userId}`, {
         }, config);
         setFirstGenReferrals(data.firstgendownlines);
         console.log('ref data',data.firstgendownlines);
      } catch (error) {
      }
   }
   getreferrals();

   

  if(isConnected) {

    async function getSponsorWalletAddress() {
      console.log('u objid',userObjId)
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
      // const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.bnbchain.org:8545')
      const signer = provider.getSigner(address);
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
          // setisWalletAddressUpdated(!isWalletAddressUpdated);
        } catch (error) {
          console.log(error)
        }
    }
    updateWalletAddress();
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

 
  return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
  };
  
  
 }, [userId, router,address,isWalletAddressUpdated,username,walletaddress,userObjId,sponsorWalletAddress])

 // Function to toggle the navigation menu
 const toggleSideBar = () => {
    setSideBarToggle(!dappsidebartoggle);
    setIsSideBarToggled(!isSideBarToggled);
  };

  console.log('refs',firstgenreferrals)

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
              {/* {!active ? (
                <button onClick={openWeb3Modal} className={dappstyles.connect}>Connect Wallet</button>
                ) : (
                <button onClick={disconnect} className={dappstyles.connected}><span>connected</span>Disconnect</button>
                )} */}
              </div>
              <button title='togglebtn' className={dappstyles.sidebar_toggle_btn} type='button' onClick={toggleSideBar}>
                <FontAwesomeIcon icon={faAlignJustify} size='lg' className={dappstyles.navlisttoggle}/> 
              </button>
                <div className={dappstyles.reflink}>
                    <div className={dappstyles.reflinkdex}>Ref Link: <input value={referralLink} onChange={(e) => setreferralLink(e.target.value)} /><button type='button' onClick={handleCopyClick}>{buttonText}</button> </div>
                    <div><small>Share referral link to earn more tokens!</small></div>
                    <div>Connected Wallet: <span style={{color: 'orange'}}>{walletaddress}</span></div>
                </div>

                <div className={dappstyles.head}>
                    <h1>
                        MY REFERRALS 
                    </h1>
                    { firstgenreferrals.length > 0 ?
                    (<div>
                        <h3>
                            First Generation Referrals
                        </h3>
                        <table id="resultTable" className="table01 margin-table">
                            <thead>
                                <tr>
                                    <th id="accountTh" width="" className="align-L">UserId</th>
                                    <th id="balanceTh" width="10%">Wallet Address</th>
                                </tr>
                            </thead>
                            <tbody id="userData">
                            {firstgenreferrals.map((downline) =>(
                                <tr key={downline._id}>
                                <td>{downline.userId}</td>
                                <td>{downline.walletaddress}</td>
                            </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>) : 'First Generation Referrals Not Found' }

                    { secondgenreferrals.length > 0 ?
                    (<div>
                        <h3>
                            Second Generation Referrals
                        </h3>
                        <table id="resultTable" className="table01 margin-table">
                            <thead>
                                <tr>
                                    <th id="accountTh" width="" className="align-L">UserId</th>
                                    <th id="balanceTh" width="10%">Wallet Address</th>
                                </tr>
                            </thead>
                            <tbody id="userData">
                            {secondgenreferrals.map((downline) =>(
                                <tr key={downline._id}>
                                <td>{downline.userId}</td>
                                <td>{downline.walletaddress}</td>
                            </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>) : 'Second Generation Referrals Not Found' }

                    { thirdgenreferrals.length > 0 ?
                    (<div>
                        <h3>
                            Third Generation Referrals
                        </h3>
                        <table id="resultTable" className="table01 margin-table">
                            <thead>
                                <tr>
                                    <th id="accountTh" width="" className="align-L">UserId</th>
                                    <th id="balanceTh" width="10%">Wallet Address</th>
                                </tr>
                            </thead>
                            <tbody id="userData">
                            {thirdgenreferrals.map((downline) =>(
                                <tr key={downline._id}>
                                <td>{downline.userId}</td>
                                <td>{downline.walletaddress}</td>
                            </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>) : 'Third Generation Referrals Not Found' }
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
          {isWalletAddressUpdated &&
          (<>
            <div className={dappconalertstyles.overlay_dap}></div>
            <div className={dappconalertstyles.dappconalerted}>
              <div className={dappconalertstyles.dappconalertclosediv}><button type='button' className={dappconalertstyles.dappconalertclosedivbtn} onClick={closeDappConAlerted}><FontAwesomeIcon icon={faXmark}/></button></div>
              <div className={dappconalertstyles.dappconalert_in}>
                Wallet Address Connected To Dapp
              </div>
            </div>
          </>)}
        <DappFooter />
    </>
  );
}

export default Referrals