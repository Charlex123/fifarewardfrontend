import { useEffect, useState , useContext} from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
// import DappSideBar from './Dappsidebar';
// material
import { useUser } from '../contexts/UserContext';
// import Loading from "./Loading";
// import AlertMessage from "./AlertMessage";
import styles from "../styles/earningsbreakdown.module.css";
// component
import { ethers } from 'ethers';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import BettingAbi from '../../artifacts/contracts/FRDBetting.sol/FRDBetting.json';
import StakeAbi from '../../artifacts/contracts/FRDStaking.sol/FRDStaking.json';
import FRDNFTFeaturesAbi from '../../artifacts/contracts/FRDNFTMarketPlaceFeatures.sol/FRDNFTMarketPlaceFeatures.json';
import { ThemeContext } from '../contexts/theme-context';

const EarningsBreakDown:React.FC<{}> = () =>  {

  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const [username, setUsername] = useState<string>("");
  const [stakecount, setStakeCount] = useState<number>(0);
  const [betcount, setBetCount] = useState<number>(0);  
  // const [nftcount, setNFTCount] = useState<number>(0);
  const { connectedaddress } = useUser();
  const { walletProvider } = useWeb3ModalProvider();

  const StakeCA = process.env.NEXT_PUBLIC_FRD_STAKING_CA;
  const BettingCA = process.env.NEXT_PUBLIC_FRD_BETTING_CA;
  const NFTFeaturesCA = process.env.NEXT_PUBLIC_FRD_NFTMARKETPLACE_FEATURES_CA;
  
  useEffect(() => {
    
    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    if(udetails && udetails !== null && udetails !== "") {
      const username_ = udetails.username;  
      if(username_) {
        setUsername(username_);
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
          const reslt = await Betting.getUserBetCount(connectedaddress);
          setBetCount(reslt);
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
        }
          
      } catch (error:any) {
        console.log(error)
      }
    }
    NFTCount()
  
 }, [connectedaddress,router,username])


  return (
    <>
        <div className={`${styles.earnins} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`}>
          <div className={styles.rwdb}>
            <div>
                <h1 className={`${theme === 'dark' ? styles['darkmod'] : styles['lightmod']}`}>Earning Summary</h1>
            </div>
            <div className={styles.earnings_comingsoon}>
              Coming Soon
            </div>
            {/* <div className={styles.rwdbadge}>

                <div className={styles.d}>
                    <div>
                        <h1>Epoch Earning Summary</h1>
                    </div>
                    <div className={styles.dd}>
                        <div className={styles.ddc}>
                            <div className={styles.cd}>Total :</div> <div className={styles.rwd_c}>112,034 FRD</div>
                        </div>
                        <div className={styles.ddc}>
                            <div className={styles.cd}>Withdrawn :</div> <div className={styles.rwd_c}>14,098 FRD</div>
                        </div>
                        <div className={styles.ddc}>
                            <div className={styles.cd}>Remaining :</div> <div className={styles.rwd_c}>97,936 FRD</div>
                        </div>
                    </div>
                </div>
                
                <div className={styles.d}>
                    <div>
                        <h1>Stake Earning Summary</h1>
                    </div>
                    <div className={styles.dd}>
                        <div className={styles.ddc}>
                            <div className={styles.cd}>Total :</div> <div className={styles.rwd_c}>234,220 FRD</div>
                        </div>
                        <div className={styles.ddc}>
                            <div className={styles.cd}>Withdrawn :</div> <div className={styles.rwd_c}>234,220 FRD</div>
                        </div>
                        <div className={styles.ddc}>
                            <div className={styles.cd}>Remaining :</div> <div className={styles.rwd_c}>0 FRD</div>
                        </div>
                    </div>
                </div>

                <div className={styles.d}>
                    <div>
                        <h1>Mining Earning Summary</h1>
                    </div>
                    <div className={styles.dd}>
                        <div className={styles.ddc}>
                            <div className={styles.cd}>Total :</div> <div className={styles.rwd_c}>108,000 FRD</div>
                        </div>
                        <div className={styles.ddc}>
                            <div className={styles.cd}>Withdrawn :</div> <div className={styles.rwd_c}>108,000 FRD</div>
                        </div>
                        <div className={styles.ddc}>
                            <div className={styles.cd}>Remaining :</div> <div className={styles.rwd_c}>0 FRD</div>
                        </div>
                    </div>
                </div>
            </div> */}
          </div>
        </div>
    </>
  );
}

export default EarningsBreakDown