import React, { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useUser } from '../contexts/UserContext';
import successimage from '../assets/images/success1.png';
import { ThemeContext } from '../contexts/theme-context';
import socket from './Socket';
import AlertDanger from './AlertDanger';
import axios from 'axios';
import Spinner from './Spinner';
import { useWeb3ModalAccount, useWeb3Modal } from '@web3modal/ethers5/react';
import MessageList from './MessageList';
import UserList from './UserList';
import Head from 'next/head';
import FooterNavBar from './FooterNav';
import styles from "../styles/fanforum.module.css";
import dotenv from 'dotenv';
import { FaLocationArrow, FaMicrophone, FaMicrophoneSlash, FaPaperclip } from 'react-icons/fa6';
dotenv.config();


interface Message {
  user: string;
  content: string;
  pic: string;
  timestamp: Date;
  taggedUser?: string;
}

  
  interface User {
    walletaddress: string;
    pic: string;
  }

const FanForum: React.FC<{}> = () =>  {

  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); 
  const [showloading, setShowLoading] = useState<boolean>(false);
  const [showspinner, setShowSpinner] = useState<boolean>(false);
  const { connectedaddress } = useUser();
  const [text, setText] = useState('');
  const [pic, setPic] = useState('https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg');
  const [file, setFile] = useState<File | null>(null);
  const { theme } = useContext(ThemeContext);
  const [fileName, setFileName] = useState('');
  const [showAlertDanger, setShowAlertDanger] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { open } = useWeb3Modal();
  const interimTranscriptRef = useRef<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<any>("");

  const router = useRouter();
  

  const scrollToBottom = () => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  };

  const fetchMessages_ = async () => {
    if (socket && socket.connected) {
      socket.emit('getMessages');
    } else {
      // console.log('Socket is not connected or undefined');
      socket.once('connect', () => {
        socket.emit('getMessages');
      });
    }
  };


  const fetchMessages = async () => {
    const {data} = await axios.get('https://fifarewardbackend-1.onrender.com/api/chatforum/getmessages');
    const messages = data.messages;
    if(data.messages.length > 0) {
      await messages.forEach(async (msg:any) => {
      
        let message: Message = {
          user: msg.address,
          content: msg.message,
          pic: msg.pic,
          timestamp: msg.timestamp
        }
        // messages.push(message);
        // setMessages(messages);
        setMessages((prevMessages) => [...prevMessages, message]);
      })
      // Scroll to the bottom of the page when the component mounts
      // Use a timeout to ensure all content is rendered before scrolling
      const timeoutId = setTimeout(scrollToBottom, 1000);

      // Clean up the timeout if the component unmounts
      return () => clearTimeout(timeoutId);
    }
  };

  
  useEffect(() => {

    fetchMessages_();

    // socket.on('message', handleNewMessage);
    // socket.on('messages', handleMessages);
    
    fetchMessages();

    const fetchUsers = async () => {
        const {data} = await axios.get('https://fifarewardbackend-1.onrender.com/api/users/getusers');
        setUsers(data.data);
    };
    fetchUsers();

    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    if(!udetails) {
      open()
      setCurrentUser(connectedaddress)
    }else {
      setPic(udetails.pic);
      setCurrentUser(udetails.connectedaddress)
    }
    
    
    
    // Cleanup
    // return () => {
    //   socket.off('message', handleNewMessage);
    //   socket.off('messages', handleMessages);
    // };


  // Use a timeout to ensure all content is rendered before scrolling
  const timeoutId = setTimeout(scrollToBottom, 1000);

  // Clean up the timeout if the component unmounts
  return () => clearTimeout(timeoutId);
  },[])
  
  // const handleNewMessage = (message: Message) => {
  //     setMessages((prevMessages) => [...prevMessages, message]);
  // };

  // const handleMessages = async (messages: Message[]) => {
  //   console.log('Messages received --:', messages);
  //   await messages.forEach(async (message:any) => {
  //     let msg: Message = {
  //       user: message.address,
  //       pic: message.pic,
  //       content: message.message,
  //       timestamp: message.timestamp
  //     }
  //     messages.push(msg);
  //     setMessages(messages);
  //   })
  // };

  // const sendMessage = async (content: string) => {
  //   console.log("content string and data",content,pic,currentUser)
  //   if (currentUser) {
  //     const message: Message = {
  //       content,
  //       pic,
  //       user: currentUser,
  //       timestamp: new Date(),
  //     };

  //     // Emit the message and handle the acknowledgment
  //     socket.emit('sendMessage', message);

  //     setTimeout(fetchMessages, 3000);

  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      let taggedUser = '';
      const tagMatch = text.match(/@(\w+)/);
      if (tagMatch) {
          taggedUser = tagMatch[1];
      }

      if (file && file !== null) {
          const formData = new FormData();
          formData.append('file', file);

          try {
              setShowSpinner(true);
              const response = await axios.post('https://fifarewardbackend-1.onrender.com/api/upload', formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
              });

              const config = {
                  headers: {
                      "Content-type": "application/json"
                  }
              }  

              const content = response.data.url;
              const {data} = await axios.post('https://fifarewardbackend-1.onrender.com/api/chatforum/sendmessage', {
                  content,
                  pic,
                  user: currentUser,
                  taggedUser
              }, config);

              if(data.message) {
                  setShowSpinner(false);
                  fetchMessages();
              }
          } catch (error) {
              console.error('Error uploading file', error);
          }
      } else if(text && text !== '') {
          try {
              setShowSpinner(true);
              const config = {
                  headers: {
                      "Content-type": "application/json"
                  }
              }  
              const content = text;
              const {data} = await axios.post('https://fifarewardbackend-1.onrender.com/api/chatforum/sendmessage', {
                  content,
                  pic,
                  user: currentUser,
                  taggedUser
              }, config);

              if(data.message) {
                  setShowSpinner(false);
                  fetchMessages();
              }
          } catch (error) {
              console.log("err mes",error)
          }
      } else {
          setShowAlertDanger(true);
          setErrorMessage("Enter message or upload a file");
      }

      setText('');
      setFile(null);
      setFileName('');
  };



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
    
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    let talkdiv = document.getElementById("instructions") as HTMLDivElement;
        talkdiv.innerHTML = "I'm listening ...";
        talkdiv.style.color = 'orange';

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setText((prevText) => prevText + transcript);
        } else {
          interimTranscript += transcript;
        }
      }
      interimTranscriptRef.current = interimTranscript;
    };

    recognition.onend = () => {
      setIsListening(false);
      interimTranscriptRef.current = ''; // Reset interim transcript when recognition ends
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    let talkdiv = document.getElementById("instructions") as HTMLDivElement;
        talkdiv.innerHTML = "Click the microphone button to speak";
        talkdiv.style.color = 'white';
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const closeAlertModal = () => {
    setShowAlertDanger(false);
    setShowLoading(false);
  }

  return (
    <>
    <Head>
        <title>Group Chat Forum | FifaReward</title>
        <meta name='description' content='Share your opinion in Fifareward chat forum. FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
    </Head>
      <div className={`${styles.main} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`}>
      {showAlertDanger && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
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
                        <UserList users={users} />

                        {messages.length > 0 && <MessageList messages={messages} currentUser={currentUser} />}
                        
                        <div id="success-pop" aria-hidden="true" className={styles.div_overlay}>
                            <div className={styles.div_overlay_inna}>
                                {/* <span className={styles.pull_right}>{<FaXmark/>}</span> */}
                                <div id="kkkd">
                                    <Image src={successimage} alt='image' className={styles.mx_auto}/>
                                    <div className={styles.mx_auto}>Success</div>
                                </div>
                            </div>
                        </div>  

                    </div>
                    
                    <div className={styles.card_footer}>
                      
                        <form method="POST" onSubmit={handleSubmit} ref={formRef}>
                            <div className={styles.instructions} id="instructions">Click the microphone button to speak</div>
                            {showspinner && <Spinner />}
                            <div style={{fontSize: '12px',color: '#e28304',marginLeft: '15px'}}>{fileName && <span className={styles.fileName}>{fileName} selected</span>}</div>
                          <div className={styles.input_group}>
                            <input
                                hidden
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*,video/*"
                                ref={fileInputRef}
                            />
                            <span>{<FaPaperclip onClick={triggerFileInput} className={styles.fileIcon}/>} </span>
                            <textarea name="" id="message" className={`${styles.form_control} ${styles.type_msg}`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your message..."></textarea>
                            <div className={styles.text_mic_icons} >
                              <div><span className={styles.send_btn}><button type='submit'>{<FaLocationArrow size={22} style={{color:'#e3a204'}}/>}</button></span></div>
                              <div className={styles.voice_btn}><button className={styles.voice_btn_} onClick={isListening ? stopListening : startListening} type="button">{isListening ? <FaMicrophoneSlash size={22} color='#f1f1f1'/> : <FaMicrophone size={22} color='#f1f1f1'/> }</button></div>
                            </div>
                          </div>
                          
                      </form>
                      
                    </div>  
                </div>
              </div>
            </div>
          </div>
      </div>
      <FooterNavBar />
    </>
  );
}

export default FanForum