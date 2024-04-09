import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
// import DappSideBar from './Dappsidebar';
// material

import { ethers } from 'ethers';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import StakeAbi from '../../artifacts/contracts/FRDStaking.sol/FRDStaking.json';
import BettingAbi from '../../artifacts/contracts/FRDBetting.sol/FRDBetting.json';
import dappstyles from "../styles/dapp.module.css";
import { ThemeContext } from '../contexts/theme-context';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import axios from 'axios';
const ReferralLink:React.FC<{}> = () =>  {

  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<number>();  
  const [sponsorId, setIsSponsorId] = useState<number>(0);  
  const [walletaddress, setWalletAddress] = useState<any>("NA");
  const [shortwalletaddress, setShortWalletAddress] = useState<any>("NA");
  const [sponsorWalletAddress, setsponsorWalletAddress] = useState<any>("NA");  
  const { walletProvider } = useWeb3ModalProvider();
  const BettingCA = process.env.NEXT_PUBLIC_FRD_BETTING_CA;
  const StakeCA = process.env.NEXT_PUBLIC_FRD_STAKING_CA;
  const [userObjId, setUserObjId] = useState(""); // Initial value
  
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  
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

    async function Addreferrer() {
      // const [accounta] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(walletProvider as any)
      const signer = provider.getSigner();
      const StakeContract = new ethers.Contract(StakeCA!, StakeAbi, signer);
      const tnx = await StakeContract.addReferrer(sponsorWalletAddress,1);
      console.log("Account Balance: ", tnx);
      const betContract = new ethers.Contract(BettingCA!, BettingAbi, signer);
      const reslt = await betContract.addReferrer(sponsorWalletAddress,1);
      console.log("Account Balance: ", reslt);
    }

    async function getSponsorWalletAddress(sponsorId: any) {
      try {
        const config = {
        headers: {
            "Content-type": "application/json"
        }
        }  
        const {data} = await axios.post("https://fifareward.onrender.com/api/users/getsponsorwalletaddress", {
          sponsorId,
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
    
    async function getWalletAddress(username: string) {
      
        try {
          const config = {
          headers: {
              "Content-type": "application/json"
          }
          }  
          const {data} = await axios.post("https://fifareward.onrender.com/api/users/getwalletaddress/", {
            username
          }, config);
          setWalletAddress(data.message);
          const shrtwa = walletaddress?.substring(0,18)+' ...';
          setShortWalletAddress(shrtwa);
        } catch (error) {
          console.log(error)
        }
    }

    async function updateWalletAddress(username: string) {
        try {
          const config = {
          headers: {
              "Content-type": "application/json"
          }
          }  
          const addr = address;
          console.log("addr ",addr)
          const {data} = await axios.post("https://fifareward.onrender.com/api/users/updatewalletaddress/", {
            addr,
            username
          }, config);
          if(data) {
            getWalletAddress(username);
          }
          // setisWalletAddressUpdated(!isWalletAddressUpdated);

        } catch (error) {
          console.log(error)
        }
    }

    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    if(udetails && udetails !== null && udetails !== "") {
      const username_ = udetails.username;
      // if(udetails.isinfluencer == true) {
      //   setIsinfluencer(true);
      // }  
      
      if(username_) {
        setUsername(username_);
        setIsSponsorId(udetails.sponsorId);
        setUserId(udetails.userId)
        setUserObjId(udetails._id);
        if(udetails.isinfluencer == true) {
          setreferralLink(`https://fifareward.io/register/${udetails.userId}/${username_}`);
        }else {
          setreferralLink(`https://fifareward.io/register/${udetails.userId}`);
        }
        updateWalletAddress(username_);
        getSponsorWalletAddress(udetails.sponsorId);
      }
    }else {
      router.push(`/signin`);
    }

// if(isConnected) {
//   if(sponsorId != 0) {
      
//   }
// }

 }, [userId,address,router,username,walletaddress,sponsorId,userObjId,shortwalletaddress])

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
            <div className={dappstyles.cw}>Connected Wallet: <span style={{color: 'orange'}}>{shortwalletaddress}</span><div style={{color: 'orange'}} className={dappstyles.cws}><div>{walletaddress}</div></div><button onClick={(e) => toggleWA(e.target)}>view</button></div>
        </div>
    </>
  );
}

export default ReferralLink