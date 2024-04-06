import React from "react";
import styles from '../styles/bgoverlay.module.css';

type Props = {
    onChange: (newValue:boolean) => void
}

const BgOverlay:React.FC<Props> = ({onChange}) => {

    const closeBgModal = () => {
        onChange(false);
    }

    return (
        <>
            <div className={styles.bg_overlay} onClick={() => closeBgModal()}></div>
        </>
    )
}

export default BgOverlay;