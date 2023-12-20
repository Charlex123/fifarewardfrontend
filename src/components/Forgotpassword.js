import React, { useEffect, useState } from 'react';
import {useRouter} from 'next/navigation'
// material
import axios from 'axios';
import loginstyles from '../styles/login.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash  } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft  } from "@fortawesome/free-solid-svg-icons";
// component
import Loading from '../components/Loading';
import AlertMessage from './AlertMessage';
import { faLockOpen } from '@fortawesome/free-solid-svg-icons';

// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);

export default function LoginForm() {
  
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmnewpassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [passwordinputType, setpasswordinputType] = useState("password");
  const [eyeIcon, setEyeIcon] = useState(<FontAwesomeIcon icon={faEye} />);
  
  
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
    if (newpassword !== confirmnewpassword) {
      setError("Passwords do not match");
    }else {
      setError(null);
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
    const {data} = await axios.post("https://tafabackend.onrender.com/api/users/checkforgotemail", {
          email,
    }, config);
    if(data) {
      setLoading(false);
      setError(data.message)
    }
  }
  

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }  
      setLoading(true)
      console.log(email)
      console.log(newpassword)
      const {data} = await axios.post("https://tafabackend.onrender.com/api/users/resetpassword", {
        email,
        newpassword,
        confirmnewpassword
      }, config);
      localStorage.setItem("userInfo", JSON.stringify(data));
      console.log('login res data',data)
      console.log('login res username',data.username)
      setLoading(false)
      router.push(`/signin`)
    } catch (error) {
      console.log(error.response.data)
    }
  }

  return (
    <>
        <div>
            <a href='/signin' rel='noopener noreferrer' className={loginstyles.back}> <FontAwesomeIcon icon={faChevronLeft} />Back to login</a>
            <form className={loginstyles.formTag} onSubmit={submitHandler}>
            {error && <AlertMessage variant="danger">{error}</AlertMessage>}
            {loading && <Loading />}
            <div className={loginstyles.fhead}>
                <h3>Recover Password <FontAwesomeIcon icon={faLockOpen} /></h3>
            </div>
            <div className={loginstyles.form_group}>
              <label className={loginstyles.formlabel} htmlFor="grid-last-name">Email</label>
                  <input className={loginstyles.forminput} id="grid-last-name" required
                  type="email"
                  value={email}
                  onBlur={checkEmail}
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                  />
            </div>
            <div className={loginstyles.form_group}>
              <label className={loginstyles.formlabel} htmlFor="grid-password">New Password</label>
              <input className={loginstyles.forminput} id="grid-password" 
                  type={passwordinputType}
                  value={newpassword}
                  placeholder="New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className={loginstyles.form_group}>
              <label className={loginstyles.formlabel} htmlFor="grid-password">Confirm New Password</label>
              <input className={loginstyles.forminput} id="cgrid-password" 
                  type={passwordinputType}
                  value={confirmnewpassword}
                  placeholder="Confirm New Password"
                  onMouseOut={checkPass}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <button className={loginstyles.passhideshowButton} onClick={togglePasswordVisiblity} type="button">{eyeIcon}</button>
              <p className={loginstyles.formpTag}>Make it as long and as crazy as you'd like</p>
            </div>
              
            <div className={loginstyles.btns}>
              <button className={loginstyles.registerButton} type="submit">
                  Reset Password
              </button>
            </div>
          </form>
        </div>
    </>
  );
}
