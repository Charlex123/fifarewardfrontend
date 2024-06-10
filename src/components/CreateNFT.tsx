import { useEffect, useState, useContext } from 'react'
// import Image from 'next/image'
import { NFTStorage, File } from 'nft.storage'
import { useRouter } from 'next/router';
import AlertDanger from './AlertDanger';
import Loading from './Loading';
import { useUser } from '../contexts/UserContext';
import BgOverlay from './BgOverlay';
import ActionSuccessModal from './ActionSuccess';
import NFTMarketPlace from '../../artifacts/contracts/FRDNFTMarketPlace.sol/FRDNFTMarketPlace.json';
import FifaRewardToken from '../../artifacts/contracts/FifaRewardToken.sol/FifaRewardToken.json';
import { ethers } from 'ethers';
import DragDropImageUpload from './DragDropImageUpload';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useDisconnect } from '@web3modal/ethers5/react';
import { ThemeContext } from '../contexts/theme-context';
import Head from 'next/head';
import styles from '../styles/createnft.module.css'
import { FaXmark } from 'react-icons/fa6';
const dotenv = require("dotenv");

dotenv.config();

export default function CreateItem() {
  
  const nftStorageApiKey = process.env.NEXT_PUBLIC_NFT_STOARAGE_API_KEY || '';
  const nftcontractAddress = process.env.NEXT_PUBLIC_NFTMARKETPLACE_CA;

  const frdcontractAddress = process.env.NEXT_PUBLIC_FRD_DEPLOYED_CA;
  const { theme } = useContext(ThemeContext);
  const [betactionsuccess,setActionSuccess] = useState<boolean>(false);

  const { connectedaddress } = useUser();

  const [uploadedMedia, setUploadedMedia] = useState<any>(null);
  const [showloading, setShowLoading] = useState<boolean>(false);
  const { open } = useWeb3Modal();
  const [openaddTraits, setOpenAddTraits] = useState<boolean>(false);
  const [showtrait, setshowTraits] = useState<boolean>(false);
  const { walletProvider } = useWeb3ModalProvider();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();
  const [username, setUsername] = useState<string>("");
  const [showAlertDanger,setShowAlertDanger] = useState<boolean>(false);
  const [errorMessage,seterrorMessage] = useState<string>("");
  const [showBgOverlay,setShowBgOverlay] = useState<boolean>(false);
  const [addtraitCount, setaddtraitCount] = useState<number>(1);
  const client = new NFTStorage({ token: nftStorageApiKey });
  const [formInput, updateFormInput] = useState({ price: '1', name: '', description: '' });
  const router = useRouter();
  const [addTraitDiv,setaddTraitDiv] = useState<JSX.Element[]>([]);
  const [traitName,setTraitName] = useState<string>("");
  const [traitValue,setTraitValue] = useState<string>("");
  const Traits:any[] = [];
  
  useEffect(() => {
    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
      
    
  },[])

  async function handleFileUpload(file: File) {
      console.log('File to upload:', file);
      setUploadedMedia(file)
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !uploadedMedia) return
    /* first, upload to IPFS */
    const nft = {
      name:name, description:description, image: uploadedMedia, traits: Traits
    }
    try {
      const Token = await client.store(nft)
      console.log('uplo media',uploadedMedia)
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      createNFT(Token.url)
      
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }


  async function handleCreateNFT() {
    setShowBgOverlay(true);
    setShowLoading(true);

    if(!isConnected) {
      open()
      setShowBgOverlay(false);
      setShowLoading(false);
    }else {
      // uploadToIPFS();
      // check if user wallet address has FRD
      if(formInput.description === "" || formInput.name === "" || uploadedMedia === null || uploadedMedia  === "") {
        setShowAlertDanger(true);
        seterrorMessage("NFT art image, description and name are required!!");
        setShowLoading(false);
      }else {
        try {
          const provider = new ethers.providers.Web3Provider(walletProvider as any);
          const signer = provider.getSigner();

          console.log('signer address',signer,signer.getAddress(),signer._address,address)
          /* next, create the item */
          let contract = new ethers.Contract(frdcontractAddress!, FifaRewardToken, signer.connectUnchecked());
          let transaction = await contract.balanceOf(connectedaddress);
          let frdBal = ethers.utils.formatEther(transaction);
          if(parseInt(frdBal) < 500) {
            setShowAlertDanger(true);
            seterrorMessage("You need a minimum of 500FRD (FifaRewardToken) to proceed!  ")
            setShowLoading(false);
            
          }else {
            console.log("upload Ipfs ran")
            uploadToIPFS()
          }
          // setShowLoading(false);
          // setShowBgOverlay(false);
          // router.push('../nft/mynfts')
        } catch (error) {
          setShowAlertDanger(true);
          seterrorMessage(`transaction cancelled /${error}`);
          setShowLoading(false)
        }
      }
    }
  }

  async function createNFT(fileUrl:any) {
    
    if(walletProvider) {
      try {
        const provider = new ethers.providers.Web3Provider(walletProvider as any);
        const signer = provider.getSigner();

        /* next, create the item */
        let contract = new ethers.Contract(nftcontractAddress!, NFTMarketPlace, signer);
        let transaction = await contract.createToken(fileUrl)
        await transaction.wait();
        console.log(" nft creation transaction",transaction)
        setShowLoading(false);
        setShowBgOverlay(false);
        router.push('../nft/mynfts')
      } catch (error) {
        setShowAlertDanger(true);
        seterrorMessage("transaction cancelled");
        setShowLoading(false)
      }
    }
  }

  const closeAlertModal = () => {
    setShowAlertDanger(false);
    setShowBgOverlay(false)
  }

  const closeAddTaits = () => {
    setShowBgOverlay(false);
    setOpenAddTraits(false)
  }

  
  const AddTraitNow = () => {
    if(traitName && traitValue) {
      setaddtraitCount(addtraitCount+1)
      const newAddTraitDiv = <div className={styles.addtraits_c_ina} key={addtraitCount}>
                              <div className={styles.addtc}>
                                <label>Type</label>
                                <input type='text' onChange={(e) => setTraitName(e.target.value) } placeholder='Ex. Size'/>
                              </div>
                              <div className={styles.addtc}>
                                <label>Name</label>
                                <input type='text' onChange={(e) => setTraitValue(e.target.value) }  placeholder='Ex. Large'/>
                              </div>
                          </div>;
      setshowTraits(true);
      setaddTraitDiv([...addTraitDiv, newAddTraitDiv]);
      const traits = {traitname: traitName ,traitvalue:traitValue}
      Traits.push(traits);
      console.log('add trait count',addtraitCount)
      console.log(Traits);
      console.log(JSON.stringify(Traits))
    }else {
      setShowAlertDanger(true);
      seterrorMessage('Add first trait to proceed');
    }
    
  }

  const closeActionModalComp = () => {
    // let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
    // hiw_bgoverlay.style.display = 'none';
    setShowBgOverlay(false);
    setActionSuccess(false);
  }

  const SubmitTrait = () => {
    if(traitName && traitValue) {
      const traits = {traitname: traitName ,traitvalue:traitValue}
      Traits.push(traits);
      console.log('add trait count',addtraitCount)
      console.log(Traits);
      console.log(JSON.stringify(Traits));
      setShowBgOverlay(true);
      setOpenAddTraits(false);
      setActionSuccess(true);
    }else {
      setShowAlertDanger(true);
      seterrorMessage('Add first trait to proceed');
    }
    
  }

  const AddTraits = () => {
    setShowBgOverlay(true);
    setOpenAddTraits(true);
  }

  const closeBgModal = () => {
    setShowLoading(false);
    setShowBgOverlay(false);
  }

  return (
    <>
      <Head>
        <title>Mint NFT | FifaReward</title>
        <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
      </Head>
      <div className={`${styles.main} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`}>
        {showAlertDanger && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
        {showBgOverlay && <BgOverlay onChange={closeBgModal}/>}
        {showloading && <Loading/>}
        {betactionsuccess && 
            <ActionSuccessModal prop='Add Traits' onChange={closeActionModalComp}/>
        }
        {openaddTraits && 
          <div className={styles.addtraits}>
              <div className={styles.addtraits_c}>
                <div className={styles.addtraits_h}>
                    <div>
                      <h1>Add Traits</h1>
                    </div>
                    <div>
                      <button type='button' style={{color: '#f1f1f1'}} onClick={closeAddTaits}>{<FaXmark size={22} />}</button>
                    </div>
                </div>
                <div className={styles.addtraits_c_in}>
                    <div className={styles.addtraits_c_ina} key={0}>
                        <div className={styles.addtc}>
                          <label>Type</label>
                          <input type='text' onChange={(e) => setTraitName(e.target.value) } placeholder='Ex. Size'/>
                        </div>
                        <div className={styles.addtc}>
                          <label>Name</label>
                          <input type='text' onChange={(e) => setTraitValue(e.target.value) }  placeholder='Ex. Large'/>
                        </div>
                        
                    </div>
                    {addTraitDiv}
                    
                    <div>
                      <button className={styles.addnewtrait} onClick={AddTraitNow} style={{color: '#f1f1f1'}}>Add More ...</button>
                    </div>
                    <div>
                      <button className={styles.addnewtrait_} onClick={SubmitTrait}>Submit</button>
                    </div>
                </div>
              </div>
          </div>
        }
        <div className={styles.main_c}>
          <div><h1>Mint NFT</h1></div>
          <div className={`${styles.main_cc}`}>
            <div className={`${styles.dragdrop} ${theme === 'dark' ? styles['darktmod'] : styles['lightmod']}`}>
              <DragDropImageUpload onFileUpload={handleFileUpload}/>
            </div>
            <div className={`${styles.nft_art_desc} ${theme === 'dark' ? styles['darktmod'] : styles['lightmod']}`}>
              <div className={styles.form_g}>
                <label className={styles.label}>Asset Name</label>
                <input 
                  placeholder="Asset Name"
                  className={styles.input_}
                  onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.form_g}>
              <label className={styles.label}>Description </label>
                <textarea
                  placeholder="Say something about your asset"
                  className={styles.textarea_}
                  onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                  required
                />
              </div>
              <div className={styles.form_g}>
                <label className={styles.label}>Supply (Max. of 1)</label>
                <input
                  type="number"
                  placeholder="1"
                  className={styles.input_}
                  value={1}
                  onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                  readOnly
                  required
                />
              </div>
              <div className={styles.form_g}>
                <label className={styles.label}>Traits </label>
                <p>Traits describe attributes of your item. They appear as filters inside your collection page and are also listed out inside your item page.</p>
                <button onClick={AddTraits} className={styles.add_traits}> + Add Trait(s)</button>
                {showtrait && Traits.map((trait,index) => (
                  <div key={index}>
                    <div>{trait.name}</div>
                    <div>{trait.value}</div>
                  </div>
                ))}
              </div>

              <div className={styles.form_g}>
                <button type='button' title='create nft' onClick={handleCreateNFT} className={styles.create_btn}>
                  Create NFT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}