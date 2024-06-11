import React, { useState, useContext } from 'react';
// material
import axios from 'axios';
import loginmodalstyles from '../styles/loginmodal.module.css'
import { ThemeContext } from '../contexts/theme-context';
// component
import Loading from './Loading';
import LogInSuccessModal from './LoginSuccessModal';
import AlertMessage from './AlertMessage';
import { FaEye, FaEyeSlash, FaXmark } from 'react-icons/fa6';

interface ChildProps {
    prop: string,
    onChange: (newValue: boolean) => void;
}
const LoginModal:React.FC <ChildProps> = ({prop,onChange}) => {
  
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, seterrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [isloginSuccess, setIsLoginSuccess] = useState<boolean>(false);
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

  const closeModal = () => {
    onChange(false);
  }

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
      }else {
        localStorage.setItem("userInfo", JSON.stringify(data));
        console.log('login res data',data)
        console.log('login res username',data.username)
        setLoading(false);
        setIsLoginSuccess(true);
        let loginModalDiv = document.getElementById('loginmodalid') as HTMLElement;
        loginModalDiv.style.display = 'none';
        // router.push(`/dapp/`)
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
        <div className={loginmodalstyles.loginmodalmain} id="loginmodalid">
            <div className={loginmodalstyles.loginmodalmainin}>
                <div className={loginmodalstyles.closebtn}><button type='button' title='button'>{<FaXmark onClick={closeModal} />}</button></div>
                <form className={loginmodalstyles.formTag} onSubmit={submitHandler}>
                {error && <AlertMessage errorMessage={errorMessage} onChange={closeAlertModal} />}
                {loading && <Loading />}
                <div className={loginmodalstyles.fhead}>
                    <h3>Sign In To {prop}</h3>
                </div>
                <div className={loginmodalstyles.form_group}>
                    <label className={loginmodalstyles.formlabel} htmlFor="grid-last-name">Email</label>
                        <input className={loginmodalstyles.forminput} id="grid-last-name" required autoComplete='true'
                        type="email"
                        value={email}
                        placeholder="Enter email"
                        onBlur={checkEmail}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                </div>
                <div className={loginmodalstyles.form_group}>
                    <label className={loginmodalstyles.formlabel} htmlFor="grid-password">Password</label>
                    <input className={loginmodalstyles.forminput} id="grid-password"
                        type={passwordinputType}
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className={loginmodalstyles.passhideshowButton} onClick={togglePasswordVisiblity} type="button">{eyeIcon}</button>
                    <p className={loginmodalstyles.formpTag}>Make it as long and as crazy as you'd like</p>
                    <div className={loginmodalstyles.fpass}><a href='/forgotpassword' rel='noopener referrer'>Forgot Password?</a></div>
                </div>
                    
                <div className={loginmodalstyles.btns}>
                    <button className={loginmodalstyles.registerButton} type="submit">
                        Login
                    </button>
                    <div className={loginmodalstyles.alink}>Don't have account? <a href='/register' rel='noopener  noreferrer'>Register</a></div>
                </div>
            </form>
            </div>
        </div>
        {isloginSuccess && 
            <LogInSuccessModal prop='close modal' />
        }  
    </>
  );
}

export default LoginModal;