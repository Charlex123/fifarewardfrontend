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
// component
// import SelectWalletModal from "./web3-Modal";
// import { providers } from "ethers";
import axios from 'axios';
import { ThemeContext } from '../contexts/theme-context';
import DappNav from './Dappnav';
import { ethers } from 'ethers';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useDisconnect } from '@web3modal/ethers5/react';
import StakeAbi from '../../artifacts/contracts/FRDStaking.sol/FRDStaking.json';
import DappFooter from './DappFooter';
import { fas, faCheck, faCheckCircle, faChevronDown,faAlignJustify, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import ReferralLink from './ReferralLink';
import HelmetExport from 'react-helmet';

library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const Referrals = () =>  {

  const router = useRouter();
  const TAFAAddress = "0x5ae155f89308ca9050f8ce1c96741badd342c26b";
  const StakeAddress = "0xE182a7e66E95a30F75971B2924346Ef5d187CE13";
  const { theme } = useContext(ThemeContext);
  const [isNavOpen, setNavOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [isSideBarToggled, setIsSideBarToggled] = useState(false)
  const [dappsidebartoggle, setSideBarToggle] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");  
  const [walletaddress, setWalletAddress] = useState("NA");  
  const [isWalletAddressUpdated,setisWalletAddressUpdated] = useState(false);
  // const [dappConnector,setDappConnector] = useState(false);

  const [sponsorWalletAddress, setsponsorWalletAddress] = useState("");
  const [userObjId, setUserObjId] = useState(""); // Initial value
  const [verified, setVerified] = useState();
  const [firstgenreferrals, setFirstGenReferrals] = useState<any>([]);
  
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
    
    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    
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
         const {data} = await axios.get(`https://tafabackend.onrender.com/api/users/getreferrals/${udetails.userId}`, {
         });
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
      const refbonus:number = 1;
      const StakeContract = new ethers.Contract(StakeAddress, StakeAbi, signer);
      const reslt = await StakeContract.addReferrer(sponsorWalletAddress,refbonus);
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


const sideBarToggleCheck = dappsidebartoggle ? dappstyles.sidebartoggled : '';

  return (
    <>
        <HelmetExport>
            <title>Referrals | FifaReward</title>
            <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
        </HelmetExport>
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
                <FontAwesomeIcon icon={faAlignJustify} size='lg' className={dappstyles.navlisttoggle}/> 
              </button>
                <div className={dappstyles.reflink}>
                    <ReferralLink />
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
                                    <th id="accountTh" className="align-L">UserId</th>
                                    <th id="balanceTh">Wallet Address</th>
                                </tr>
                            </thead>
                            <tbody id="userData">
                            {firstgenreferrals.map((downline:any) =>(
                                <tr key={downline._id}>
                                <td>{downline.userId}</td>
                                <td>{downline.walletaddress}</td>
                            </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>) : 'Referrals Not Found' }

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