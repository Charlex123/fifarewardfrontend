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
        <div className={styles.chat_convo} >
            {messages.map((message, index) => (
            <>
              {message.content && message.content !== '' && message.content !== null ? 
                  <div key={index} className={`${message.user === currentUser ? styles.user_msg_cotainer_send : styles.grpmembers_msg_cotainer_send}`}>
                    <div className={`${styles.text_left} ${styles.message}`}>
                    {
                      message.content.split("/").length > 2 ? 
                      <><img src={message.content} alt='image' style={{width: '100%', height: '100%', maxHeight: '500px'}}/></> :
                      <>{message.content}</>
                    }
                    </div>
                  </div> : 
                  <></>
                }  
            </> 
                    
            ))}
          </div>
      </>
    
  );
};


export default MessageList;
