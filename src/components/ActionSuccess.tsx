import React from 'react';
import actionsuccessmodalstyles from '../styles/actionsuccessmodal.module.css'
import Head from 'next/head'
import { FaXmark } from 'react-icons/fa6';

type Props = {
    prop: string,
    onChange: (newValue:boolean) => void
}
const ActionSuccessModal:React.FC<Props> = ({prop,onChange}) => {

    const closeActionModal = () => {
        onChange(false);
    }

    // const showactionModal = (divId:any) => {
    //     console.log('show logged iooo');
    //     setshowaction_Modal(true);
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
                <Head>
                    <title>Action Success | FifaReward </title>
                    <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends'/>
                </Head>
            <div className={actionsuccessmodalstyles.showactioncomp}>
                <div className={actionsuccessmodalstyles.showactioncompin}>
                    <div className={actionsuccessmodalstyles.closebtn}><button type='button' title='button'>{<FaXmark onClick={(e) => closeActionModal()} />}</button></div>
                    <h3>{prop} was successful</h3>
                    {/* <div className={actionsuccessmodalstyles.logbtn}>
                        <button type='button' title='button' onClick={(e) => showactionModal(e.target)}>Login {<FontAwesomeIcon icon={faRightFromBracket}/>}</button>
                    </div> */}
                </div>
            </div>
        </>
    )
}
export default ActionSuccessModal;