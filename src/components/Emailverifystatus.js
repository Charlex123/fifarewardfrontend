import { React, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheckCircle, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft  } from "@fortawesome/free-solid-svg-icons";
// material
import Loading from "./Loading";
import AlertMessage from "./AlertMessage";
import regstyles from "../styles/register.module.css";
// component

// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const EmailVStatus = () =>  {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

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
      const {data} = await axios.post("https://tafabackend.onrender.com/api/users/resendverifyemail", {
            username,
      }, config);
      if(data) {
        setLoading(false);
        setError(data.message)
      }
  }

  return (
    <>
        <a href='/register' rel='noopener noreferrer' className={regstyles.back}> <FontAwesomeIcon icon={faChevronLeft} />Back </a>
        <div className={regstyles.regsuccess}>
        {error && <AlertMessage variant="danger">{error}</AlertMessage>}
        {loading && <Loading />}
            <div className={regstyles.regs_in}>
                <h3>Registration Successful <FontAwesomeIcon icon={faCheckCircle} /></h3>
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