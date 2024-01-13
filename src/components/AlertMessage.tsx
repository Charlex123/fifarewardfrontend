import { useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import alertstyles from '../styles/alertmessage.module.css'

const AlertMessage = ({ variant = "info", children }:any) => {

  const[toggleAlert,setToggleAlert] = useState<boolean>(true);
  
  console.log('toggle alert',toggleAlert)
  const closeAlertMessageModule = () => {
    setToggleAlert(false);
    setTimeout(function() {
      setToggleAlert(true);
    },10000)
  }

  return (
    <>
    {toggleAlert && 
      <div className={alertstyles.main}>
        <div className={alertstyles.closebtn}><button type="button" title="button" onClick={closeAlertMessageModule}>{<FontAwesomeIcon icon={faXmark} />}</button></div>
        <div className={alertstyles.alert}>
          <strong>{children}</strong>
        </div>
      </div>
    } 
    </>
  );
};

export default AlertMessage;
