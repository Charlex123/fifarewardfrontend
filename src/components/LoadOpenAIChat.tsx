import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import chatbotlogo from '../assets/images/aichatbot.png';
import successimage from '../assets/images/success1.png';
import elipsisloading from '../assets/images/Ellipsis-1s-200px.svg';
import bgopt1 from '../assets/images/aibg.png';
import bgopt2 from '../assets/images/aibg2.jpg';
import bgopt3 from '../assets/images/aibg3.jpg';
import { faCheckCircle, faEye, faEyeSlash, faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft, faLocationArrow, faLocationPin, faMicrophone, faXmark  } from "@fortawesome/free-solid-svg-icons";
// material
import styles from "../styles/aichat.module.css";
import dotenv from 'dotenv';
dotenv.config();
// component
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const LoadOpenAI: React.FC<{}> = () =>  {

 
  useEffect(() => {
    
  })
  
  return (
    <>
      <div className={styles.main}>
        <div className={styles.main_bg_overlay}></div>
          <div>
            <div>
              <h1>Welcome To FifaReward Online FootBall AI Assistant</h1>
            </div>
            <div className={styles.intro_p}>
              <p>
                Where you chat and intereact with Alexa, FifaReward Online AI Assistant. You can ask for match predictions, generate images of any football legend and many more
              </p>
            </div>
          </div>
          <div className={styles.main_c}>
            <div className={styles.settings}>
              <div className={styles.settings_bg_overlay}></div>
              <div className={styles.settings_in}>
                <h2>Image Generaion Options</h2>
                <div className={styles.img_sel}>
                  <h2>Select your preferred image options</h2>
                </div>
                <div className={styles.bg_option}>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt1}  style={{objectFit:'cover',width: '100%',height: '80%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>3 D</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt2}  style={{objectFit:'cover',width: '100%',height: '80%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>Vintage</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt3}  style={{objectFit:'cover',width: '100%',height: '80%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>Human</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt1}  style={{objectFit:'cover',width: '100%',height: '80%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>3 D</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt2}  style={{objectFit:'cover',width: '100%',height: '80%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>3 D</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt3}  style={{objectFit:'cover',width: '100%',height: '80%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>3 D</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt1}  style={{objectFit:'cover',width: '100%',height: '80%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>3 D</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt2}  style={{objectFit:'cover',width: '100%',height: '80%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>Vintage</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt3}  style={{objectFit:'cover',width: '100%',height: '80%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>Human</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt1}  style={{objectFit:'cover',width: '100%',height: '80%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>3 D</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt2}  style={{objectFit:'cover',width: '100%',height: '80%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>3 D</div>
                  </div>
                  <div className={styles.bg_options_}>
                    <Image src={bgopt3}  style={{objectFit:'cover',width: '100%',height: '80%',borderRadius: '8px'}} alt='bg options'/>
                    <div className={styles.bg_opt_text}>3 D</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.chat}>
              {/* <div className={styles.chat_bg_overlay}></div> */}
              <div className={styles.card}>
                
                
                <div className={styles.chat_wrapper} id="chat-wrapper">
                    
                    <div className={`${styles.card_body} ${styles.msg_card_body}`} id="chatbox">
                        <div className={`${styles.card_header} ${styles.msg_head}`}>
                          <div className={styles.d_flex}>
                            <div className={styles.img_cont}>
                              <Image src={chatbotlogo} alt={'Image'} width={60} height={80} className={`${styles.rounded_circle} ${styles.user_img}`}/>
                              <span className={styles.online_icon}></span>
                            </div>
                            <div className={styles.user_info}>
                              <span> Welcome to Fifa Reward Online AI Assistant, My name is Alexo, I can do the following for you</span>
                            </div>
                          </div>

                            <div className={`${styles.card_header} ${styles.msg_head}`}>
                             <ul>
                              <li>
                                Generate AI images of any type for you
                              </li>
                              <li>
                                Answer any question you ask me
                              </li>
                              <li>
                                Give you possible football predictions using previously established patterns when you ask me correctly
                              </li>
                              <li>
                                And many other things
                              </li>
                             </ul>
                            </div>
                        </div>

                        <div className={styles.chat_convo} id="chat-convo">
                          <div className={styles.justify_content_start}>
                                <div>
                                    <div className={styles.justify_content_start}>
                                        <div className={styles.msg_cotainer_send}>
                                            <div className={`${styles.text_left} ${styles.message}`}>Hello Messge</div>
                                            <div style={{clear:'both'}}></div>
                                        </div>
                                    </div>
                                </div>
                          </div>

                          <div className={styles.justify_content_start}>
                                <div>
                                    <div className={styles.justify_content_start}>
                                        <div className={styles.doc_msg_cotainer_send}>
                                    <div className={`${styles.text_left} ${styles.message}`}>Hello I replied</div>
                                </div><div style={{clear:'both'}}></div>
                                <div className={styles.user_reactn}><span className={styles.like}>{<FontAwesomeIcon icon={faThumbsUp} />}</span> <span className={styles.dislike}>{<FontAwesomeIcon icon={faThumbsDown} />}</span></div>
                                    </div>
                                </div>
                          </div>
                        </div>

                        <div id="success-pop" aria-hidden="true" className={styles.div_overlay}>
                            <div className={styles.div_overlay_inna}>
                                <span className={styles.pull_right}>{<FontAwesomeIcon icon={faXmark}/>}</span>
                                <div id="kkkd">
                                    <Image src={successimage} alt='image' className={styles.mx_auto}/>
                                    <div className={styles.mx_auto}>Success</div>
                                </div>
                            </div>
                        </div>  

                    </div>
                    
                    <div className={styles.card_footer}>
                        <div className={styles.terms}><a href="https://primehealth.ng/dr-julie-terms">Terms of use</a> </div>
                        <form method="POST" >
                            <div className={styles.instructions} id="instructions">Click the microphone button to speak</div>
                          <div className={styles.input_group}>
                            <textarea name="" id="message" className={`${styles.form_control} ${styles.type_msg}`} placeholder="Type your message..."></textarea>
                            <div className={styles.text_mic_icons}>
                              <div><span className={styles.send_btn}>{<FontAwesomeIcon icon={faLocationArrow} size='lg' style={{color:'#e3a204'}}/>}</span></div>
                              <div className={styles.voice_btn}><button className={styles.voice_btn_} type="button">{<FontAwesomeIcon icon={faMicrophone} size='lg' />}</button></div>
                            </div>
                          </div>
                          
                      </form>
                      
                    </div>  
                </div>
              </div>
            </div>
          </div>
      </div>
    </>
  );
}

export default LoadOpenAI