import { useEffect, useState , useContext} from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
import Image from 'next/image';
// import DappSideBar from './Dappsidebar';
// material
import { useUser } from '../contexts/UserContext';
// import Loading from "./Loading";
// import AlertMessage from "./AlertMessage";
import styles from "../styles/rewardbadge.module.css";
// component
import { ethers } from 'ethers';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import bronzemedal from '../assets/images/medal.png'
import StakeAbi from '../../artifacts/contracts/FRDStaking.sol/FRDStaking.json';
import BettingAbi from '../../artifacts/contracts/FRDBetting.sol/FRDBetting.json';
import FRDNFTFeaturesAbi from '../../artifacts/contracts/FRDNFTMarketPlaceFeatures.sol/FRDNFTMarketPlaceFeatures.json';
import { ThemeContext } from '../contexts/theme-context';

const RewardsBadge:React.FC<{}> = () =>  {

  const router = useRouter();
  const { connectedaddress } = useUser();
  const { theme } = useContext(ThemeContext);
  const [username, setUsername] = useState<string>("");
  const [stakecount, setStakeCount] = useState<number>(0);
  const [betcount, setBetCount] = useState<number>(0);  
  const [nftcount, setNFTCount] = useState<number>(0);

  const [badge, setBadge] = useState("bronze"); // Initial value
  
  const { walletProvider } = useWeb3ModalProvider();

  const StakeCA = process.env.NEXT_PUBLIC_FRD_STAKING_CA;
  const BettingCA = process.env.NEXT_PUBLIC_FRD_BETTING_FEATURES_CA;
  const NFTFeaturesCA = process.env.NEXT_PUBLIC_NFTMARKETPLACE_FEATURES_CA;
  
  useEffect(() => {
    
    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    if(udetails && udetails !== null && udetails !== "") {
      const username_ = udetails.username;  
      if(username_) {
        setUsername(username_);
        setBadge(udetails.badge);
      }
    }

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
          setBetCount(sum);
          return sum;
        } else {
          throw new Error("All arguments must be integers.");
        }
      } catch (error: any) {
        console.log("sum error", error);
      }
    }
  
 }, [connectedaddress,router,username])


  return (
    <>
        <div className={`${styles.rewardsbagde} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`}>
          <div className={styles.rwdb}>
            <div>
              <h1 className={`${theme === 'dark' ? styles['darkmod'] : styles['lightmod']}`}>
                  Activity Counts
              </h1>
              <p className={`${theme === 'dark' ? styles['darkmod'] : styles['lightmod']}`}>
                Below is the number (counts) of activities you have performed in FifaReward using your connected wallet address
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
                  <div style={{textTransform: 'capitalize'}}> {badge} </div>
                </div>
            </div>
          </div>
        </div>
    </>
  );
}

export default RewardsBadge