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
// component
import ConnectWallet from './ConnectWalletButton';
import ReferralLink from './ReferralLink';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { ThemeContext } from '../contexts/theme-context';
import { ethers } from 'ethers';
import DappNav from './Dappnav';
import DappFooter from './DappFooter';
import AirdropAbi from '../../artifacts/contracts/FRDAirDrop.sol/FRDAirDrop.json';
import { AirdropMetadata } from './AirdropMetadata';
import HelmetExport from 'react-helmet';
import FooterNavBar from './FooterNav';
import RewardsBadge from './RewardsBadge';
import { fas, faCheck, faCheckCircle,faAlignJustify, faXmark, faChevronRight, faCheckDouble } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome} from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';




library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const Airdrop = () =>  {

  const router = useRouter();
  const AirdropCA = process.env.NEXT_PUBLIC_AIRDROP_CA;

  const { theme} = useContext(ThemeContext);
  const [isNavOpen, setNavOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [isSideBarToggled, setIsSideBarToggled] = useState(false)
  const [dappsidebartoggle, setSideBarToggle] = useState(false);
  const [aidropdataloaded, setAirdropDataLoaded] = useState(false);
  const [airdropdata, setAirdropData] = useState<AirdropMetadata[]>([]);
  // const [dropdwnIcon1, setDropdownIcon1] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>);
  // const [dropdwnIcon2, setDropdownIcon2] = useState(<FontAwesomeIcon icon={faChevronDown} size='lg' className={dappsidebarstyles.sidebarlisttoggle}/>);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");  
  const [wAlert,setWAlert] = useState(false);

  const [walletaddress, setWalletAddress] = useState("NA"); 
  const [stakeduration, setstakeduration] = useState<any>(180);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<number[]>([]);
  // const [deltaX, setDeltaX] = useState(0);
  // const [draggedRangeIndex, setDraggedRangeIndex] = useState<number | null>(null);


  const [showTimer, setShowTimer] = useState(false);
  const { open } = useWeb3Modal();  
  // const { isOpen, onOpen, onClose, closeWeb3Modal,openWeb3Modal } = useContext(Web3ModalContext);
  const { walletProvider } = useWeb3ModalProvider();
  const { address, chainId, isConnected } = useWeb3ModalAccount();

  const [referralLink, setreferralLink] = useState('');
  

  useEffect(() => {
    
    localStorage.setItem('staketimer',stakeduration);

    setstakeduration(localStorage.getItem('staketimer')!)
    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    
    if(udetails && udetails !== null && udetails !== "") {
      const username_ = udetails.username;  
      if(username_) {
        setUsername(username_);
        setUserId(udetails.userId)
        setreferralLink(`https://fifareward.io/register/${udetails.userId}`);
      }
    }else {
      router.push(`/signin`);
    }

    if(isConnected) {
        async function loadAirDUsers() {
            try {
                // const [accounta] = await window.ethereum.request({ method: 'eth_requestAccounts' })
                const provider = new ethers.providers.Web3Provider(walletProvider as any)
                const signer = provider.getSigner();
                const AirdropContract = new ethers.Contract(AirdropCA!, AirdropAbi, signer);
                const airdropusers = await AirdropContract.GetAllAirDroppers();
                
                console.log('aser der',airdropusers);
                await airdropusers.forEach(async (element:any) => {
                    if(element) {
                        let item: AirdropMetadata = {
                            airdropId: element.airdropId,
                            walletaddress: element.walletaddress
                        }

                        airdropdata.push(item);
                        setAirdropData(airdropdata);
                        setAirdropDataLoaded(true);
                    }})
                  
            } catch (error) {
                console.log("add aird error", error)
            }
          }
          loadAirDUsers();
    }else {
        // open();
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
  
  
 }, [userId, router,username,address,chainId,isConnected,walletaddress,stakeduration,wAlert,showTimer,walletProvider,isDragging,initialValues])

 async function JoinAirdrop() {
    try {
        // const [accounta] = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(walletProvider as any)
        const signer = provider.getSigner();
        const AirdropContract = new ethers.Contract(AirdropCA!, AirdropAbi, signer);
        const addairdropuser = AirdropContract.addAirDropUser({ gasLimit: 1000000 });
        if(addairdropuser) {
            router.reload();
        }
    } catch (error) {
        console.log("add aird error", error)
    }
  }
 // Function to toggle the navigation menu
 const toggleSideBar = () => {
    setSideBarToggle(!dappsidebartoggle);
    setIsSideBarToggled(!isSideBarToggled);
  };

const sideBarToggleCheck = dappsidebartoggle ? dappstyles.sidebartoggled : '';

  return (
    <>
        <HelmetExport>
            <title>AirDrop - Participate in the FifaReward Airdrop | FifaReward</title>
            <meta name='description' content='Participate in the FifaReward Airdrop and and accumulate as much tokens as you can. FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
        </HelmetExport>
        <DappNav/>
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

              <div className={`${dappstyles.airdrop_} ${theme === 'dark' ? dappstyles['darkmod'] : dappstyles['lightmod']}`}>
                    <div className={dappstyles.airdroph1}><h1> FifaReward Airdrop</h1></div>
                    <div className={dappstyles.airdh}><p>Join FifaReward Airdrop and accumulate FRD tokens</p></div>

                    <div className={dappstyles.airdc}>
                        <div><h3>How To Participate</h3></div>
                        <div>
                            <ul>
                                <li> <FontAwesomeIcon icon={faChevronRight}/> Follow us on twitter <a href={`https://twitter.com/@FRD_Labs`}>@FRD_Labs</a></li>
                                <li> <FontAwesomeIcon icon={faChevronRight}/> Join Our Discord <a href={`https://twitter.com/@FRD_Labs`}>@FRD_Labs</a></li>
                                <li> <FontAwesomeIcon icon={faChevronRight}/> Join Our Telegram <a href={`https://twitter.com/@FRD_Labs`}>@FRD_Labs</a></li>
                                <li> <FontAwesomeIcon icon={faChevronRight}/>  Like our tweets</li>
                                <li> <FontAwesomeIcon icon={faChevronRight}/> Retweet our tweets</li>
                            </ul>
                        </div>
                        <div>
                            <div>
                                <blockquote className={dappstyles.noteb}>
                                    <p>
                                        To earn more tokens and be among our top airdrop earners, do one or more of the following, the more you do, the higher the reward
                                    </p>
                                </blockquote>
                            </div>
                            <ul>
                                <li> <FontAwesomeIcon icon={faCheckDouble} /> Mint Nfts <a href="../nft/create">Mint NFTs</a></li>
                                <li> <FontAwesomeIcon icon={faCheckDouble} /> Place Bets <a href='../betting/bet'>Place Bets</a></li>
                                <li> <FontAwesomeIcon icon={faCheckDouble} /> Mine FRD <a href='../mining'>Mine FRD</a></li>
                                <li> <FontAwesomeIcon icon={faCheckDouble} /> Stake FRD <a href='../stakes'>Stake FRD</a></li>
                            </ul>
                            <div>
                                <blockquote>
                                    <p>At the top of the page, you will see the count of actions you've taken and the corresponding badge level. Your reward is proportional to your activity (betting, nft mints, and staking) counts. </p>
                                    <p>These activities are recorded per connected wallet address, so ensure you maintain a particular address except otherwise</p>
                                </blockquote>
                            </div>
                        </div>
                    </div>

                    <div className={dappstyles.airdadd}>
                        <div><p>Join FRD Airdop</p></div>
                        <div>
                            <button onClick={JoinAirdrop} className={dappstyles.airdaddbtn}>Join Airdrop</button>
                        </div>
                    </div>

                    <div className={dappstyles.airdusers}>
                        {aidropdataloaded && airdropdata.length > 0 ?
                        <div>
                            <h3 className={dappstyles.airdh2}>
                                FRD Airdroppers list
                            </h3>
                            <table id="resultTable" className="table01 margin-table">
                                <thead>
                                    <tr>
                                        <th id="accountTh" className="align-L">AirdropId</th>
                                        <th id="balanceTh">Wallet Address</th>
                                    </tr>
                                </thead>
                                <tbody id="userData">
                                {airdropdata.map((airdropper:any, index) =>(
                                    <tr key={index}>
                                    <td>{airdropper.airdropId.toNumber()}</td>
                                    <td>{airdropper.walletaddress}</td>
                                </tr>
                                ))}
                                </tbody>
                            </table>

                        </div> : 
                        <div></div>
                        }
                    
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

export default Airdrop