import React from "react";
import { Alert } from "react-bootstrap";

const AlertMessage = ({ variant = "info", children }) => {
  return (
    <Alert variant={variant} style={{ fontSize: 14, textAlign: 'center',fontFamily: 'Poppins', background: '#e27272', margin:'12px auto',padding: '8px 20px', color:'white', borderRadius: '120px', fontWeight:'lighter'}}>
      <strong>{children}</strong>
    </Alert>
  );
};

export default AlertMessage;
