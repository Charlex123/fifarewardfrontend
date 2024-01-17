import {useEffect} from 'react'
import { useRouter } from 'next/router';

const Logout = () => {

    const router = useRouter();

    useEffect(() => {
        localStorage.clear(); // Clear local storage
        router.back();
    })
  };
  
  export default Logout;