import { useEffect, useState , useContext} from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
import Image from 'next/image';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
// import DappSideBar from './Dappsidebar';
// material

// import Loading from "./Loading";
// import AlertMessage from "./AlertMessage";
import styles from "../styles/rewardbadge.module.css";
// component
import { ethers } from 'ethers';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import bronzemedal from '../assets/images/medal.png'
import StakeAbi from '../../artifacts/contracts/FRDStaking.sol/FRDStaking.json';
import BettingFeaturesAbi from '../../artifacts/contracts/FRDBettingFeatures.sol/FRDBettingFeatures.json';
import FRDNFTFeaturesAbi from '../../artifacts/contracts/FRDNFTMarketPlaceFeatures.sol/FRDNFTMarketPlaceFeatures.json';
import { fas, faCheck, faCheckCircle,faAlignJustify } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { ThemeContext } from '../contexts/theme-context';
library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);

const RewardsBadge:React.FC<{}> = () =>  {

  const router = useRouter();
  const { theme } = useContext(ThemeContext);
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
  const BettingFeaturesCA = process.env.NEXT_PUBLIC_FRD_BETTING_FEATURES_CA;
  const NFTFeaturesCA = process.env.NEXT_PUBLIC_FRD_NFTMARKETPLACE_FEATURES_CA;
  
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
          
          const BettingFeatureContract = new ethers.Contract(BettingFeaturesCA!, BettingFeaturesAbi, signer);
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
          
          const NFTFeatureContract = new ethers.Contract(NFTFeaturesCA!, FRDNFTFeaturesAbi, signer);
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
        <div className={`${styles.rewardsbagde} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`}>
          <div className={styles.rwdb}>
            <div>
              <h1>
                  Activity Counts
              </h1>
              <p>
                Below is the number (counts) of activities you have perform in FifaReward using your connected wallet address
              </p>
            </div>
            <div className={styles.rwdbadge}>
                <div className={styles.d}>
                  <div> NFTs:</div> <div className={styles.rwd_c}>{nftcount.toString()}</div>
                </div>
                <div className={styles.d}>
                  <div>Bets:</div> <div className={styles.rwd_c}>{betcount.toString()}</div>
                </div>
                <div className={styles.d}>
                  <div>Stakes:</div> <div className={styles.rwd_c}>{stakecount.toString()}</div>
                </div>
                <div className={styles.d}>
                  <Image src={bronzemedal} alt={'medal'} height={20} width = {20} style={{margin: '0 auto'}}/>
                  <div> Badge</div>
                </div>
            </div>
          </div>
        </div>
    </>
  );
}

export default RewardsBadge