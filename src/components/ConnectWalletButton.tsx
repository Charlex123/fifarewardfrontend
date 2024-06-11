// // ConnectWalletButton.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";

// const ConnectWallet = () => {
//   const { disconnect } = useDisconnect();
//   const [badge, setBadge] = useState<string>("Bronze");
//   const [pic] = useState("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
//   const [sponsoraddress, setSponsorWalletAddress] = useState<string>("");  
//   const [issponsorinfluencer, setIsSponsorInfluencer] = useState<boolean>(false);
//   const { open } = useWeb3Modal();
//   const { address, isConnected } = useWeb3ModalAccount();
//   const [walletaddress, setWalletAddress] = useState<any>("");

//   useEffect(() => {
//     console.log("address eru",address)
//     if(isConnected) {
//       const updateUser = async () => {
//         try {
//           const config = {
//             headers: {
//               "Content-type": "application/json"
//             }
//           };
//           const response = await axios.post("https://fifarewardbackend-1.onrender.com/api/users/getuser/", { address }, config);
//           const data = response.data;
//           if(data.user != null) {
//             setBadge(data.user.badge);
//             setSponsorWalletAddress(data.user.sponsoraddress);
//             setWalletAddress(data.user.address);
//             setIsSponsorInfluencer(data.user.issponsorinfluencer);
//             localStorage.setItem("userInfo", JSON.stringify(data.user));
//           } else {
//             const response = await axios.post("https://fifarewardbackend-1.onrender.com/api/users/addupdateuser/", {
//               address,
//               isConnected,
//               sponsoraddress,
//               issponsorinfluencer,
//               badge,
//               pic
//             }, config);
//             const data = response.data;

//             if(data.message === "action success") {
//               localStorage.setItem("userInfo", JSON.stringify(data.user));
//             } else {
//               // Handle other responses
//             }
//           }
//         } catch (error) {
//           console.log(error);
//         }
//       };
//       updateUser();
//     } 
//   }, [address, isConnected]);

//   return (
//     <div style={{marginRight: '5px'}}><w3m-button size="sm" balance="hide" label="Connect & Login" /></div>
//   );
// };

// export default ConnectWallet;

export default function ConnectWallet() {
  const [badge, setBadge] = useState<string>("Bronze");
  const [pic] = useState("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
  const [sponsoraddress, setSponsorWalletAddress] = useState<string>("");  
  const [issponsorinfluencer, setIsSponsorInfluencer] = useState<boolean>(false);
  const { address, isConnected } = useWeb3ModalAccount();

  useEffect(() => {
    console.log("address eru",isConnected,address)
    if(isConnected) {
      const updateUser = async () => {
        try {
          const config = {
            headers: {
              "Content-type": "application/json"
            }
          };
          const response = await axios.post("https://fifarewardbackend-1.onrender.com/api/users/getuser/", { address }, config);
          const data = response.data;
          if(data.user != null) {
            setBadge(data.user.badge);
            setSponsorWalletAddress(data.user.sponsoraddress);
            setIsSponsorInfluencer(data.user.issponsorinfluencer);
            localStorage.setItem("userInfo", JSON.stringify(data.user));
          } else {
            const response = await axios.post("https://fifarewardbackend-1.onrender.com/api/users/addupdateuser/", {
              address,
              isConnected,
              sponsoraddress,
              issponsorinfluencer,
              badge,
              pic
            }, config);
            const data = response.data;

            if(data.message === "action success") {
              localStorage.setItem("userInfo", JSON.stringify(data.user));
            } else {
              // Handle other responses
            }
          }
        } catch (error) {
          console.log(error);
        }
      };
      updateUser();
    } 
  }, [address, isConnected]);
  return (<div style={{marginRight: '5px'}}><w3m-button size="sm" balance="hide" label="Connect & Login" /></div>)
}
