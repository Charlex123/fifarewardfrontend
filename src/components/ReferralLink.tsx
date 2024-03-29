import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
// import DappSideBar from './Dappsidebar';
// material

// import Loading from "./Loading";
// import AlertMessage from "./AlertMessage";
import dappstyles from "../styles/dapp.module.css";
import { ThemeContext } from '../contexts/theme-context';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import axios from 'axios';
import { fas, faCheck, faCheckCircle,faAlignJustify } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';

library.add(fas, faTwitter, faFontAwesome,faQuestionCircle, faCheck,faCheckCircle,faAlignJustify)
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);

const ReferralLink:React.FC<{}> = () =>  {

  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<number>();  
  const [walletaddress, setWalletAddress] = useState<any>("NA");  

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

 console.log("ref u address", address)
  
  useEffect(() => {
    setWalletAddress(address);

    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    if(udetails && udetails !== null && udetails !== "") {
      const username_ = udetails.username;  
      if(username_) {
        setUsername(username_);
        setUserId(udetails.userId)
        setUserObjId(udetails._id)
        setreferralLink(`https://fifareward.io/register/${udetails.userId}`);
      }
    }else {
      router.push(`/signin`);
    }

    if(address) {
        async function updateWalletAddress() {
          try {
            const config = {
            headers: {
                "Content-type": "application/json"
            }
            }  
            const {data} = await axios.post("http://localhost:9000/api/users/updatewalletaddress/", {
              walletaddress,
              username
            }, config);
            console.log('update wallet data', data.message);
            // setisWalletAddressUpdated(!isWalletAddressUpdated);
          } catch (error) {
            console.log(error)
          }
      }
      updateWalletAddress();
    }
    
  async function getWalletAddress() {
    
    try {
      const config = {
      headers: {
          "Content-type": "application/json"
      }
      }  
      const {data} = await axios.post("http://localhost:9000/api/users/getwalletaddress/", {
        username
      }, config);
      setWalletAddress(data.message);
    } catch (error) {
      console.log(error)
    }
}
getWalletAddress();

 }, [userId,address,router,username,walletaddress,userObjId])


  return (
    <>
        <div className={`${dappstyles.reflink} ${theme === 'dark' ? dappstyles['darkmod'] : dappstyles['lightmod']}`} >
            <div className={dappstyles.reflinkdex}>Ref Link: <input title="input" value={referralLink} readOnly /><button type='button' onClick={handleCopyClick}>{buttonText}</button> </div>
            <div><small>Share referral link to earn more FRD!</small></div>
            <div>Connected Wallet: <span style={{color: 'orange'}}>{walletaddress}</span></div>
        </div>
    </>
  );
}

export default ReferralLink