import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import chatbotlogo from '../assets/images/aichatbot.png';
import successimage from '../assets/images/success1.png';
import { ThemeContext } from '../contexts/theme-context';
import { faEye, faEyeSlash, faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faLocationArrow, faMicrophone, faXmark  } from "@fortawesome/free-solid-svg-icons";
// material
import styles from "../styles/aichat.module.css";
import dotenv from 'dotenv';
dotenv.config();
// component
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const LoadOpenAI: React.FC<{}> = () =>  {

  const [showloading, setShowLoading] = useState<boolean>(false);
  const { theme } = useContext(ThemeContext);
 
  useEffect(() => {
    
  })
  
  return (
    <>
      <div className={`${styles.main} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`}>
        <div className={styles.main_bg_overlay}></div>
          <div>
            <div>
              <h1>FootBall Prediction AI Assistant</h1>
            </div>
            <div className={styles.intro_p}>
              <p>
                Our Football AI Chandra will give you football predictions 
              </p>
            </div>
          </div>
          <div className={styles.main_c}>
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
                              <span> I'm Chandra, your football prediction AI assistant, how can i help you today!  </span>
                            </div>
                          </div>

                            {/* <div className={`${styles.card_header} ${styles.msg_head}`}>
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
                            </div> */}
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