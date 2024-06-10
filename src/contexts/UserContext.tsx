import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import axios from 'axios';

interface UserContextProps {
  badge: string;
  pic: string;
  sponsoraddress: string;
  issponsorinfluencer: boolean;
  connectedaddress: string | null;
  loading: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [badge, setBadge] = useState<string>("Bronze");
  const [pic, setPic] = useState("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
  const [sponsoraddress, setSponsorWalletAddress] = useState<string>("");
  const [connectedaddress, setConnectedAddress] = useState<string>("");
  const [issponsorinfluencer, setIsSponsorInfluencer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();

  useEffect(() => {
    console.log(" huiop",isConnected, address)
    const fetchUserData = async () => {
      if (!isConnected) {
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        const response = await axios.post("https://fifarewardbackend.onrender.com/api/users/getuser/", { address }, config);
        const data = response.data;
        if (data.user) {
          setBadge(data.user.badge);
          setSponsorWalletAddress(data.user.sponsoraddress);
          setIsSponsorInfluencer(data.user.issponsorinfluencer);
          setConnectedAddress(data.user.address);
          setPic(data.user.pic);
          localStorage.setItem("userInfo", JSON.stringify(data.user));
        } else {
          const newUserResponse = await axios.post("https://fifarewardbackend.onrender.com/api/users/addupdateuser/", {
            address,
            isConnected,
            sponsoraddress,
            issponsorinfluencer,
            badge,
            pic,
          }, config);
          const newUser = newUserResponse.data.user;
          setBadge(newUser.badge);
          setSponsorWalletAddress(newUser.sponsoraddress);
          setIsSponsorInfluencer(newUser.issponsorinfluencer);
          setConnectedAddress(newUser.address);
          setPic(newUser.pic);
          localStorage.setItem("userInfo", JSON.stringify(newUser));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (isConnected) {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        setBadge(parsedUserInfo.badge);
        setSponsorWalletAddress(parsedUserInfo.sponsoraddress);
        setIsSponsorInfluencer(parsedUserInfo.issponsorinfluencer);
        setConnectedAddress(parsedUserInfo.address);
        setPic(parsedUserInfo.pic);
        setLoading(false);
      } else {
        fetchUserData();
      }
    } else {
      setLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (!isConnected) {
      open();
    }
  }, [isConnected, open]);

  return (
    <UserContext.Provider value={{ badge, pic, sponsoraddress, issponsorinfluencer, connectedaddress, loading }}>
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
