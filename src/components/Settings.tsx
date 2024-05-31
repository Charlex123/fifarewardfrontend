import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
import DappSideBar from './Dappsidebar';
// material

// import Loading from "./Loading";
// import AlertMessage from "./AlertMessage";
import dappstyles from "../styles/dapp.module.css";
import dappconalertstyles from "../styles/dappconnalert.module.css";
// component
import { ethers } from 'ethers';
import ConnectWallet from './ConnectWalletButton';
import ReferralLink from './ReferralLink';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { ThemeContext } from '../contexts/theme-context';
import DappNav from './Dappnav';
import FooterNavBar from './FooterNav';
import Loading from './Loading';
import BgOverlay from './BgOverlay';
import AlertDanger from './AlertDanger';
import BettingAbi from '../../artifacts/contracts/FRDBetting.sol/FRDBetting.json';
import DragDropImageUpload from './DragDropImageUpload';
import RewardsBadge from './RewardsBadge';
import ActionSuccessModal from './ActionSuccess';
import HelmetExport from 'react-helmet';
import axios from 'axios';
import { FaAlignJustify, FaXmark } from 'react-icons/fa6';



const Settings = () =>  {

  const router = useRouter();


  const { theme} = useContext(ThemeContext);
  const [isNavOpen, setNavOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [isSideBarToggled, setIsSideBarToggled] = useState(false)
  const [dappsidebartoggle, setSideBarToggle] = useState(false);
  // const [dropdwnIcon1, setDropdownIcon1] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>);
  // const [dropdwnIcon2, setDropdownIcon2] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");  
  const [dappConnector,setDappConnector] = useState(false);
  const [wAlert,setWAlert] = useState(false);

  const [errorMessage, seterrorMessage] = useState("");
  const [walletaddress, setWalletAddress] = useState("NA"); 
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<number[]>([]);
  const [showloading, setShowLoading] = useState<boolean>(false);
  const [showAlertDanger,setShowAlertDanger] = useState<boolean>(false);
  const [showBgOverlay,setShowBgOverlay] = useState<boolean>(false);
  const [actionsuccess, setActionSuccess] = useState(false);
  const [actionsuccessmessage, setActionSuccessMessage] = useState<string>('');
  const [uploadedMedia, setUploadedMedia] = useState<any>(null);
  const { open } = useWeb3Modal();
  // const [deltaX, setDeltaX] = useState(0);
  // const [draggedRangeIndex, setDraggedRangeIndex] = useState<number | null>(null);


  const [showTimer, setShowTimer] = useState(false);
  // const { isOpen, onOpen, onClose, closeWeb3Modal,openWeb3Modal } = useContext(Web3ModalContext);
  const { walletProvider } = useWeb3ModalProvider();
  const { address, chainId, isConnected } = useWeb3ModalAccount();


  const BettingCA = process.env.NEXT_PUBLIC_FRD_BETTING_CA;

  
  const closeDappConAlert = () => {
    setDappConnector(!dappConnector);
  }

  useEffect(() => {

    if(!isConnected) {
      open()
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

 
 // Function to toggle the navigation menu
 const toggleSideBar = () => {
    setSideBarToggle(!dappsidebartoggle);
    setIsSideBarToggled(!isSideBarToggled);
  };

  async function handleFileUpload(file: File) {
    console.log("file oop",file);
    setUploadedMedia(file);
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    console.log("form data",formData,file);
    // Log the formData contents to ensure it is not empty
    for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
    try {
      const res = await axios.post('http://localhost:9000/uploadprofileimage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { fullUrl } = res.data;
      console.log('File uploaded successfully', fullUrl, userId);

        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }  
        const filePath_ = fullUrl;
        const {data} = await axios.post('http://localhost:9000/api/users/uploadprofilepicture', {
            address,
            filePath_
        }, config);
        if(data) {
            setActionSuccess(true);
            setActionSuccessMessage("Profile upload ")
        }
        console.log('File uploaded successfully', data);
    } catch (err) {
      console.error(err);
    //   setError('Failed to upload the file');
    }
}

async function UpdateUsername(e: any) {
  e.preventDefault()
  try {
    setShowLoading(true)
    setShowBgOverlay(true)
      const config = {
          headers: {
              "Content-type": "application/json"
          }
      }  
      const {data} = await axios.post('http://localhost:9000/api/users/updateusername', {
          address,
          username
      }, config);
      if(data) {
          try {
            const provider = new ethers.providers.Web3Provider(walletProvider as any)
            const signer = provider.getSigner();
            const betContract = new ethers.Contract(BettingCA!, BettingAbi, signer);
            await betContract.UpdateUsername(username);
          } catch (error: any) {
            console.log("add ref error",error.code || error.message)
          }
          setShowLoading(false)
          setActionSuccess(true);
          setActionSuccessMessage("Action was successful")
      }
  } catch (err) {
    console.error(err);
  //   setError('Failed to upload the file');
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
            <title>Settings | Fifareward</title>
            <meta name='description' content='Fifareward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
        </HelmetExport>
        <DappNav/>
        {dappConnector && (<>
            <div className={dappconalertstyles.overlay_dap}></div>
            <div className={dappconalertstyles.dappconalert}>
              <div className={dappconalertstyles.dappconalertclosediv}><button title='button' type='button' className={dappconalertstyles.dappconalertclosedivbtn} onClick={closeDappConAlert}><FaXmark/></button></div>
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

              <div className={dappstyles.uploadprof}>
                <h3>Update Profile Image</h3>
                <div className={`${dappstyles.dragdrop} ${theme === 'dark' ? dappstyles['darktmod'] : dappstyles['lightmod']}`}>
                    <DragDropImageUpload onFileUpload={handleFileUpload}/>
                </div>
              </div>
                  
              {/* end of upload profile pics */}

              <div className={dappstyles.upuname}>
                  <h3>Update Username</h3>
                  <div className={dappstyles.upunamec}>
                    <form onSubmit={UpdateUsername}>
                        <div>
                          <input type='text' onChange={(e) => setUsername(e.target.value)} placeholder='enter username'/>
                        </div>
                        <div>
                          <button type='submit'>
                            Update
                          </button>
                        </div>
                    </form>
                  </div>
              </div>

              {/* end of update username */}

              </div>
            </div>
        </div>
        {/* {isOpen && (<SelectWalletModal isOpen={isOpen} closeWeb3Modal={closeWeb3Modal} />)} */}
        {/* <DappFooter /> */}
        <FooterNavBar />
    </>
  );
}

export default Settings