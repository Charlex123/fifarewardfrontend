import React from "react";
import alertstyles from '../styles/alertdanger.module.css'
import { FaXmark } from "react-icons/fa6";

interface Props {
  errorMessage: string,
  onChange: (newValue: boolean) => void
}
const AlertDanger:React.FC<Props> = ({errorMessage,onChange}) => {

  const closeAlertDangerModule = () => {
    onChange(false)
  }

  return (
    <>
      <div className={alertstyles.main}>
          <div className={alertstyles.closebtn} style={{color: 'white'}}><button type="button" title="button" onClick={closeAlertDangerModule} style={{color: 'white'}}>{<FaXmark />}</button></div>
          <div className={alertstyles.alert}>
            <strong>{errorMessage}</strong>
          </div>
      </div>
    </>
  );
};

export default AlertDanger;
