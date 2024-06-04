import React, {useState, useEffect} from 'react';
import styles from '../styles/leaderboard.module.css';
import axios from 'axios';
import { BigNumber, ethers } from 'ethers';
import { useWeb3ModalProvider, useWeb3ModalAccount, useWeb3Modal } from '@web3modal/ethers5/react';
import GuessfhAbi from "../../artifacts/contracts/FRDGuessFootBallHero.sol/GuessFootBallHero.json";

interface Leaderboard {
    walletaddress: string,
    amountplayed: BigNumber,
    rewardamount: BigNumber
}

const GuessFootballHeroLeaderboard: React.FC = () => {
    const GuessfhCA = process.env.NEXT_PUBLIC_GUESSFOOTBALLHERO_CA;
    const { walletProvider } = useWeb3ModalProvider();
    const { isConnected } = useWeb3ModalAccount();
    const [leaderboard,setLeaderboard] = useState<Leaderboard[]>([])
    const { open } = useWeb3Modal();
    const [usdequivfrdamount, setUsdEquivFrdAmount] = useState<number>(0);
    const [dollarequiv, setDollarEquiv] = useState<number>(0);
    const [dollarprice, setDollarPrice] = useState<number>(0);

    useEffect(() => {
      if(!isConnected) {
        open();
      }

      const getUSDEQUIVFRDAMOUNT =  async () => {
        try {
          const config = {
            headers: {
                "Content-type": "application/json"
            }
          }  
          const {data} = await axios.get("../../../../api/gettokenprice", config);
          setDollarPrice(data.usdprice);
          setUsdEquivFrdAmount(data.usdequivalentfrdamount);
          setDollarEquiv(data.usdequivalentfrdamount * data.usdprice)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      getUSDEQUIVFRDAMOUNT();


        const loadLeaderboard = async() => {
          if (walletProvider) {
            try {
              const provider = new ethers.providers.Web3Provider(walletProvider as any);
              const signer = provider.getSigner();
              console.log('bet signer', signer);
        
              const guessfootballherocontract = new ethers.Contract(GuessfhCA!, GuessfhAbi, signer);
              try {
                const leaderbd = await guessfootballherocontract.getLeaderboard();
                setLeaderboard(leaderbd);
              } catch (transactionError: any) {
                console.log('Transaction error', transactionError);
              }
            } catch (providerError: any) {
              console.log('Provider error', providerError);
            }
          }
        }
        loadLeaderboard()

    }, []); // Provide an empty dependency array
        

  return (
    <div className={styles.leaderboard}>
      <h2 className={styles.title}>Leaderboard</h2>
      <ul className={styles.playerList}>
        {leaderboard.map((gamer, index) => (
          <li key={index} className={styles.player}>
            <div>
              {gamer.walletaddress.substring(0,8)}  
            </div>
            <div>
              {gamer.amountplayed.toNumber().toLocaleString()}FRD ${(gamer.amountplayed.toNumber() * dollarprice).toLocaleString()}
            </div>
            <div>
              {gamer.rewardamount.toNumber().toLocaleString()}FRD ${(gamer.rewardamount.toNumber() * dollarprice).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuessFootballHeroLeaderboard;
