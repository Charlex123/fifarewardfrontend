import React, { useState } from 'react';
import {useRouter} from 'next/navigation'
// material
import axios from 'axios';
import loginstyles from '../styles/login.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash  } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft  } from "@fortawesome/free-solid-svg-icons";
// component
import Loading from './Loading';
import AlertMessage from './AlertMessage';
import { faLockOpen } from '@fortawesome/free-solid-svg-icons';

// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);

export default function LoginForm() {
  
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, seterrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const [passwordinputType, setpasswordinputType] = useState("password");
  const [eyeIcon, setEyeIcon] = useState(<FontAwesomeIcon icon={faEye} />);
  
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
      setError(true);
      seterrorMessage(data.message)
    }
  }

  const togglePasswordVisiblity = () => {
    if(passwordinputType === "password") {
      setpasswordinputType("text")
      setEyeIcon(<FontAwesomeIcon icon={faEye} />)
    }else {
      setpasswordinputType("password")
      setEyeIcon(<FontAwesomeIcon icon={faEyeSlash} />);
    }
  };
  

  const submitHandler = async (e:any) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }  
      setLoading(true)
      const {data} = await axios.post("https://localhost:9000/api/users/signin", {
        email,
        password
      }, config);
      
      if(data.message === "Invalid Email or Password") {
        setError(true)
        seterrorMessage(data.message)
        setLoading(false)
      }else {
        localStorage.setItem("userInfo", JSON.stringify(data));
        console.log('login res data',data)
        console.log('login res username',data.username)
        setLoading(false)
        router.push(`/dapp/`)
      }
      
    } catch (error:any) {
      setError(true)
      seterrorMessage(error.response.data)
      console.log(error.response.data)
    }
  }

  const closeAlertModal = () => {
    setError(false)
  }
  
  return (
    <>
        <div>
          <a href='/' rel='noopener noreferrer' className={loginstyles.back}> <FontAwesomeIcon icon={faChevronLeft} />Back to home</a>
          <form className={loginstyles.formTag} onSubmit={submitHandler}>
          {error && <AlertMessage errorMessage={errorMessage} onChange={closeAlertModal} />}
          {loading && <Loading />}
          <div className={loginstyles.fhead}>
              <h3>Sign In <FontAwesomeIcon icon={faLockOpen} /></h3>
          </div>
          <div className={loginstyles.form_group}>
              <label className={loginstyles.formlabel} htmlFor="grid-last-name">Email</label>
                  <input className={loginstyles.forminput} id="grid-last-name" required
                  type="email"
                  value={email}
                  placeholder="Enter email"
                  onBlur={checkEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  />
          </div>
          <div className='labelDiv'>
              <label className={loginstyles.formlabel} htmlFor="grid-password">Password</label>
              <input className={loginstyles.forminput} id="grid-password" 
                  type={passwordinputType}
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
              />
              <button className={loginstyles.passhideshowButton} onClick={togglePasswordVisiblity} type="button">{eyeIcon}</button>
              <p className={loginstyles.formpTag}>Make it as long and as crazy as you'd like</p>
              <div className={loginstyles.fpass}><a href='/forgotpassword' rel='noopener referrer'>Forgot Password?</a></div>
          </div>
              
          <div className={loginstyles.btns}>
              <button className={loginstyles.registerButton} type="submit">
                  Login
              </button>
              <div className={loginstyles.alink}>Don't have account? <a href='/register' rel='noopener  noreferrer'>Register</a></div>
          </div>
          </form>
        </div>
    </>
  );
}
