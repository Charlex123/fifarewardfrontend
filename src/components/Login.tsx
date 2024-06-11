import React, { useState, useContext } from 'react';
import {useRouter} from 'next/navigation'
// material
import axios from 'axios';
import loginstyles from '../styles/login.module.css'
// component
import Loading from './Loading';
import AlertMessage from './AlertMessage';
import { ThemeContext } from '../contexts/theme-context';
import { FaChevronLeft, FaEye, FaEyeSlash, FaLockOpen } from 'react-icons/fa6';

export default function LoginForm() {
  
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, seterrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const [passwordinputType, setpasswordinputType] = useState("password");
  const [eyeIcon, setEyeIcon] = useState(<FaEye />);
  
  const checkEmail = async (e:any) => {
    setLoading(true);
    setEmail(e.target.value)
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    }
    const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/users/checkloginemail", {
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
      setEyeIcon(<FaEye />)
    }else {
      setpasswordinputType("password")
      setEyeIcon(<FaEyeSlash />);
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
      const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/users/signin", {
        email,
        password
      }, config);
      
      if(data.message === "Invalid Email or Password") {
        setError(true)
        seterrorMessage(data.message)
        setLoading(false)
      }else if(data.message === "your account is inactive, activate it using the activation link sent to your email") {
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
        <div className={`${loginstyles.main} ${theme === 'dark' ? loginstyles['darktheme'] : loginstyles['lighttheme']}`}>
          <a href='/' rel='noopener noreferrer' className={loginstyles.back}> <FaChevronLeft />Back to home</a>
          <form className={loginstyles.formTag} onSubmit={submitHandler}>
          {error && <AlertMessage errorMessage={errorMessage} onChange={closeAlertModal} />}
          {loading && <Loading />}
          <div className={loginstyles.fhead}>
              <h3>Sign In <FaLockOpen /></h3>
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
