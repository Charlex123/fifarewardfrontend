import React from 'react';
import { useRouter } from 'next/router';
import loginsuccessmodalstyles from '../styles/loginsuccessmodal.module.css'
import { FaXmark } from 'react-icons/fa6';

interface Props {
    prop: string
}
const LogInSuccessModal:React.FC<Props> = ({prop}) => {

    const router = useRouter();
    // const [showlogin_modal,setShowlogin_Modal] = useState<boolean>(false);

    const closeLoginModal = (divId:any) => {
        let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
        if(hiw_bgoverlay) {
            hiw_bgoverlay.style.display = 'none';
            let loginSuccModal = document.querySelector('#loginsuccessmodal') as HTMLElement;
            loginSuccModal.style.display = 'none';
            router.reload();
        }else {
            let loginSuccModal = document.querySelector('#loginsuccessmodal') as HTMLElement;
            loginSuccModal.style.display = 'none';
            router.reload();
        }
        
    }

    // const showLoginModal = (divId:any) => {
    //     console.log('show logged iooo');
    //     setShowlogin_Modal(true);
    //     let svg = divId.getAttribute('data-icon');
    //     let path = divId.getAttribute('fill');
    //     if((svg !== null && svg !== undefined) || (path !== null && path !== undefined)) {
    //         if(svg !== null && svg !== undefined) {
    //             divId.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    //         }
    //         if(path !== null && path !== undefined) {
    //             divId.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
    //         }
    //     }else {
    //         divId.parentElement.parentElement.parentElement.style.display = 'none';
    //     }
    // }

    return(
        <>
            <div className={loginsuccessmodalstyles.showlogincomp} id="loginsuccessmodal">
                <div className={loginsuccessmodalstyles.showlogincompin}>
                    <div className={loginsuccessmodalstyles.closebtn}><button type='button' title='button'>{<FaXmark onClick={(e) => closeLoginModal(e.target)} />}</button></div>
                    <p>Login was successfull, {prop}</p>
                    {/* <div className={loginsuccessmodalstyles.logbtn}>
                        <button type='button' title='button' onClick={(e) => showLoginModal(e.target)}>Login {<FaRightFromBracket/>}</button>
                    </div> */}
                </div>
            </div>
        </>
    )
}
export default LogInSuccessModal;