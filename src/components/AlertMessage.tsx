import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import alertstyles from '../styles/alertmessage.module.css'

interface Props {
  errorMessage: string,
  onChange: (newValue: boolean) => void
}
const AlertMessage:React.FC<Props> = ({errorMessage,onChange}) => {

  const closeAlertMessageModule = () => {
    onChange(false)
  }

  return (
    <>
      <div className={alertstyles.main}>
        <div className={alertstyles.closebtn}><button type="button" title="button" onClick={closeAlertMessageModule}>{<FontAwesomeIcon icon={faXmark} />}</button></div>
        <div className={alertstyles.alert}>
          <strong>{errorMessage}</strong>
        </div>
      </div>
    </>
  );
};

export default AlertMessage;
