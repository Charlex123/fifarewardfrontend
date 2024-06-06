import { useContext,useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ConnectWallet from './ConnectWalletButton';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
// material
import Loading from "./Loading";
import { decode } from '../utils/hexUtils';
import AlertMessage from "./AlertMessage";
import regstyles from "../styles/register.module.css";
import { ThemeContext } from '../contexts/theme-context';
// component
import Head from 'next/head';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { FaPeopleGroup } from 'react-icons/fa6';

const AddUser = () =>  {

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
  const [username] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [issponsorinfluencer, setIssponsorinfluencer] = useState<boolean>(false);
  const [isinfluencer] = useState<boolean>(false);
  //   const [accounts, setAccounts] = useState([]);

//   const isConnected = Boolean(accounts[0]);

    const {id} = router.query;

    useEffect(() => {
      if(!id || id == undefined) {
        return;
      }else if(id[1] && id[1] != null && id[1] != undefined){
        setIssponsorinfluencer(true);
        const decrypted = decode(id[1]);
        setSponsoraddress(decrypted);
      }else {
        setSponsoraddress(id[0]);
        setIssponsorinfluencer(false)
      }
      
    },[id])

    
  const submitHandler = async (e:any) => {
    e.preventDefault();
    if(isConnected) {
      setError(false);
      try {
        const config = {
          headers: {
            "Content-type": "application/json"
          }
        }  
        console.log("address", address,sponsoraddress)
        setLoading(true);
        const {data} = await axios.post("https://fifarewardbackend.onrender.com/api/users/addupdateuser", {
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
      // open()
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
            <title>Referrals | Fifareward</title>
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
                <h3>Add Sponsor <FaPeopleGroup size='28px' style={{marginBottom: '-7px'}}/></h3>
            </div>
            
                
            <div className={regstyles.form_group}>
              <label className={regstyles.formlabel} htmlFor="grid-email"> My Address</label>
                    <input className={regstyles.forminput} id="email" placeholder="My address" required
                    value={address}
                    readOnly
                    />
            </div>

            <div className={regstyles.form_group}>
                <label className={regstyles.formlabel} htmlFor="grid-password">Sponsor Address</label>
                  <input className={regstyles.forminput} id="sponsor" type="text" placeholder="Sponsor"
                  value={sponsoraddress}
                  readOnly
                  />
            </div>
            
            <div className={regstyles.btns}>
              <button className={regstyles.registerButton} type="submit">
                Add Sponsor
              </button>
            </div>
          </form>
        </div>
    </>
  );
}

export default AddUser