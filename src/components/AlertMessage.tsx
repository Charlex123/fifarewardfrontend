import React from "react";
import alertstyles from '../styles/alertmessage.module.css'
import { FaXmark } from "react-icons/fa6";

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
        <div className={alertstyles.closebtn}><button type="button" title="button" onClick={closeAlertMessageModule}>{<FaXmark />}</button></div>
        <div className={alertstyles.alert}>
          <strong>{errorMessage}</strong>
        </div>
      </div>
    </>
  );
};

export default AlertMessage;
