import React from 'react';
import { useRouter } from 'next/router';
// material
import Head from 'next/head';
import regstyles from "../styles/register.module.css";
import { FaChevronLeft, FaCircleCheck } from 'react-icons/fa6';
// component

const EmailVStatus: React.FC<{}> = () =>  {

  const router = useRouter();

  const { name } = router.query;
  
  const username = name;
  
  return (
    <>
        <Head>
          <title>Activate Account Success | FifaReward</title>
          <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
        </Head>

        <a href='/register' rel='noopener noreferrer' className={regstyles.back}> <FaChevronLeft />Back </a>
        <div className={regstyles.regsuccess}>
            <div className={regstyles.regs_in}>
                <h3>Account Activation Success <FaCircleCheck /></h3>
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