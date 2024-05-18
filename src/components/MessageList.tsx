import React from 'react';
import styles from '../styles/chatforum.module.css';

interface Message {
  user: string;
  text: string;
  timestamp: Date;
  file?: any;
}

interface MessageListProps {
  messages: Message[];
  currentUser: string | null;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  return (
    <div className={styles.messageList}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`${styles.message} ${message.user === currentUser ? styles.currentUser : styles.otherUser}`}
        >
          <strong>{message.user}</strong>: {message.text}
          {message.file && (
            <>
              {message.file.contentType.startsWith('image/') && (
                <img src={`http://localhost:3001/api/files/${message.file.filename}`} alt="uploaded file" />
              )}
              {message.file.contentType.startsWith('video/') && (
                <video controls>
                  <source src={`http://localhost:3001/api/files/${message.file.filename}`} type={message.file.contentType} />
                  Your browser does not support the video tag.
                </video>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};


export default MessageList;
