import React, {useEffect, useState} from 'react';
import styles from '../styles/footernav.module.css';
import ConnectWallet from './ConnectWalletButton';
import { IoIosFootball, IoIosHome } from 'react-icons/io';
import { FaArtstation, FaGaugeHigh } from 'react-icons/fa6';
import { GiGamepad } from 'react-icons/gi';

function FooterNavBar() {
    const [isMobile, setIsMobile] = useState(true);
    useEffect(() => {
        if(window.innerWidth < 567) {
            setIsMobile(true)
        }else {
            setIsMobile(false);
        }

    },[])

    return (
        <>
            <nav className={styles.footernav}>
                {isMobile ? 
                <>
                    <div className={styles.con}><div><ConnectWallet /></div></div>
                    <div className={styles.nav_container}>
                        <div className={styles.linka}>
                            <a href='/' rel='noopener noreferrer'> <div className={styles.tc}>{<IoIosHome />}</div>Home</a>
                        </div>
                        <div className={styles.linka}>
                            <a href='/dapp' rel='noopener noreferrer'> <div className={styles.tc}>{<FaGaugeHigh />}</div>Dapp</a>
                        </div>
                        <div className={styles.linka}>
                            <a href='/nft/createnft' rel='noopener noreferrer'> <div className={styles.tc}>{<FaArtstation />}</div>NFT</a>
                        </div>
                        {/* <div className={styles.linka}>
                            <a href='/aichat' rel='noopener noreferrer'> <div className={styles.tc}>{<FaMessage />}</div> AI Q&A </a>
                        </div> */}
                        <div className={styles.linka}>
                            <a href='/betting' rel='noopener noreferrer'> <div className={styles.tc}>{<IoIosFootball />}</div> Betting </a>
                        </div>
                        <div className={styles.linka}>
                            <a href='/gaming' rel='noopener noreferrer'> <div className={styles.tc}>{<GiGamepad />}</div> Gaming </a>
                        </div>
                    </div>
                </> :
                <>
                    <div className={styles.nav_container}>
                        <div className={styles.linka}>
                            <a href='/' rel='noopener noreferrer'> <div className={styles.tc}>{<IoIosHome />}</div>Home</a>
                        </div>
                        <div className={styles.linka}>
                            <a href='/dapp' rel='noopener noreferrer'> <div className={styles.tc}>{<FaGaugeHigh />}</div>Dapp</a>
                        </div>
                        <div className={styles.linka}>
                            <a href='/nft/createnft' rel='noopener noreferrer'> <div className={styles.tc}>{<FaArtstation />}</div>NFT</a>
                        </div>
                        {/* <div className={styles.linka}>
                            <a href='/aichat' rel='noopener noreferrer'> <div className={styles.tc}>{<FaMessage />}</div> AI Q&A </a>
                        </div> */}
                        <div className={styles.linka}>
                            <a href='/betting' rel='noopener noreferrer'> <div className={styles.tc}>{<IoIosFootball />}</div> Betting </a>
                        </div>
                        <div className={styles.linka}>
                            <a href='/gaming' rel='noopener noreferrer'> <div className={styles.tc}>{<GiGamepad />}</div> Gaming </a>
                        </div>
                        <ConnectWallet />
                    </div>
                </>     
                }
            </nav>
        </>
    );
}

export default FooterNavBar;
