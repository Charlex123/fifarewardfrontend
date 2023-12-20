import React from "react";
import loadingstyles from '../styles/loading.module.css'
const Loading = () => {
  return (
    <>
      <div className={loadingstyles.spinner}></div>
    </>
  );
}

export default Loading;
