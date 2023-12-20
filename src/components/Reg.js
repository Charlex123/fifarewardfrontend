import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft  } from "@fortawesome/free-solid-svg-icons";
// material
import Loading from "./Loading";
import AlertMessage from "./AlertMessage";
import regstyles from "../styles/register.module.css";
// component
import Web3 from "web3";
import { faLock } from '@fortawesome/free-solid-svg-icons';

// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const RegisterForm = () =>  {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUserame] = useState("");
  const [pic, setPic] = useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(false);
  const [error, setError] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sponsorId, setSponsorId] = useState("");
  const [level, setLevel] = useState("White Label");
  const [tpin, setTPin] = useState(1234);
  const [loading, setLoading] = useState(false);
  const [status] = useState("Inactive");
  const [passwordinputType, setpasswordinputType] = useState("password");
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
  
  const checkPass = (e) => {
    if (password !== confirmpassword) {
      setError(true)
      setErrorMessage("Passwords do not match");
    }else {
      setError(false);
    }
  } 

  const checkUsername = async (e) => {
    setLoading(true);
    setUserame(e.target.value)
    console.log(username)
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    }
    const {data} = await axios.post("https://tafabackend.onrender.com/api/users/checkusername", {
          username,
    }, config);
    if(data) {
      setLoading(false);
      setMessage(true)
      setMessageContent(data.message)
    }
  }

  const checkEmail = async (e) => {
    setLoading(true);
    setEmail(e.target.value)
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    }
    const {data} = await axios.post("https://tafabackend.onrender.com/api/users/checkemail", {
          email,
    }, config);
    if(data) {
      setLoading(false);
      setMessage(true)
      setMessageContent(data.message)
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log('uname',username)
    if (password !== confirmpassword) {
      setMessage("Passwords do not match");
    }else {
      setMessage(null);
      try {
        const config = {
          headers: {
            "Content-type": "application/json"
          }
        }  
        
        setLoading(true);
        setLevel("White Whale");
        const {data} = await axios.post("https://tafabackend.onrender.com/api/users/register", {
          username,
          sponsorId,
          email,
          level,
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
      } catch (error) {
        setError(true)
        setErrorMessage(error.response.data)
        console.log(error.response.data)
      }
  }
  
}

  return (
    <>
        <a href='/' rel='noopener noreferrer' className={regstyles.back}> <FontAwesomeIcon icon={faChevronLeft} />Back to home</a>
        <form className={regstyles.formTag} onSubmit={submitHandler}>
        
        {error && <AlertMessage variant="danger">{errorMessage}</AlertMessage>}
        {message && <AlertMessage variant="danger">{messageContent}</AlertMessage>}
        {loading && <Loading />}
        
        <div className={regstyles.fhead}>
            <h3>Create Account <FontAwesomeIcon icon={faLock} /></h3>
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
    </>
  );
}

export default RegisterForm