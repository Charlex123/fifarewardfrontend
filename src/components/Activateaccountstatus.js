import React from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheckCircle, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft  } from "@fortawesome/free-solid-svg-icons";
// material
import regstyles from "../styles/register.module.css";
// component

// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const EmailVStatus = () =>  {

  const router = useRouter();

  const { name } = router.query;
  
  const username = name;
  
  return (
    <>
        <a href='/register' rel='noopener noreferrer' className={regstyles.back}> <FontAwesomeIcon icon={faChevronLeft} />Back </a>
        <div className={regstyles.regsuccess}>
            <div className={regstyles.regs_in}>
                <h3>Account Activation Success <FontAwesomeIcon icon={faCheckCircle} /></h3>
                <div>
                    <p>Hello <span>{username}</span>, your account creation is successful</p>
                    <a href='/signin' rel='noopener noreferrer'> Proceed To Login </a>
                </div>
            </div>
        </div>
    </>
  );
}

export default EmailVStatus