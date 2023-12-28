import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import OpenAI from 'openai'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheckCircle, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft  } from "@fortawesome/free-solid-svg-icons";
// material
import regstyles from "../styles/register.module.css";
// component
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const LoadOpenAI: React.FC<{}> = () =>  {

  const [chatCompletion,setChatCompletion] = useState<any>('')

  // const openai = new OpenAI({
  //   apiKey: process.env.OPENAI_API_KEY
  // });
  
  // useEffect(() => {
  //   console.log('ope key',process.env.OPENAI_API_KEY);

  //   async function main() {
  //     const params: OpenAI.Chat.ChatCompletionCreateParams = {
  //       messages: [{ role: 'user', content: 'Say this is a test' }],
  //       model: 'gpt-3.5-turbo',
  //     };
  //     const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
  //     setChatCompletion(chatCompletion)
  //   }
  //   main()
    
  // })
  
  return (
    <>
        <a href='/register' rel='noopener noreferrer' className={regstyles.back}> <FontAwesomeIcon icon={faChevronLeft} />Back </a>
        <div className={regstyles.regsuccess}>
            <div className={regstyles.regs_in}>
                <h3>Account Activation Success <FontAwesomeIcon icon={faCheckCircle} /></h3>
                <div>
                    <p>Hello <span>{chatCompletion}</span>, your account creation is successful</p>
                    <a href='/signin' rel='noopener noreferrer'> Proceed To Login </a>
                </div>
            </div>
        </div>
    </>
  );
}

export default LoadOpenAI