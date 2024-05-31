import React from 'react';
import styles from '../styles/userlist.module.css';

interface User {
  username: string;
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
      {users.map((user, index) => (
          <li key={index} className={styles.users}>
            <img src={`${user.pic}`} alt={`${user.username}'s profile`} className={styles.profilePic} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
