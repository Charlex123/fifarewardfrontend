import React from "react";
import Image from "next/image";
import loadingimage from "../assets/images/loadingimage.png";
import loadingstyles from '../styles/loading.module.css';
const Loading = () => {
  return (
    <>
      <div className={loadingstyles.spinner}><Image src={loadingimage} width={30} height={30} alt="loader" style={{width: '100%', height: '100%'}}/></div>
    </>
  );
}

export default Loading;
