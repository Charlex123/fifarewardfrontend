import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import axios from 'axios';

interface UserContextProps {
  badge: string;
  pic: string;
  sponsoraddress: string;
  issponsorinfluencer: boolean;
  connectedaddress: string | null;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [badge, setBadge] = useState<string>("Bronze");
  const [pic] = useState("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
  const [sponsoraddress, setSponsorWalletAddress] = useState<string>("");
  const [connectedaddress, setConnectedAddress] = useState<string>("");
  const [issponsorinfluencer, setIsSponsorInfluencer] = useState<boolean>(false);
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();

  useEffect(() => {
    if (isConnected) {
      const updateUser = async () => {
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const response = await axios.post("https://fifarewardbackend.onrender.com/api/users/getuser/", { address }, config);
          const data = response.data;
          if (data.user != null) {
            setBadge(data.user.badge);
            setSponsorWalletAddress(data.user.sponsoraddress);
            setIsSponsorInfluencer(data.user.issponsorinfluencer);
            localStorage.setItem("userInfo", JSON.stringify(data.user));
          } else {
            const response = await axios.post("https://fifarewardbackend.onrender.com/api/users/addupdateuser/", {
              address,
              isConnected,
              sponsoraddress,
              issponsorinfluencer,
              badge,
              pic,
            }, config);
            const data = response.data;

            if (data.message == "action success") {
              localStorage.setItem("userInfo", JSON.stringify(data.user));
            } else {
              console.error('Failed to update user');
            }
          }
        } catch (error) {
          console.log(error);
        }
      };
      updateUser();
    } else {
      open();
    }
  }, [address, isConnected]);

  return (
    <UserContext.Provider value={{ badge, pic, sponsoraddress, issponsorinfluencer, connectedaddress }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
