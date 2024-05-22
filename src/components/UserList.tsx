import React from 'react';
import styles from '../styles/userlist.module.css';

interface User {
  username: string;
  profilePic: string;
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div>
      <h3>Users Online</h3>
      <ul>
      {users.map((user, index) => (
          <li key={index} className={styles.users}>
            <img src={`http://localhost:9000/api/files/${user.profilePic}`} alt={`${user.username}'s profile`} className={styles.profilePic} />
            <span>{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
