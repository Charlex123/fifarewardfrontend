import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import alertstyles from '../styles/alertdanger.module.css'

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
        <div className={alertstyles.closebtn}><button type="button" title="button" onClick={closeAlertDangerModule}>{<FontAwesomeIcon icon={faXmark} />}</button></div>
        <div className={alertstyles.alert}>
          <strong>{errorMessage}</strong>
        </div>
      </div>
    </>
  );
};

export default AlertDanger;
