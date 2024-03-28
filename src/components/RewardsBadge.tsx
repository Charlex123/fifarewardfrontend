import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
// import DappSideBar from './Dappsidebar';
// material

// import Loading from "./Loading";
// import AlertMessage from "./AlertMessage";
import styles from "../styles/rewardbadge.module.css";
// component
import { useWeb3React } from "@web3-react/core";
import { ethers } from 'ethers';
import ws from 'ws';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useDisconnect } from '@web3modal/ethers5/react';
import axios from 'axios';
import AlertMessage from './AlertMessage';
import { ThemeContext } from '../contexts/theme-context';
import bronzemedal from '../assets/images/medal.png'
import FooterNavBar from './FooterNav';
import DappNav from './Dappnav';
import StakeAbi from '../../artifacts/contracts/FRDStaking.sol/FRDStaking.json';
import BettingFeatureAbi from '../../artifacts/contracts/FRDBettingFeatures.sol/FRDBettingFeatures.json';
import FRDNFTFeaturesAbi from '../../artifacts/contracts/FRDNFTMarketPlaceFeatures.sol/FRDNFTMarketPlaceFeatures.json';
import DappFooter from './DappFooter';
import { fas, faCheck, faCheckCircle, faChevronDown,faAlignJustify, faCircleDollarToSlot, faGift, faHandHoldingDollar, faPeopleGroup, faChevronUp, faAngleDoubleRight, faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome, faFacebook,faDiscord, faTelegram, faMedium, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';

library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);

const RewardsCount:React.FC<{}> = () =>  {

  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<number>();  
  const [stakecount, setStakeCount] = useState<number>(0);
  const [betcount, setBetCount] = useState<number>(0);  
  const [nftcount, setNFTCount] = useState<number>(0);
  const [walletaddress, setWalletAddress] = useState<any>("NA");  

  const [userObjId, setUserObjId] = useState(""); // Initial value
  
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const StakeCA = process.env.NEXT_PUBLIC_FRD_STAKING_CA;
  const BettingFeatureCA = process.env.NEXT_PUBLIC_FRD_BETTING_FEATURES_CA;
  const NFTFeatureCA = process.env.NEXT_PUBLIC_FRD_NFTMARKETPLACE_FEATURES_CA;
  
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

    // get stake count
    const StakeCount = async () => {
      try {
        // setWAlert(!wAlert);
        if(walletProvider) {
          const provider = new ethers.providers.Web3Provider(walletProvider as any)
          const signer = provider.getSigner();
          
          const StakeContract = new ethers.Contract(StakeCA!, StakeAbi, signer);
          const reslt = await StakeContract.getUserStakeCount(address);
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
          
          const BettingFeatureContract = new ethers.Contract(BettingFeatureCA!, BettingFeatureAbi, signer);
          const reslt = await BettingFeatureContract.getUserBetCount(address);
          setBetCount(reslt);
          console.log(reslt)
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
          
          const NFTFeatureContract = new ethers.Contract(NFTFeatureCA!, FRDNFTFeaturesAbi, signer);
          const reslt = await NFTFeatureContract.getUserNFTMintedCount();
          setBetCount(reslt);
          console.log(reslt)
        }
          
      } catch (error:any) {
        console.log(error)
      }
    }
    NFTCount()
  
 }, [userId,address,router,username,walletaddress,userObjId])


  return (
    <>
        <div className={styles.rewardsbagde}>
          <div className={styles.rwdb}>
            <div className={styles.rwdbadge}>
                <div>
                  Minted NFTs {nftcount.toString()}
                </div>
                <div>
                  Bets {betcount.toString()}
                </div>
                <div>
                  Stakes {stakecount.toString()}
                </div>
                <div className={styles.badge}>
                  <Image src={bronzemedal} alt={'medal'} height={25} width = {25} />
                </div>
            </div>
          </div>
        </div>
    </>
  );
}

export default RewardsCount