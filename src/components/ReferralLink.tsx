import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
// import DappSideBar from './Dappsidebar';
// material
import { useUser } from '../contexts/UserContext';
import { encode } from '../utils/hexUtils';
import { ethers } from 'ethers';
import { useWeb3Modal, useWeb3ModalProvider } from '@web3modal/ethers5/react';
import StakeAbi from '../../artifacts/contracts/FRDStaking.sol/FRDStaking.json';
import BettingAbi from '../../artifacts/contracts/FRDBetting.sol/FRDBetting.json';
import dappstyles from "../styles/dapp.module.css";
import { ThemeContext } from '../contexts/theme-context';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';

const ReferralLink:React.FC<{}> = () =>  {

  const { connectedaddress } = useUser();
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const [cipherText, setCipherText] = useState('');
  const [walletaddress, setWalletAddress] = useState<any>("");
  const [shortwalletaddress, setShortWalletAddress] = useState<any>("NA");
  const { walletProvider } = useWeb3ModalProvider();
  const BettingCA = process.env.NEXT_PUBLIC_FRD_BETTING_CA;
  const StakeCA = process.env.NEXT_PUBLIC_FRD_STAKING_CA;
  
  const { open } = useWeb3Modal();
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
  
  useEffect(() => {

    setWalletAddress(connectedaddress!);
    const shrtwa = connectedaddress?.substring(0,18)+' ...';
        setShortWalletAddress(shrtwa);

    async function Addreferrer(sponsoraddress: string, username: string) {
      try {
        let uname: string;
        if(username && username != '' && username != null) {
          uname = username;
        }else {
          uname = 'frduser';
        }
        // const [accounta] = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(walletProvider as any)
        const signer = provider.getSigner();
        const StakeContract = new ethers.Contract(StakeCA!, StakeAbi, signer);
        const tnx = await StakeContract.addReferrer(sponsoraddress,connectedaddress);
        console.log("Account Balance: ", tnx);
        const betContract = new ethers.Contract(BettingCA!, BettingAbi, signer);
        const reslt = await betContract.addReferrer(sponsoraddress,connectedaddress,uname);
        console.log("Account Balance: ", reslt);
      } catch (error: any) {
        console.log("add ref error",error.code || error.message)
      }
    }

    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    if(udetails && udetails != null && udetails != undefined) {
      if(udetails.encryptedreflinkid && udetails.encryptedreflinkid != null && udetails.encryptedreflinkid != undefined) {
        if(udetails.isinfluencer === true) {
          setreferralLink(`https://www.fifareward.io/referrals/${udetails.username}/${udetails.encryptedreflinkid}`)
        }else {
          setreferralLink(`https://www.fifareward.io/referrals/${udetails.encryptedreflinkid}`)
        }
      }else {
        const encrypted = encode(udetails.address);
        setCipherText(encrypted);
            const updateUser = async () => {
              try {
                  const config = {
                      headers: {
                          "Content-type": "application/json"
                      }
                  };
                  const response = await axios.post("https://fifarewardbackend.onrender.com/api/users/updatereflinkid/", {
                      address: connectedaddress,
                      encrypted
                  }, config);
                  const data = response.data;
                  if(data.encryptedreflinkid != undefined) {
                    if(udetails.isinfluencer === true) {
                      setreferralLink(`https://www.fifareward.io/referrals/${udetails.username}/${data.encryptedreflinkid}`)
                    }else {
                      setreferralLink(`https://www.fifareward.io/referrals/${data.encryptedreflinkid}`)
                    }
                  }
                  
              } catch (error) {
                  console.log(error);
              }
          };
          updateUser();
      }
      

      if(udetails.sponsoraddress && udetails.sponsoraddress != '') {
        Addreferrer(udetails.sponsoraddress, udetails.username)
      }
    }else {
      open()
    }
    

 }, [connectedaddress,router,shortwalletaddress])

const toggleWA = (e: any) => {
  let tbtn = e as HTMLButtonElement;
  const tspan = tbtn.previousElementSibling as HTMLElement;  
  tspan.style.display = (tspan.style.display === "block") ? "none" : "block";
}
  return (
    <>
        <div className={`${dappstyles.reflink} ${theme === 'dark' ? dappstyles['darkmod'] : dappstyles['lightmod']}`} >
            <div className={dappstyles.reflinkdex}>
              <div className={dappstyles.reftxt}>Ref Link:</div> 
              <div className={dappstyles.refinput}><input title="input" value={referralLink} readOnly /></div>
              <div className={dappstyles.refbtn}><button type='button' onClick={handleCopyClick}>{buttonText}</button></div>
            </div>
            <div><small>Share referral link to earn more FRD!</small></div>
            <div className={dappstyles.cw}>Connected Wallet: <span style={{color: 'orange'}}>{shortwalletaddress ? shortwalletaddress : 'Not connected'}</span> <div style={{color: 'orange'}} className={dappstyles.cws}><div>{walletaddress}</div></div><button onClick={(e) => toggleWA(e.target)}>view</button></div>
        </div>
    </>
  );
}

export default ReferralLink