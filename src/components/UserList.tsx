import React from 'react';
import styles from '../styles/userlist.module.css';

interface User {
  walletaddress: string;
  pic: string;
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  
  return (
    <div className={styles.userslist_main}>
      <h3>Users Online <span className={styles.online_icon}></span></h3>
      <ul>
      {users.slice(0, 6).map((user, index) => (
          <li key={index} className={styles.users}>
            <img src={`${user.pic}`} alt={`${user.walletaddress}'s profile`} className={styles.profilePic} />
          </li>
        ))}
        {users.length > 3 && (
          <li className={styles.users}>
            <span className={styles.usersremaining}>+{users.length - 6} more</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default UserList;
