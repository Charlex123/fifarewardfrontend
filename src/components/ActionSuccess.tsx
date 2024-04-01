import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import actionsuccessmodalstyles from '../styles/actionsuccessmodal.module.css'
import Helmet from 'react-helmet'

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
                <Helmet>
                    <title>Register | FifaReward </title>
                    <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends'/>
                </Helmet>
            <div className={actionsuccessmodalstyles.showactioncomp}>
                <div className={actionsuccessmodalstyles.showactioncompin}>
                    <div className={actionsuccessmodalstyles.closebtn}><button type='button' title='button'>{<FontAwesomeIcon icon={faXmark} onClick={(e) => closeActionModal()} />}</button></div>
                    <h3>{prop} was successfull</h3>
                    {/* <div className={actionsuccessmodalstyles.logbtn}>
                        <button type='button' title='button' onClick={(e) => showactionModal(e.target)}>Login {<FontAwesomeIcon icon={faRightFromBracket}/>}</button>
                    </div> */}
                </div>
            </div>
        </>
    )
}
export default ActionSuccessModal;