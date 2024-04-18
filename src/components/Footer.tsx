import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import footerstyles from '../styles/footer.module.css';
import FooterNavBar from './FooterNav';
// import cgk from '../assets/images/coingecko-aace8f3c.png';
// import cmc from '../assets/images/coinmarketcap-a91aaec1.png';
import { fas, faCheck, faCheckCircle, faCircleDollarToSlot, faGift, faPeopleGroup, faHamburger} from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFontAwesome, faGoogle, faTelegram, faMedium, faArtstation, faBandcamp, faGalacticSenate, faDiscord } from '@fortawesome/free-brands-svg-icons'
import { faSoccerBall } from '@fortawesome/free-regular-svg-icons';
library.add(fas, faTwitter, faFontAwesome, faGoogle, faCheck,faCheckCircle, faCircleDollarToSlot, faGift, faPeopleGroup)

const Footer = () => {
   const [contractAddress, setcontractAddress] = useState('0x6fe537b0ba874eab212bb8321ad17cf6bb3a0afc');
   const [buttonText, setButtonText] = useState("Copy");

const handleCopyClick = () => {
   // Create a temporary textarea element
   const textArea = document.createElement('textarea');
   
   // Set the value of the textarea to the text you want to copy
   textArea.value = contractAddress;

   // Append the textarea to the document
   document.body.appendChild(textArea);

   // Select the text inside the textarea
   textArea.select();

   // Execute the copy command
   document.execCommand('copy');

   // Remove the temporary textarea
   document.body.removeChild(textArea);

   // Set the state to indicate that the text has been copied
   setButtonText("Copied");

   // Reset the state after a brief period (optional)
   setTimeout(() => {
      setButtonText("Copy");
   }, 1500);
 };
   
   return (
      <div className={footerstyles.footer}>
         <div className={footerstyles.footermain}>
            
            <div className={footerstyles.footermain_in}>
               <div className={footerstyles.footer_c1}>
                  <h3>Socials</h3>
                  <div className={footerstyles.f_c}>
                     <div>
                        <a href='https://twitter.com/@FRD_Labs' rel='noopener noreferrer' ><FontAwesomeIcon icon={faTwitter} size='sm' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Twitter</span></a>
                     </div>
                     <div><a href='https://www.dextools.io/app/en/bnb/pair-explorer/0xfbe158e077e17c2c603f505d1a4d11f2a605ffa1?t=1712569347593' rel='noopener noreferrer' ><FontAwesomeIcon icon={faBandcamp} size='sm' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>DexTools</span></a></div>
                     <div>
                        <a href='https://t.me/FifarewardLabs' rel='noopener noreferrer' ><FontAwesomeIcon icon={faTelegram} size='sm' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Telegram</span></a>
                     </div>
                     <div>
                        <a href='https://www.geckoterminal.com/bsc/pools/0xfbe158e077e17c2c603f505d1a4d11f2a605ffa1' rel='noopener noreferrer' ><FontAwesomeIcon icon={faBandcamp} size='sm' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Coin Gecko</span></a>
                     </div>
                     <div><a href='https://discord.com/invite/DC5Ta8bb' rel='noopener noreferrer' ><FontAwesomeIcon icon={faDiscord} size='sm' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Discord</span></a> </div>
                     {/* <div><a href='/' rel='noopener noreferrer' ><FontAwesomeIcon icon={faMedium} size='sm' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Medium</span></a> </div>*/}
                     {/* <div><a href='/' rel='noopener noreferrer' ><FontAwesomeIcon icon={faYoutube} size='sm' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>YouTube</span></a> </div> */}
                  </div>
               </div>

               <div className={footerstyles.footer_c2}>
                  <h3>Features</h3>
                  <div className={footerstyles.f_c}>
                     <div>
                        <a href='/mining' rel='noopener noreferrer' ><FontAwesomeIcon icon={faHamburger} size='sm' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Mine</span></a>
                     </div>
                     <div>
                        <a href='/nft' rel='noopener noreferrer' ><FontAwesomeIcon icon={faArtstation} size='sm' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>NFT MarketPlace</span></a>
                     </div>
                     <div>
                        <a href='/stake' rel='noopener noreferrer' ><FontAwesomeIcon icon={faCircleDollarToSlot} size='sm' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Stake</span></a>
                     </div>
                     <div>
                        <a href='/bet' rel='noopener noreferrer' ><FontAwesomeIcon icon={faSoccerBall} size='sm' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Betting</span></a>
                     </div>
                     <div>
                        <a href='/airdrop' rel='noopener noreferrer' ><FontAwesomeIcon icon={faGift} size='sm' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>AirDrop</span></a>
                     </div>
                     <div>
                        <a href='/gaming' rel='noopener noreferrer' ><FontAwesomeIcon icon={faGalacticSenate} size='sm' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Gaming</span></a>
                     </div>
                  </div>
               </div>
            </div>

            <div className={footerstyles.footer_c3}>
               <h3>FRD Contract</h3>
               <div className={footerstyles.f_c}>
                  <div><span>Contract Address:</span></div>
                  <div><input title='input' type='text' value={contractAddress} onChange={(e) => setcontractAddress(e.target.value)}/> <button type='button' onClick={handleCopyClick}>{buttonText}</button></div>
                  <div className={footerstyles.buylinkp}><a href='https://pancakeswap.finance/swap?outputCurrency=0x6fe537b0ba874eab212bb8321ad17cf6bb3a0afc' className={footerstyles.buylink} rel='noopener noreferrer'>BUY FRD</a></div>
               </div>
            </div>
         </div>
         <div><div className={footerstyles.footam}>FIFAREWARD | ©2023 <br></br></div></div>
         <FooterNavBar/>
      </div>
   )
   }

export default Footer