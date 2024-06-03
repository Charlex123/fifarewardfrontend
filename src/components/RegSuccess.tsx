import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
// material
import regstyles from "../styles/register.module.css";
import { FaChevronLeft, FaCircleCheck } from 'react-icons/fa6';

const RegSuccess = () =>  {

  const router = useRouter();

  const { name } = router.query;
  
  const username = name;


  return (
    <>
      <Head>
          <title>Register Success | FifaReward</title>
          <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
      </Head>
        <a href='/register' rel='noopener noreferrer' className={regstyles.back}> <FaChevronLeft />Back </a>
        <div className={regstyles.regsuccess}>
            <div className={regstyles.regs_in}>
              <h3>Registration Successful <FaCircleCheck /></h3>
              <div>
                  <p>Hello, <span>{username}</span>, you've successfully registered with TafaXtra</p>
                  <a href='/dapp' rel='noreferrer noopener'>Log In To Dapp</a>
              </div>
            </div>
        </div>
    </>
  );
}

export default RegSuccess