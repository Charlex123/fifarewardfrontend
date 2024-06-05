import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import axios from 'axios';

const UserComponent = () => {
    const router = useRouter();
    const [badge, setBadge] = useState<string>("Bronze");
    const [pic] = useState("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
    const [sponsoraddress, setSponsorWalletAddress] = useState<string>("");  
    const [issponsorinfluencer, setIsSponsorInfluencer] = useState<boolean>(false); // Initial value
    const { open } = useWeb3Modal();
    const { address, isConnected } = useWeb3ModalAccount();
  
    useEffect(() => {
        if(isConnected) {
            const updateUser = async () => {
                try {
                    const config = {
                        headers: {
                            "Content-type": "application/json"
                        }
                    };
                    const response = await axios.post("https://fifarewardbackend.onrender.com/api/users/getuser/", { address }, config);
                    const data = response.data;
                    if(data.user != null) {
                        setBadge(data.user.badge);
                        setSponsorWalletAddress(data.user.sponsoraddress);
                        setIsSponsorInfluencer(data.user.issponsorinfluencer);
                        localStorage.setItem("userInfo",JSON.stringify(data.user));
                    } else {
                        const response = await axios.post("https://fifarewardbackend.onrender.com/api/users/addupdateuser/", {
                            address,
                            sponsoraddress,
                            issponsorinfluencer,
                            badge,
                            pic
                        }, config);
                        const data = response.data;

                        if(data.message == "action success") {
                            localStorage.setItem("userInfo",JSON.stringify(data.user));
                        }else {

                        }
                        
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            updateUser();
        } else {
            // Function to open Web3Modal (assuming it's defined elsewhere in your code)
            open();
        }
    }, [address, isConnected, router]);

    return null;
};

export default UserComponent;
