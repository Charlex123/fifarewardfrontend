import { useContext,useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ConnectWallet from './ConnectWalletButton';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
// material
import { decode } from '../utils/hexUtils';

import Loading from "./Loading";
import AlertMessage from "./AlertMessage";
import regstyles from "../styles/register.module.css";
import { ThemeContext } from '../contexts/theme-context';
// component
import Head from 'next/head';
// import Web3 from "web3";
import { useWeb3Modal } from '@web3modal/ethers5/react';

const InfluencerReg = () =>  {

  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const [pic] = useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );
  const { address, isConnected } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [sponsoraddress, setSponsoraddress] = useState<string>("");
  const [badge] = useState<string>("Bronze");
  const [loading, setLoading] = useState<boolean>(false);
  const [issponsorinfluencer, setIssponsorinfluencer] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [isinfluencer] = useState<boolean>(true);
  const [wasreferred, setWasRefeered] = useState<boolean>(false);
  //   const [accounts, setAccounts] = useState([]);

//   const isConnected = Boolean(accounts[0]);

    const {id} = router.query;
    useEffect(() => {
      if(!id || id == undefined) {
        return;
      }else if(id[1] && id[1] != null && id[1] != undefined){
        setWasRefeered(true);
        setIssponsorinfluencer(true);
        const decrypted = decode(id[1]);
        setSponsoraddress(decrypted);
        
      }else {
        setIssponsorinfluencer(false)
      }
      
    },[id, router])

    // mainnet 
    // const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
    // testnet
    // const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

    // const bscaccount = web3.eth.accounts.create();
    // const bscwalletaddress = bscaccount.address;
    // const bscwalletprivatekey = bscaccount.privateKey;

//     const togglePasswordVisiblity = () => {
//     if(passwordinputType === "password") {
//       setpasswordinputType("text")
//       setEyeIcon(<FaEye />)
//     }else {
//       setpasswordinputType("password")
//       setEyeIcon(<FaEyeSlash />);
//     }
//   };
  
//   const checkPass = (e:any) => {
//     if (password !== confirmpassword) {
//       setError(true)
//       setErrorMessage("Passwords do not match");
//     }else {
//       setError(false);
//     }
//   } 

//   const checkUsername = async (e:any) => {
//     setLoading(true);
//     setUsername(e.target.value)
//     console.log(username)
//     const config = {
//       headers: {
//         "Content-type": "application/json"
//       }
//     }
//     const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/users/checkusername", {
//           username,
//     }, config);
//     if(data) {
//       setLoading(false);
//       setError(true)
//       setErrorMessage(data.message)
//     }
//   }

//   const checkEmail = async (e:any) => {
//     setLoading(true);
//     setEmail(e.target.value)
//     const config = {
//       headers: {
//         "Content-type": "application/json"
//       }
//     }
//     const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/users/checkemail", {
//           email,
//     }, config);
//     if(data) {
//       setLoading(false);
//       setError(true)
//       setErrorMessage(data.message)
//     }
//   }

function compareHexStrings(address1: any, address2: any) {
  // Convert both strings to lowercase
  const normalizedHex1 = address1.toLowerCase();
  const normalizedHex2 = address2.toLowerCase();

  // Return the comparison result
  return normalizedHex1 === normalizedHex2;
}

  const submitHandler = async (e:any) => {
    e.preventDefault();
    if(isConnected) {
      if((compareHexStrings(address, sponsoraddress))) {
        setError(true)
        setErrorMessage("You can't refer yourself");
        return;
      }
      setError(false);
      try {
        const config = {
          headers: {
            "Content-type": "application/json"
          }
        }  
        console.log("address", address,sponsoraddress)
        setLoading(true);
        const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/users/addupdateuser", {
          username,
          address,
          sponsoraddress,
          issponsorinfluencer,
          isinfluencer,
          badge,
          pic
        }, config);
        setLoading(false)
        if(data.message == "You can't refer yourself") {
          setError(true);
          setErrorMessage(data.message)
        }else {
          router.push(`/dapp`)
        }
        console.log('Reg response data',data)
        
      } catch (error:any) {
        setError(true)
        setErrorMessage(error.response.data)
        console.log(error.response.data)
      }
    }else {
      open()
    }
      
  
}

const closeAlertModal = () => {
  setError(false)
}

const goBack = () => {
  router.back();
}

  return (
    <>
        <Head>
            <title>Influencer | Fifareward</title>
            <meta name='description' content='Fifareward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
        </Head>
        <div className={`${regstyles.main} ${theme === 'dark' ? regstyles['darktheme'] : regstyles['lighttheme']}`}>
            <div className={regstyles.cbtn}>
              <div>
                <button type='button' title='button' className={regstyles.back} onClick={goBack}> {'<<'} Back</button>
              </div>
              <div>
                <ConnectWallet />
              </div>
            </div>
            <form className={regstyles.formTag} onSubmit={submitHandler}>
            
            {error && <AlertMessage errorMessage={errorMessage} onChange={closeAlertModal} />}
            {loading && <Loading />}
            
            <div className={regstyles.fhead}>
                <h3>Create Influencer Account </h3>
            </div>
            
                
            <div className={regstyles.form_group}>
              <label className={regstyles.formlabel} htmlFor="grid-email"> My Address</label>
                    <input className={regstyles.forminput} id="myaddress" placeholder="My address" required
                    value={address}
                    readOnly
                    />
            </div>

            <div className={regstyles.form_group}>
              <label className={regstyles.formlabel} htmlFor="grid-email"> Preferred Name (spaces are not allowed)</label>
                    <input className={regstyles.forminput} id="username" placeholder="Enter username" required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/ /g,''))}
                    />
            </div>

            {wasreferred && 
              <div className={regstyles.form_group}>
                  <label className={regstyles.formlabel} htmlFor="grid-password">Sponsor Address</label>
                    <input className={regstyles.forminput} id="sponsor" type="text" placeholder={sponsoraddress ? sponsoraddress : 'sponsor'}
                    value={sponsoraddress}
                    readOnly
                    />
              </div>
            }
            
            <div className={regstyles.btns}>
              <button className={regstyles.registerButton} type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
    </>
  );
}

export default InfluencerReg