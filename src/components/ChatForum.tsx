import React, { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import chatbotlogo from '../assets/images/aichatbot.png';
import successimage from '../assets/images/success1.png';
import { ThemeContext } from '../contexts/theme-context';
import socket from './Socket';
import AlertDanger from './AlertDanger';
import axios from 'axios';
import { useWeb3ModalAccount, useWeb3Modal } from '@web3modal/ethers5/react';
import MessageList from '../components/MessageList';
import UserList from '../components/UserList';
import Head from 'next/head';
import styles from "../styles/chatforum.module.css";
import dotenv from 'dotenv';
import { FaLocationArrow, FaMicrophone, FaMicrophoneSlash, FaPaperclip } from 'react-icons/fa6';
dotenv.config();


interface Message {
    user: string;
    content: string;
    pic: string;
    timestamp: Date;
  }
  
  interface User {
    walletaddress: string;
    pic: string;
  }

const ChatForum: React.FC<{}> = () =>  {

  const fileInputRef = useRef<HTMLInputElement | null>(null);   
  const [showloading, setShowLoading] = useState<boolean>(false);
  const [text, setText] = useState('');
  const [pic, setPic] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { theme } = useContext(ThemeContext);
  const [fileName, setFileName] = useState('');
  const [showAlertDanger, setShowAlertDanger] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { open } = useWeb3Modal();
  const { isConnected, address } = useWeb3ModalAccount();
  const interimTranscriptRef = useRef<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<any>("");

  const router = useRouter();
  
  const fetchMessages = async () => {
    if (socket && socket.connected) {
      socket.emit('getMessages');
    } else {
      console.log('Socket is not connected or undefined');
      socket.once('connect', () => {
        socket.emit('getMessages');
      });
    }
  };

  
  useEffect(() => {

    fetchMessages();

    socket.on('message', handleNewMessage);
    socket.on('messages', handleMessages);

    const fetchUsers = async () => {
        const {data} = await axios.get('https://fifarewardbackend.onrender.com/api/users/getusers');
        setUsers(data.data);
    };
    fetchUsers();

    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    
    if(isConnected) {  
      if(udetails) {
        setPic(udetails.pic);
        
      }
      setCurrentUser(address);
    }else {
      // open()
    }
    
    
    // Cleanup
    return () => {
      socket.off('message', handleNewMessage);
      socket.off('messages', handleMessages);
    };


  },[])
  
  const handleNewMessage = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleMessages = async (messages: Message[]) => {
    console.log('Messages received --:', messages);
    await messages.forEach(async (message:any) => {
      let msg: Message = {
        user: message.address,
        pic: message.pic,
        content: message.message,
        timestamp: message.timestamp
      }
      messages.push(msg);
      setMessages(messages);
    })
  };

  const sendMessage = async (content: string) => {
    console.log("content string and data",content,pic,currentUser)
    if (currentUser) {
      const message: Message = {
        content,
        pic,
        user: currentUser,
        timestamp: new Date(),
      };
      console.log("message sent to the server")
      socket.emit('sendMessage', message);  // Send the message to the server
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("huo clicked",text);

    if (file && file !== null) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('https://fifarewardbackend.onrender.com/uploadforumfile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

       
        const content = response.data.fullUrl;
        console.log("res pom",response.data.fullUrl)
        // const {data} = await axios.post('https://fifarewardbackend.onrender.com/api/chatforum/sendmessage', {
        //     userId,
        //     currentUser,
        //     content
        // }, config);
        // if(data) {
        //     console.log("success",data)
        //     // setActionSuccess(true);
        //     // setActionSuccessMessage("Profile upload ")
        // }
        sendMessage(content);
      } catch (error) {
        console.error('Error uploading file', error);
      }
    } else if(text && text !== ''){
        try {
            // const config = {
            //     headers: {
            //         "Content-type": "application/json"
            //     }
            // }  
            // const content = text;
            // const {data} = await axios.post('http://localhost:9000/api/chatforum/sendmessage', {
            //     address,
            //     pic,
            //     currentUser,
            //     content
            // }, config);
            // if(data) {
            //     // socket.emit('sendMessage', message);
            //     // setActionSuccess(true);
            //     // setActionSuccessMessage("Profile upload ")
            // }
            console.log("here text nmessagse",text);
            sendMessage(text);
        } catch (error) {
            console.log("err mes",error)
        }
    }else {
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

                        <MessageList messages={messages} currentUser={currentUser} />

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
                        <form method="POST" onSubmit={handleSubmit}>
                            <div className={styles.instructions} id="instructions">Click the microphone button to speak</div>
                            <div>{fileName && <span className={styles.fileName}>{fileName} selected</span>}</div>
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
                            <div className={styles.text_mic_icons}>
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
    </>
  );
}

export default ChatForum