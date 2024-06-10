import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import axios from 'axios';

interface UserContextProps {
  badge: string;
  pic: string;
  sponsoraddress: string;
  issponsorinfluencer: boolean;
  connectedaddress: string | null;
  loading: boolean; // Add loading state
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [badge, setBadge] = useState<string>("Bronze");
  const [pic, setPic] = useState("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
  const [sponsoraddress, setSponsorWalletAddress] = useState<string>("");
  const [connectedaddress, setConnectedAddress] = useState<string>("");
  const [issponsorinfluencer, setIsSponsorInfluencer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Initialize loading state
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();

  useEffect(() => {
    const updateUser = async () => {
      console.log("is connected 0-",isConnected,address)
      if (isConnected) {
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
            setConnectedAddress(data.user.address);
            setPic(data.user.pic);
            console.log("user d 1",data.user)
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

            if (data.message === "action success") {
              setBadge(data.user.badge);
              setSponsorWalletAddress(data.user.sponsoraddress);
              setIsSponsorInfluencer(data.user.issponsorinfluencer);
              setConnectedAddress(data.user.address);
              setPic(data.user.pic);
              console.log("user d 2",data.user)
              localStorage.setItem("userInfo", JSON.stringify(data.user));
            } else {
              console.error('Failed to update user');
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false); // Set loading to false after data is fetched
        }
      } else {
        open();
        setLoading(false); // Set loading to false if the user is not connected
      }
    };

    updateUser();
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
