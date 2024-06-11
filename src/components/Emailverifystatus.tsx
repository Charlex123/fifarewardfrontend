import React from 'react';
import { useState } from 'react'
import { useRouter } from 'next/router';
import axios from 'axios';
// material
import Loading from "./Loading";
import AlertMessage from "./AlertMessage";
import regstyles from "../styles/register.module.css";
import { FaCircleCheck } from 'react-icons/fa6';
// component

const EmailVStatus: React.FC<{}> = () =>  {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

  const router = useRouter();

  const { name } = router.query;
  
  const username = name;

  const ResendVerifyEmail = async () => {
    setLoading(true);
    const config = {
        headers: {
          "Content-type": "application/json"
        }
      }
      const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/users/resendverifyemail", {
            username,
      }, config);
      if(data) {
        setLoading(false);
        setError(true)
        setErrorMessage(data.message)
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
        <button type='button' title='button' className={regstyles.back} onClick={goBack}> {'<<'} Back</button>
        <div className={regstyles.regsuccess}>
        {error && <AlertMessage errorMessage={errorMessage} onChange={closeAlertModal} />}
        {loading && <Loading />}
            <div className={regstyles.regs_in}>
                <h3>Registration Successful <FaCircleCheck /></h3>
                <div>
                    <p>Hello <span>{username}</span>, an email has been sent to the email you registered with</p>
                    <p>If you didn't see any email in 15 minutes, check your spam folder</p>
                    <button type='button' onClick={ResendVerifyEmail}> Resend Email </button>
                </div>
            </div>
        </div>
    </>
  );
}

export default EmailVStatus