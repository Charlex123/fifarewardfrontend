import React, { useEffect } from 'react';
import styles from '../styles/chatforum.module.css';
import Image from 'next/image';

interface Message {
  user: string;
  pic: string;
  content: string;
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  currentUser: string | null;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  
  useEffect(() => {
    console.log(" messages === ooop",messages,currentUser)
  },[])

  return (
      <>
        
                  {messages.map((message, index) => (
                      <div key={index} className={styles.chat_convo} >
                          {message.user === currentUser ? 
                          <div>
                            {message.content && message.content !== '' && message.content !== null ? 
                              <div className={styles.user_msg_cotainer_send}>
                                <div className={`${styles.text_left} ${styles.message}`}>
                                {
                                  message.content.split("/").length > 2 ? 
                                  <><Image src={message.content} alt='image' width={100} height={100} style={{width: '100px', height: '100px'}}/></> :
                                  <>{message.content}</>
                                }
                                </div>
                              </div> : 
                              <></>
                            }
                          </div> :
                          <div>
                            {message.content && message.content !== '' && message.content !== null ? 
                              <div className={styles.grpmembers_msg_cotainer_send}>
                                <div className={`${styles.text_left} ${styles.message}`}>
                                {
                                  message.content.split("/").length > 2 ? 
                                  <><Image src={message.content} alt='image' width={100} height={100} style={{width: '100px', height: '100px'}}/></> :
                                  <>{message.content}</>
                                }
                                </div>
                              </div> : 
                              <></>
                            }
                          </div>  
                        }
                      </div>
                  ))}

      </>
    
  );
};


export default MessageList;
