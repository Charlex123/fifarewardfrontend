import { useContext,useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
// material
import Loading from "./Loading";
import AlertMessage from "./AlertMessage";
import regstyles from "../styles/register.module.css";
import { ThemeContext } from '../contexts/theme-context';
// component
import Web3 from "web3";
import { faLock } from '@fortawesome/free-solid-svg-icons';

// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const InfluencerRegisterForm = () =>  {

  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUserame] = useState("");
  const [pic] = useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );
  const [password, setPassword] = useState<string>("");
  const [confirmpassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [sponsorId, setSponsorId] = useState<any>("");
  const [badge] = useState<string>("Bronze");
  const [tpin] = useState<any>(1234);
  const [loading, setLoading] = useState<boolean>(false);
  const [isinfluncer] = useState<boolean>(true);
  const [status] = useState<any>("Inactive");
  const [passwordinputType, setpasswordinputType] = useState<string>("password");
  const [eyeIcon, setEyeIcon] = useState(<FontAwesomeIcon icon={faEye} />);
  //   const [accounts, setAccounts] = useState([]);

//   const isConnected = Boolean(accounts[0]);

    const {id} = router.query

    useEffect(() => {
      if(!id) {
        return;
      }
      setSponsorId(id);
    },[id])

    // mainnet 
    // const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
    // testnet
    const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

    const bscaccount = web3.eth.accounts.create();
    const bscwalletaddress = bscaccount.address;
    const bscwalletprivatekey = bscaccount.privateKey;

    const togglePasswordVisiblity = () => {
    if(passwordinputType === "password") {
      setpasswordinputType("text")
      setEyeIcon(<FontAwesomeIcon icon={faEye} />)
    }else {
      setpasswordinputType("password")
      setEyeIcon(<FontAwesomeIcon icon={faEyeSlash} />);
    }
  };
  
  const checkPass = (e:any) => {
    if (password !== confirmpassword) {
      setError(true)
      setErrorMessage("Passwords do not match");
    }else {
      setError(false);
    }
  } 

  const checkUsername = async (e:any) => {
    setLoading(true);
    setUserame(e.target.value)
    console.log(username)
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    }
    const {data} = await axios.post("http://localhost:9000/api/users/checkusername", {
          username,
    }, config);
    if(data) {
      setLoading(false);
      setError(true)
      setErrorMessage(data.message)
    }
  }

  const checkEmail = async (e:any) => {
    setLoading(true);
    setEmail(e.target.value)
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    }
    const {data} = await axios.post("http://localhost:9000/api/users/checkemail", {
          email,
    }, config);
    if(data) {
      setLoading(false);
      setError(true)
      setErrorMessage(data.message)
    }
  }

  const submitHandler = async (e:any) => {
    e.preventDefault();
    console.log('uname',username)
    if (password !== confirmpassword) {
      setError(true)
      setErrorMessage('Passwords do not match')
    }else {
      setError(false);
      try {
        const config = {
          headers: {
            "Content-type": "application/json"
          }
        }  
        
        setLoading(true);
        const {data} = await axios.post("http://localhost:9000/api/users/register", {
          username,
          sponsorId,
          email,
          isinfluncer,
          badge,
          tpin,
          status,
          password,
          bscwalletaddress,
          bscwalletprivatekey,
          pic
        }, config);
  
        console.log('Reg response data',data)
        localStorage.setItem("userInfo", JSON.stringify(data))
        setLoading(false)
        router.push(`/emailverifystatus/${data.message}`)
      } catch (error:any) {
        setError(true)
        setErrorMessage(error.response.data)
        console.log(error.response.data)
      }
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
        <div className={`${regstyles.main} ${theme === 'dark' ? regstyles['darktheme'] : regstyles['lighttheme']}`}>
            <button type='button' title='button' className={regstyles.back} onClick={goBack}> {'<<'} Back</button>
            <form className={regstyles.formTag} onSubmit={submitHandler}>
            
            {error && <AlertMessage errorMessage={errorMessage} onChange={closeAlertModal} />}
            {loading && <Loading />}
            
            <div className={regstyles.fhead}>
                <h3>Create Influncer Account <FontAwesomeIcon icon={faLock} /></h3>
            </div>
            
            <div className={regstyles.form_group}>
                <label className={regstyles.formlabel} htmlFor="grid-last-name">Username</label>
                <input className={regstyles.forminput} id="grid_user_name" type="varchar" placeholder="Enter username" required
                  value={username}
                  onBlur={checkUsername}
                  onChange={(e) => setUserame(e.target.value.replace(' ', ''))}
                  />
            </div>
                
            <div className={regstyles.form_group}>
              <label className={regstyles.formlabel} htmlFor="grid-email"> Email</label>
                    <input className={regstyles.forminput} id="email" type="email" placeholder="Enter email" required
                    value={email}
                    onBlur={checkEmail}
                    onChange={(e) => setEmail(e.target.value.replace(' ', ''))}
                    />
            </div>

            <div className='form-group'>
                <label className={regstyles.formlabel} htmlFor="chromegrid-password"> Password</label>
                  <input className={regstyles.forminput} id="password" type={passwordinputType} placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(' ', ''))}
                  />
                  <button className={regstyles.passhideshowButton} onClick={togglePasswordVisiblity} type="button">{eyeIcon}</button>
                  <p className={regstyles.formpTag}>Make it as long and as crazy as you'd like</p>
            </div>

            <div className={regstyles.form_group}>
                <label className={regstyles.formlabel} htmlFor="grid-password">Confirm Password</label>
                  <input className={regstyles.forminput} id="confirmpassword" type={passwordinputType} placeholder="Confirm password"
                  value={confirmpassword}
                  onBlur={checkPass}
                  onChange={(e) => setConfirmPassword(e.target.value.replace(' ', ''))}
                  />
                  <button className={regstyles.passhideshowButton} onClick={togglePasswordVisiblity} type="button">{eyeIcon}</button>
                <p className={regstyles.formpTag}>Your password is encrypted and secured, we will not disclose your password with any third</p>
            </div>

            <div className={regstyles.form_group}>
                <label className={regstyles.formlabel} htmlFor="grid-password">SponsorID</label>
                  <input className={regstyles.forminput} id="sponsor" type="text" placeholder="Sponsor"
                  value={sponsorId}
                  onChange={(e) => setSponsorId(e.target.value)}
                  />
            </div>
            
            <div className={regstyles.btns}>
              <button className={regstyles.registerButton} type="submit">
                Register
              </button>
              <div className={regstyles.alink}>Already have account? <a href='/signin' rel='noopener noreferrer'>Sign In</a></div>
            </div>
          </form>
        </div>
    </>
  );
}

export default InfluencerRegisterForm