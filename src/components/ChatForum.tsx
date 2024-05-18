import React, { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import chatbotlogo from '../assets/images/aichatbot.png';
import successimage from '../assets/images/success1.png';
import { ThemeContext } from '../contexts/theme-context';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import UserList from '../components/UserList';
import HelmetExport from 'react-helmet';
import { faEye, faEyeSlash, faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faLocationArrow, faMicrophone, faPaperclip, faXmark  } from "@fortawesome/free-solid-svg-icons";
// material
import styles from "../styles/chatforum.module.css";
import dotenv from 'dotenv';
dotenv.config();
// component
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);

let socket: Socket;

interface Message {
    user: string;
    text: string;
    timestamp: Date;
    file?: any;
  }
  
  interface User {
    username: string;
    profilePic: string;
  }

const ChatForum: React.FC<{}> = () =>  {

  const fileInputRef = useRef<HTMLInputElement | null>(null);   
  const [showloading, setShowLoading] = useState<boolean>(false);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { theme } = useContext(ThemeContext);
  const [fileName, setFileName] = useState('');
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<number>(); 
  const [profileimage,setProfileImage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const router = useRouter();
  useEffect(() => {

    const fetchMessages = async () => {
        socket.emit('getMessages');
    };

    const handleNewMessage = (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleMessages = (messages: Message[]) => {
        setMessages(messages);
    };


    const fetchUsers = async () => {
        const {data} = await axios.get('http://localhost:9000/api/users/getusers');
        setUsers(data.data);
    };


    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    
    if(udetails && udetails !== null && udetails !== "") {
      const username_ = udetails.username;  
      if(username_) {
        setUsername(username_);
        setUserId(udetails.userId);
        setProfileImage(udetails.pic);
        setCurrentUser(udetails._id);
        socket = io('http://localhost:9000');
        fetchMessages();
        fetchUsers();
        socket.on('message', handleNewMessage);
        socket.on('messages', handleMessages);
      }
    }else {
      router.push(`/signin`);
    }

    
    return () => {
    if (socket) socket.disconnect();
    };

  },[])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file && file != null) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:9000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }  
        const content = response;
        const {data} = await axios.post('http://localhost:9000/api/chatforum/sendmessage', {
            userId,
            currentUser,
            content
        }, config);
        if(data) {
            // setActionSuccess(true);
            // setActionSuccessMessage("Profile upload ")
        }
        console.log('File uploaded successfully', data);
      } catch (error) {
        console.error('Error uploading file', error);
      }
    } else {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }  
            const content = text;
            const {data} = await axios.post('http://localhost:9000/api/chatforum/sendmessage', {
                userId,
                currentUser,
                content
            }, config);
            if(data) {
                // socket.emit('sendMessage', message);
                // setActionSuccess(true);
                // setActionSuccessMessage("Profile upload ")
            }
        } catch (error) {
            console.log("err mes",error)
        }
    }

    setText('');
    setFile(null);
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      console.log("file to upload",e.target.files[0])
    }
    
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
    <HelmetExport>
        <title>Group Chat Forum | FifaReward</title>
        <meta name='description' content='Share your opinion in Fifareward chat forum. FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
    </HelmetExport>
      <div className={`${styles.main} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`}>
        <div className={styles.main_bg_overlay}></div>
          <div>
            <div>
              <h1>Welcome To Fifareward Group Chat Forum</h1>
            </div>
            <div className={styles.intro_p}>
              <p>
                Share your ideas and opinions, contribute to other members ideas and opinions. 
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
                          {/* <div className={styles.d_flex}>
                            <div className={styles.img_cont}>
                              <Image src={chatbotlogo} alt={'Image'} width={60} height={80} className={`${styles.rounded_circle} ${styles.user_img}`}/>
                              <span className={styles.online_icon}></span>
                            </div>
                            <div className={styles.user_info}>
                              <span> I'm Chandra, your football prediction AI assistant, how can i help you today!  </span>
                            </div>
                          </div> */}

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
                                    <div className={styles.profile_message}>
                                        <div className={styles.grpmembers_msg_cotainer_send}>
                                            <div><Image src={chatbotlogo} alt={'Image'} width={35} height={40} className={`${styles.rounded_circle} ${styles.user_img}`}/></div>
                                            <div className={`${styles.text_left} ${styles.message}`}>Hello Messge Hello MessgeHello MessgeHello MessgeHello MessgeHello MessgeHello MessgeHello MessgeHello MessgeHello Messge</div>
                                        </div>
                                    </div>
                                </div>
                          </div>

                          <div className={styles.justify_content_start}>
                                <div>
                                    <div className={styles.profile_message}>
                                        <div className={styles.user_msg_cotainer_send}>
                                            <div className={`${styles.text_left} ${styles.message}`}>I repliedHello I repliedHello I repliedHello I repliedHello I repliedHello I repliedHello I replied</div>
                                            <div><Image src={chatbotlogo} alt={'Image'} width={35} height={40} className={`${styles.rounded_circle} ${styles.user_img}`}/></div>
                                        </div>
                                        {/* <div className={styles.user_reactn}><span className={styles.like}>{<FontAwesomeIcon icon={faThumbsUp} />}</span> <span className={styles.dislike}>{<FontAwesomeIcon icon={faThumbsDown} />}</span></div> */}
                                    </div>
                                </div>
                          </div>
                        </div>

                        <UserList users={users} />
                        <MessageList messages={messages} currentUser={currentUser} />
                        
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
                        <form method="POST" onSubmit={handleSubmit}>
                            <div className={styles.instructions} id="instructions">Click the microphone button to speak</div>
                          <div className={styles.input_group}>
                            <input
                                hidden
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*,video/*"
                                ref={fileInputRef}
                            />
                            <span>{<FontAwesomeIcon icon={faPaperclip} onClick={triggerFileInput} className={styles.fileIcon}/>} {fileName && <span className={styles.fileName}>{fileName}</span>}</span>
                            <textarea name="" id="message" className={`${styles.form_control} ${styles.type_msg}`} onChange={(e) => setText(e.target.value)} placeholder="Type your message..."></textarea>
                            <div className={styles.text_mic_icons}>
                              <div><span className={styles.send_btn}><button type='submit'>{<FontAwesomeIcon icon={faLocationArrow} size='lg' style={{color:'#e3a204'}}/>}</button></span></div>
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

export default ChatForum