import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import footerstyles from '../styles/footer.module.css'
// import cgk from '../assets/images/coingecko-aace8f3c.png';
// import cmc from '../assets/images/coinmarketcap-a91aaec1.png';
import { fas, faCheck, faCheckCircle, faCircleDollarToSlot, faGift, faPeopleGroup} from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFontAwesome, faGoogle,faDiscord, faFacebook, faTelegram, faMedium, faYoutube, faBandcamp } from '@fortawesome/free-brands-svg-icons'
library.add(fas, faTwitter, faFontAwesome, faGoogle, faCheck,faCheckCircle, faCircleDollarToSlot, faGift, faPeopleGroup)

const Footer = () => {
   const [contractAddress, setcontractAddress] = useState('0x5ae155F89308CA9050f8Ce1C96741BaDd342C26B');
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
                  <h3>Social</h3>
                  <div className={footerstyles.f_c}>
                     <div>
                        <a href='https://twitter.com' rel='noopener noreferrer' ><FontAwesomeIcon icon={faTwitter} size='lg' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Twitter</span></a>
                     </div>
                     {/* <div><a href='/' rel='noopener noreferrer' ><FontAwesomeIcon icon={faFacebook} size='lg' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Facebook</span></a></div> */}
                     <div>
                        <a href='https://t.me/tafaxtraweb' rel='noopener noreferrer' ><FontAwesomeIcon icon={faTelegram} size='lg' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Telegram</span></a>
                     </div>
                     <div>
                        <a href='https://www.geckoterminal.com/bsc/pools/0x7c0406a570ca1407c412238c173898cd145fd52e' rel='noopener noreferrer' ><FontAwesomeIcon icon={faBandcamp} size='lg' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Coin Gecko</span></a>
                     </div>
                     {/* <div><a href='/' rel='noopener noreferrer' ><FontAwesomeIcon icon={faDiscord} size='lg' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Discord</span></a> </div> */}
                     {/* <div><a href='/' rel='noopener noreferrer' ><FontAwesomeIcon icon={faMedium} size='lg' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Medium</span></a> </div>*/}
                     {/* <div><a href='/' rel='noopener noreferrer' ><FontAwesomeIcon icon={faYoutube} size='lg' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>YouTube</span></a> </div> */}
                  </div>
               </div>

               <div className={footerstyles.footer_c2}>
                  <h3>Feature</h3>
                  <div className={footerstyles.f_c}>
                     <div>
                        <a href='/#tafastaking' rel='noopener noreferrer' ><FontAwesomeIcon icon={faCircleDollarToSlot} size='lg' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Staking Rewards</span></a>
                     </div>
                     <div>
                        <a href='/#freeclaim' rel='noopener noreferrer' ><FontAwesomeIcon icon={faGift} size='lg' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>TafaXtra Free Claim</span></a>
                     </div>
                     <div>
                        <a href='/#referrals' rel='noopener noreferrer' ><FontAwesomeIcon icon={faPeopleGroup} size='lg' className={footerstyles.navdrbdwnbrandicon}/> <span className={footerstyles.brnd}>Referral</span></a>
                     </div>
                  </div>
               </div>
            </div>

            <div className={footerstyles.footer_c3}>
               <h3>TAFXTRA Contract</h3>
               <div className={footerstyles.f_c}>
                  <div><span>Contract Address:</span></div>
                  <div><input type='text' value={contractAddress} onChange={(e) => setcontractAddress(e.target.value)}/> <button type='button' onClick={handleCopyClick}>{buttonText}</button></div>
                  <div className={footerstyles.buylinkp}><a href='https://pancakeswap.finance/swap?outputCurrency=0x5ae155F89308CA9050f8Ce1C96741BaDd342C26B' className={footerstyles.buylink} rel='noopener noreferrer'>BUY TAFA</a></div>
               </div>
            </div>
         </div>
         <div><div className={footerstyles.footam}>TAFAXTRA | ©2023 <br></br></div></div>
      </div>
   )
   }

export default Footer