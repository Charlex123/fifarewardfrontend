import React from 'react';
import styles from '../styles/fanforum.module.css';

interface Message {
  user: string;
  pic: string;
  content: string;
  timestamp: Date;
  taggedUser?: string;
}

interface MessageListProps {
  messages: Message[];
  currentUser: string | null;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  return (
    <>
      <div className={styles.chat_convo}>
        {messages.map((message, index) => (
          <React.Fragment key={index}>
            {message.content && message.content !== '' && message.content !== null ? 
              <>
                {message.user === currentUser ?
                  <div className={`${styles.user_msg_cotainer_send}`}>
                    <div className={`${styles.text_left} ${styles.message}`}>
                      {
                        message.content.split("/").length > 2 ? 
                        <img src={message.content} alt='image' style={{width: '100%', height: '100%', maxHeight: '500px'}}/> :
                        <>{message.content}</>
                      }
                      {message.taggedUser && <span className={styles.tagged}>@{message.taggedUser}</span>}
                    </div>
                  </div>
                  :
                  <div className={`${styles.grpmembers_msg_cotainer_send}`}>
                    <img src={message.pic} alt='image' width={30} height={30} style={{width: '30px', height: '30px', borderRadius: '50%', marginRight: '5px'}}/>
                    <div className={`${styles.text_left} ${styles.message}`}>
                      {
                        message.content.split("/").length > 2 ? 
                        <img src={message.content} alt='image' style={{width: '100%', height: '100%', maxHeight: '500px'}}/> :
                        <>{message.content}</>
                      }
                      {message.taggedUser && <span className={styles.tagged}>@{message.taggedUser}</span>}
                    </div>
                  </div>
                }
              </> 
              : 
              <></>
            }  
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default MessageList;
