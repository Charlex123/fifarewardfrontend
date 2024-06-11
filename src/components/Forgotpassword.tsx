import React, { useEffect, useState } from 'react';
import {useRouter} from 'next/navigation'
// material
import axios from 'axios';
import loginstyles from '../styles/login.module.css'
// component
import Loading from '../components/Loading';
import AlertMessage from './AlertMessage';
import { FaChevronLeft, FaEye, FaEyeSlash, FaLockOpen } from 'react-icons/fa6';

 const LoginForm: React.FC<{}> = () => {
  
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmnewpassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [passwordinputType, setpasswordinputType] = useState("password");
  const [eyeIcon, setEyeIcon] = useState(<FaEye />);
  
  
  const togglePasswordVisiblity = () => {
    if(passwordinputType === "password") {
      setpasswordinputType("text")
      setEyeIcon(<FaEye />)
    }else {
      setpasswordinputType("password")
      setEyeIcon(<FaEyeSlash />);
    }
  };
  
  const checkPass = () => {
    if (newpassword !== confirmnewpassword) {
      setError(true);
      setErrorMessage("Passwords do not match");
    }else {
      setError(false);
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
    const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/users/checkforgotemail", {
          email,
    }, config);
    if(data) {
      setLoading(false);
      setError(data.message)
    }
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
      console.log(email)
      console.log(newpassword)
      const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/users/resetpassword", {
        email,
        newpassword,
        confirmnewpassword
      }, config);
      localStorage.setItem("userInfo", JSON.stringify(data));
      console.log('login res data',data)
      console.log('login res username',data.username)
      setLoading(false)
      router.push(`/signin`)
    } catch (error:any) {
      console.log(error.response.data)
    }
  }

  const closeAlertModal = () => {
    setError(false)
  }
  
  return (
    <>
        <div>
            <a href='/signin' rel='noopener noreferrer' className={loginstyles.back}> <FaChevronLeft />Back to login</a>
            <form className={loginstyles.formTag} onSubmit={submitHandler}>
            {error &&<AlertMessage errorMessage={errorMessage} onChange={closeAlertModal} />}
            {loading && <Loading />}
            <div className={loginstyles.fhead}>
                <h3>Recover Password <FaLockOpen /></h3>
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
export default LoginForm;