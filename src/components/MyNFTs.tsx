import React, { useContext,useState,useEffect, useRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import Loading from './Loading';
import BgOverlay from './BgOverlay';
import ActionSuccessModal from './ActionSuccess';
import AlertDanger from './AlertDanger';
// import DappSideBar from './Dappsidebar';
import { useRouter } from 'next/router';
import { ThemeContext } from '../contexts/theme-context';
import axios from 'axios';
import NFTMarketPlaceAbi from '../../artifacts/contracts/FRDNFTMarketPlace.sol/FRDNFTMarketPlace.json';
import NFTMarketPlaceFeaturesContractAbi from '../../artifacts/contracts/FRDNFTMarketPlaceFeatures.sol/FRDNFTMarketPlaceFeatures.json';
import { ethers } from 'ethers';
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faCircleCheck, faMagicWandSparkles, faXmark  } from "@fortawesome/free-solid-svg-icons";
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useDisconnect } from '@web3modal/ethers5/react';
import { NFTMetadata } from './NFTMetadata';
import { NFTBidMetadata } from './NFTBidMetadata';
import { NFTFullMetadata } from './NFTFullMetadata';
import HelmetExport from 'react-helmet';
// material
import styles from "../styles/mynfts.module.css";
import dotenv from 'dotenv';
dotenv.config();
// component
// ----------------------------------------------------------------------
library.add(faEye, faEyeSlash);
const MyNFTs: React.FC<{}> = () =>  {

    const divRef = useRef<HTMLDivElement>(null);
    const [showloading, setShowLoading] = useState<boolean>(false);
    const [showchangepriceModal, setShowChangePriceModal] = useState<boolean>(false);
    const { open } = useWeb3Modal();
    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { disconnect } = useDisconnect();
    const [username, setUsername] = useState<string>("");
    const [nftbidsLoaded,setNFTBidsLoaded] = useState<boolean>(false);
    const [nftbidsLoaded2,setNFTBidsLoaded2] = useState<boolean>(false);
    const [nftLoaded,setNFTLoaded] = useState<boolean>(false);
    const [bnbPrice, setBnbPrice] = useState<number>();
    const [bnbdollarPrice, setBnbDollarPrice] = useState<number>();
    const [userId, setUserId] = useState<number>();
    const [isLoggedIn,setIsloggedIn] = useState<boolean>(false);
    const [showAlertDanger,setShowAlertDanger] = useState<boolean>(false);
    const [errorMessage,seterrorMessage] = useState<string>("");
    const [dappsidebartoggle, setSideBarToggle] = useState(false);
    const [propMessage,setPropMessage] = useState<string>("");
    const [showListNFTDiv,setShowListNFTDiv] = useState<boolean>(false);
    const [showListedNFT,setShowListedNFT] = useState<boolean>(false);
    const [showunListedNFT,setShowUnListedNFT] = useState<boolean>(false);
    const [showBgOverlay,setShowBgOverlay] = useState<boolean>(false);
    const [listingItemTokenId,setListingItemTokenId] = useState<any>(null);
    const [nftItemPrice, setNftItemPrice] = useState<string>("");
    // const [itemprice, setItemPrice] = useState<any>(0);
    const [itemprice2, setItemPrice2] = useState<any>(0);
    const [bidduration, setBidDuration] = useState<any>(0);
    const [reservedbuyer, setReservedBuyer] = useState<any>("0x0000000000000000000000000000000000000000");
    const [minbidamount, setMinBidAmount] = useState<any>(0);
    const [salesroyaltyfee, setSalesRoyaltyFee] = useState<any>(2);
    const { theme } = useContext(ThemeContext);
    const [itemname, setItemName] = useState<any>('');
    const [nftactionsuccess,setActionSuccess] = useState<boolean>(false);
    const [windowloadgetbetruntimes, setwindowloadgetbetruntimes] = useState<number>(0);
    const [isSideBarToggled, setIsSideBarToggled] = useState(false)
    const [_itemId, set_ItemId] = useState<number>();
    const [itemBids,setItemBids] = useState<NFTBidMetadata[]>([]);
    const [newbidduration,setNewBidDuration] = useState<number>();
    const [newItemPrice, setNewItemPrice] = useState<string>("");
    const [newminbidamount, setNewMinBidAmount] = useState<any>(0);
    
    const nftcontractAddress = process.env.NEXT_PUBLIC_NFTMARKETPLACE_CA;
    const nftfeaturescontractAddress = process.env.NEXT_PUBLIC_NFTMARKETPLACE_FEATURES_CA;

    const [myunlistedNFTs,setmyUnlistedNFTS] = useState<NFTMetadata[]>([]);

    const [mylistedNFTs,setmyListedNFTS] = useState<NFTFullMetadata[]>([]);

    const router = useRouter();

    useEffect(() => {

      async function getBnbPrice() {
        try {
            const url = 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd';
            const response = await axios.get(url);
    
            if (response.status === 200) {
                // Parse JSON response
                const data: {[key: string]: { usd: number }} = response.data;

            // Extracting BNB price from the response
            const bnbPriceInUsd = data.binancecoin.usd;
            return bnbPriceInUsd;
            } else {
                return null;
            }
        } catch (error: any) {
            console.error('An error occurred:', error.message);
            return null;
        }
    }

        const udetails = JSON.parse(localStorage.getItem("userInfo")!);
        if(udetails && udetails !== null && udetails !== "") {
        const username_ = udetails.username;  
        if(username_) {
            setUsername(username_);
            setUserId(udetails.userId);
            setIsloggedIn(true);
            }
            if(!isConnected) {
              open();

            }
        }else {
            setIsloggedIn(false);
        }

      if(windowloadgetbetruntimes <= 0) {
        const getMyUnlistedNFTs = async () => {
          try {
              setShowLoading(true);
              if(walletProvider) {
                  const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
                  const signer = provider.getSigner();
                  /* next, create the item */
                  let contract = new ethers.Contract(nftcontractAddress!, NFTMarketPlaceAbi, signer);
                  
                  if(contract) {
                      let mintednfts = await contract.getMintedNfts();
                      console.log(" unlisted nfts",mintednfts)
                      if(mintednfts.length > 0) {
                        await mintednfts.forEach(async (element:any) => {
                          if(element[1] && element[1] !== "") {
                            let ipfsurl = element[1];
                            let ipfsurlarray = ipfsurl.split('//');
                            
                            let ipfsmetarray = ipfsurlarray[1].split('/');
                            const metadata = await axios.get(`https://${ipfsmetarray[0]}.ipfs.nftstorage.link/metadata.json`);
                            const { name, description, traits, image } = metadata.data;
                            let img = image.split('//');
                            const image_ = `https://nftstorage.link/ipfs/${img[1]}`;
                            let item: NFTMetadata = {
                              name: name,
                              image: image_,
                              description: description,
                              traits: traits,
                              chainId: chainId,
                              creator: element.creator,
                              owner: element.owner,
                              hascreatedToken: element.hascreatedToken,
                              // following properties only exist if the NFT has been minted
                              tokenId: element.tokenId,
                              tokenURI: element.tokenURI,
                              listed: element.listed
                            }
                            myunlistedNFTs.push(item);
                            setmyUnlistedNFTS(myunlistedNFTs);
                            setNFTLoaded(true);
                            setShowUnListedNFT(true);
                            setShowLoading(false);
                            setwindowloadgetbetruntimes(1);
                            return item;
                          }
                        });
                      }else {
                        setShowLoading(false);
                        setShowUnListedNFT(false);
                      }
                      
                  }
              }
          } catch (error) {
              console.error('Error creating Web3Provider:', error);
              // Handle or rethrow the error as needed
          }
          
      }
      getMyUnlistedNFTs();

        const getMyListedNFTs = async () => {
          try {
              setShowLoading(true);
              if(walletProvider) {
                  const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
                  const signer = provider.getSigner();
                  /* next, create the item */
                  let contract = new ethers.Contract(nftfeaturescontractAddress!, NFTMarketPlaceFeaturesContractAbi, signer);
                  
                  if(contract) {
                      let listednfts = await contract.fetchItemsCreated();
                      console.log(" items created",listednfts);
                      if(listednfts.length > 0) {
                        await listednfts.forEach(async (element:any) => {
                          if(element[1] && element[1] !== "") {
                            let ipfsurl = element[2];
                            let ipfsurlarray = ipfsurl.split('//');
                            
                            let ipfsmetarray = ipfsurlarray[1].split('/');
                            const metadata = await axios.get(`https://${ipfsmetarray[0]}.ipfs.nftstorage.link/metadata.json`);
                            const { name, description, traits, image } = metadata.data;
                            let img = image.split('//');
                            const image_ = `https://nftstorage.link/ipfs/${img[1]}`;
                            console.log("image_",image_)
                            let item: NFTFullMetadata = {
                              name: name,
                              image: image_,
                              description: description,
                              traits: traits,
                              chainId: chainId,
                              creator: element.creator,
                              owner: element.owner,
                              tokenId: element.tokenId,
                              tokenURI: element.tokenURI,
                              price: element.sellingprice,
                              seller: element.seller,
                              itemId: element.itemId,
                              biddingduration: element.biddingduration,
                              minbidamount: element.minbidamount,
                              sold: element.sold
                            }
                            mylistedNFTs.push(item);
                            setmyListedNFTS(mylistedNFTs);
                            setNFTLoaded(true);
                            setShowLoading(false);
                            setShowListedNFT(true);
                            setwindowloadgetbetruntimes(1);
                            const getitembids = await contract.getBidsForItem(item.itemId?.toString());
                            getBnbPrice().then((bnbPriceInUsd: any) => {
                                if (bnbPriceInUsd !== null) {
                                    const nftp = item?.price?.toString() as any;
                                    setBnbPrice(bnbPriceInUsd * nftp);
                                    setBnbDollarPrice(bnbPriceInUsd)
                                }
                            });
                            if(getitembids.length > 0) {
                              setNFTBidsLoaded(true);
                              setNFTBidsLoaded2(true);
                            }
                            return item;
                          }
                        });
                      }else {
                        setShowLoading(false);
                        setShowListedNFT(false);
                      }
                      
                  }
              }
          } catch (error) {
              console.error('Error creating Web3Provider:', error);
              // Handle or rethrow the error as needed
          }
          
      }
      getMyListedNFTs();

    }
          
    },[username,userId,windowloadgetbetruntimes])
  
    const getItemBidds = async (itemId: any,itemName: string) => {
      try {
          if(walletProvider) {
              setShowBgOverlay(true);
              setShowLoading(true);
              setItemName(itemName);
              const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
              const signer = provider.getSigner();
              /* next, create the item */
              let contract = new ethers.Contract(nftfeaturescontractAddress!, NFTMarketPlaceFeaturesContractAbi, signer);
              
              if(contract) {
                  const getbids = await contract.getBidsForItem(itemId);
                          if(getbids.length > 0) {
                              await getbids.forEach(async (element:any) => {
                                  if(element[1] && element[1] !== "") {
                                    let itemb: NFTBidMetadata = {
                                      tokenId: element.tokenId,
                                      itemId: element.itemId,
                                      tokenURI: element.tokenURI,
                                      biddingId: element.biddingId,
                                      biddingtime: element.biddingtime,
                                      bidderaddress: element.bidderaddress,
                                      creator: element.creator,
                                      owner: element.owner,
                                      biddingprice: element.biddingprice,
                                      biddingsuccess: element.biddingsuccess,
                                      wasitempurchased: element.waspurchased
                                    }
                                    itemBids.push(itemb);
                                    setItemBids(itemBids);
                                    setNFTBidsLoaded(true);
                                    setShowLoading(false);
                                    return itemb;
                                  }
                                });
                            }
              }
          }
      } catch (error) {
          console.error('Error creating Web3Provider:', error);
          // Handle or rethrow the error as needed
      }
      
  }
  
  const AcceptOffer = async (itemId: any, price: any, bidderaddress: any) => {
    
        setShowAlertDanger(false);
        setShowLoading(true);
        const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
        const signer = provider.getSigner();
        
        try {
            
            let contract = new ethers.Contract(nftcontractAddress!, NFTMarketPlaceAbi, signer);
            const purchasemethod: string = "Bid";
            const buynftC = await contract.createMarketSale(itemId,bidderaddress,purchasemethod,price,username, {gasLimit: 1000000});
            
            buynftC.wait().then(async (receipt:any) => {
                // console.log(receipt);
                if (receipt && receipt.status == 1) {
                    // transaction success.
                    setShowLoading(false);
                    setShowBgOverlay(false);
                    setActionSuccess(true);
                    setPropMessage('Offer ');
                }
            })
            
        } catch (error: any) {
            console.log("t error",error);
            setShowLoading(false);
            setShowBgOverlay(true);
            setShowAlertDanger(true);
            seterrorMessage(error.code);
        }
    }

    const createNftItem = async () => {
      setShowListNFTDiv(false);
      const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
      const signer = provider.getSigner();
      /* next, create the item */
      if(listingItemTokenId && nftItemPrice && bidduration > 0 && minbidamount > 0) {
        try {
          setShowLoading(true);
          let contract = new ethers.Contract(nftcontractAddress!, NFTMarketPlaceAbi, signer);
          let transaction = await contract.createAuctionItem(listingItemTokenId,nftItemPrice,bidduration,reservedbuyer,minbidamount,salesroyaltyfee );
          transaction.wait().then(async (receipt:any) => {
            // console.log(receipt);
            if (receipt && receipt.status == 1) {
                // transaction success.
                setShowLoading(false);
                setShowBgOverlay(false);
                setActionSuccess(true);
                setPropMessage('NFT successfully added to market place');
              }
          })
        } catch (error: any) {
          console.log("t error",error);
          setShowAlertDanger(true);
          seterrorMessage(error.code);
        }
      }else {
        setShowAlertDanger(true);
        seterrorMessage("NFT item price, bidding duration and minimum bid amount required");
      }
      
    }

    const unlistItem = async (itemId:string) => {
      const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
      const signer = provider.getSigner();
      
        try {
          setShowLoading(true);
          let contract = new ethers.Contract(nftcontractAddress!, NFTMarketPlaceAbi, signer);
          let transaction = await contract.unListAuctionItem(itemId);
          transaction.wait().then(async (receipt:any) => {
            // console.log(receipt);
            if (receipt && receipt.status == 1) {
                // transaction success.
                setShowLoading(false);
                setShowBgOverlay(false);
                setActionSuccess(true);
                setPropMessage('Item Unlisting');
              }
          })
        } catch (error: any) {
          setShowBgOverlay(true);
          setShowAlertDanger(true);
          seterrorMessage(error.code);
        }
      
    }

    const listbackItem = async (itemId:string) => {
      const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
      const signer = provider.getSigner();
      
        try {
          setShowLoading(true);
          let contract = new ethers.Contract(nftcontractAddress!, NFTMarketPlaceAbi, signer);
          let transaction = await contract.ListBackAuctionItem(itemId);
          
          transaction.wait().then(async (receipt:any) => {
            // console.log(receipt);
            if (receipt && receipt.status == 1) {
                // transaction success.
                setShowLoading(false);
                setShowBgOverlay(false);
                setActionSuccess(true);
                setPropMessage('Item List Back');
              }
          })
        } catch (error: any) {
          console.log("t error",error);
          setShowAlertDanger(true);
          seterrorMessage(error.code);
        }
      
    }

    const updateBiddingOptions = async () => {
      const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
      const signer = provider.getSigner();
      
        try {
          setShowLoading(true);
          let contract = new ethers.Contract(nftcontractAddress!, NFTMarketPlaceAbi, signer);
          let transaction = await contract.updateBiddingOptions();
          transaction.wait().then(async (receipt:any) => {
              // console.log(receipt);
              if (receipt && receipt.status == 1) {
                  // transaction success.
                  setShowLoading(false);
                  setShowBgOverlay(false);
                  setActionSuccess(true);
                  setPropMessage('Bidding Update');
              }
          })
        } catch (error: any) {
          setShowBgOverlay(true);
          setShowAlertDanger(true);
          seterrorMessage(error.code);
        }
      
    }

    const toggleAddr = (e:any) => {
      e.previousElementSibling.style.display = (e.previousElementSibling.style.display === 'block') ? 'none' : 'block';
    }

    const changeitemPrice = async ( event: React.MouseEvent) => {
      event.preventDefault();
        setShowBgOverlay(true);
        setShowChangePriceModal(true);
        setTimeout(function() {
          if(divRef.current) {
            divRef.current.focus()
          }
        }, 2000);
    }

    const openListItemDiv = (tokenid: any, event: React.MouseEvent) => {
      event.preventDefault();
      setListingItemTokenId(tokenid);
      setShowBgOverlay(true);
      setShowListNFTDiv(true);
      setTimeout(function() {
        if(divRef.current) {
          divRef.current.focus()
        }
      }, 2000);
    }

    const closeListItemModalDiv = () => {
      setShowBgOverlay(false);
      setShowListNFTDiv(false);
      setShowChangePriceModal(false);
    }

    const closeNFTItemOffersModalDiv = (event: React.MouseEvent) => {
      event.preventDefault();
      setShowBgOverlay(false);
      setNFTBidsLoaded(false);
      setTimeout(function() {
        if(divRef.current) {
          divRef.current.focus()
        }
      }, 2000);
    }

    const closeAlertModal = () => {
      setShowAlertDanger(false);
      setShowBgOverlay(false);
    }

    const closeActionModalComp = () => {
      // let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
      // hiw_bgoverlay.style.display = 'none';
      setShowBgOverlay(false);
      setActionSuccess(false);
      router.reload();
    }

    const closeBgModal = () => {
      setShowLoading(false);
      setShowBgOverlay(false);
    }

    const toggleSideBar = () => {
      setSideBarToggle(!dappsidebartoggle);
      setIsSideBarToggled(!isSideBarToggled);
    };
  

    const sideBarToggleCheck = dappsidebartoggle ? styles.sidebartoggled : '';

  return (
    <>
    <HelmetExport>
        <title>My NFTs | FifaReward</title>
        <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
    </HelmetExport>
    {showloading && <Loading/>}
    {showBgOverlay && <BgOverlay onChange={closeBgModal}/>}
    {showAlertDanger && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
    {nftactionsuccess && 
        <ActionSuccessModal prop={propMessage} onChange={closeActionModalComp}/>
    }
     {/* <div className={`${styles.sidebar} ${sideBarToggleCheck}`}>
        <DappSideBar onChange={toggleSideBar} />
      </div> */}
      <div className={`${styles.main} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`}>

        {nftbidsLoaded && itemBids.length > 0 ? 
          <div className={`${styles.nft_offer } ${theme === 'dark' ? styles['darkmod'] : styles['lightmod']}`} id="nft_offer">
            
            <div className={styles.offer_p} ref={divRef} tabIndex={-1}>
                <div className={styles.offer_p_in}>
                    {<FontAwesomeIcon icon={faMagicWandSparkles}/>} <span>Offers for {itemname} </span> 
                </div>
                <div className={styles.closebtn}>
                  <button type='button' onClick={(e) => closeNFTItemOffersModalDiv(e)}>{<FontAwesomeIcon icon={faXmark}/>}</button>
                </div>
            </div>
            <div className={styles.offer_list} >
                <div className={styles.lp}>
                    {nftbidsLoaded && itemBids.length > 0 ?
                    (<div className={styles.tablec}>
                        <table id="resultTable" className="table01 margin-table">
                            <thead>
                                <tr>
                                    <th id="accountTh" className="align-L">Price</th>
                                    <th id="balanceTh">USD Price</th>
                                    <th id="balanceTh">Qty</th>
                                    <th id="balanceTh">Floor Diff.</th>
                                    <th id="balanceTh">Expires (Days)</th>
                                    <th id="balanceTh">Accept</th>
                                </tr>
                            </thead>
                            <tbody id="userData">
                            {itemBids.map((bid:NFTBidMetadata,index: number) =>(
                                <tr key={index}>
                                <td>{bid.biddingprice.toLocaleString()}BNB</td>
                                <td>${`${(bid.biddingprice.toString() as any * bnbdollarPrice!).toLocaleString()}`}</td>
                                <td>{1}</td>
                                <td>{((bid.biddingprice.toString()) as any/itemprice2!) * 100}%</td>
                                <td>{`${Math.floor((bid.biddingtime.toNumber())/86400000)}`}</td>
                                <td><button onClick={() => AcceptOffer(bid.itemId.toString(),bid.biddingprice.toNumber(),bid.owner)}>Accept</button></td>
                            </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>) : 
                    <div className={styles.notfound_p}>
                        <div className={styles.notfound}>No offers yet </div>
                    </div>
                }
                </div>
            </div>
        </div> :
        <div></div>
        }

        {showchangepriceModal && 
          <div className={styles.listnftitem} ref={divRef} tabIndex={-1}>
            <div className={styles.listnftitem_c}>
              <div className={styles.listnftitem_h}>
                  <div>
                    
                  </div>
                  <div>
                    <h1>Update Item Bidding Options </h1>
                  </div>
                  <div>
                    <button type='button' onClick={closeListItemModalDiv}>{<FontAwesomeIcon icon={faXmark}/>}</button>
                  </div>
              </div>
              <div className={styles.listnftitem_c_in}>
                  <div className={styles.listnftitem_c_ina}>
                      <div className={styles.list_tc}>
                        <label>NFT item id</label>
                        <input type='text' value={listingItemTokenId} readOnly/>
                      </div>
                      <div className={styles.list_tc}>
                        <label>New listing price(BNB/MATIC)</label>
                        <input type='text' onChange={(e) => setNftItemPrice(e.target.value) } placeholder='200BNB'/>
                      </div>
                  </div>
                  <div className={styles.listnftitem_c_ina}>
                      <div className={styles.list_tc}>
                        <label>New bidding duration(days)</label>
                        <input type='number' onChange={(e) => setBidDuration(e.target.value)} placeholder="Ex. 180"/>
                      </div>
                      <div className={styles.list_tc}>
                        <label>New min. bid amount</label>
                        <input type='number' onChange={(e) => setMinBidAmount(e.target.value) } placeholder='1'/>
                      </div>
                  </div>
                  <div>
                    <button className={styles.createlistitem_} onClick={updateBiddingOptions}>Update Bidding Options</button>
                  </div>
              </div>
            </div>
        </div>
        }
        {showListNFTDiv && 
          <div className={styles.listnftitem} ref={divRef} tabIndex={-1}>
            <div className={styles.listnftitem_c}>
              <div className={styles.listnftitem_h}>
                  <div>
                    
                  </div>
                  <div>
                    <h1>List NFT In Our Auction Market</h1>
                  </div>
                  <div>
                    <button type='button' onClick={closeListItemModalDiv}>{<FontAwesomeIcon icon={faXmark}/>}</button>
                  </div>
              </div>
              <div className={styles.listnftitem_c_in}>
                  <div className={styles.listnftitem_c_ina}>
                      <div className={styles.list_tc}>
                        <label>NFT token id</label>
                        <input type='text' value={listingItemTokenId} readOnly/>
                      </div>
                      <div className={styles.list_tc}>
                        <label>Listing price(BNB/MATIC)</label>
                        <input type='text' onChange={(e) => setNftItemPrice(e.target.value) } placeholder='200BNB'/>
                      </div>
                  </div>
                  <div className={styles.listnftitem_c_ina}>
                      <div className={styles.list_tc}>
                        <label>Bidding duration(days)</label>
                        <input type='number' onChange={(e) => setBidDuration(e.target.value)} placeholder="Ex. 180"/>
                      </div>
                      <div className={styles.list_tc}>
                        <label>Min. bid amount</label>
                        <input type='number' onChange={(e) => setMinBidAmount(e.target.value) } placeholder='1'/>
                      </div>
                  </div>
                  <div className={styles.listnftitem_c_ina}>
                      <div className={styles.list_tc}>
                        <label>Have a reserved buyer?(optional)</label>
                        <input type='text' onChange={(e) => setReservedBuyer(e.target.value)} placeholder="0x0643892354..."/>
                      </div>
                      <div className={styles.list_tc}>
                        <label>Set royalty fee</label>
                        <select onChange={(e) => setSalesRoyaltyFee(e.target.value)}>
                          <option value={2}>2% Fee</option>
                          <option value={3}>3% Fee</option>
                          <option value={4}>4% Fee</option>
                          <option value={5}>5% Fee</option>
                          <option value={6}>6% Fee</option>
                          <option value={7}>7% Fee</option>
                        </select>
                      </div>
                  </div>
                  <div>
                    <button className={styles.createlistitem_} onClick={createNftItem}>List NFT In Market Place</button>
                  </div>
              </div>
            </div>
        </div>
        }
        <div className={styles.main_bg_overlay}></div>
          {/* banner header */}
          
          <div className={styles.main_c}>
            <div className={styles.settings}>
              <div className={styles.settings_bg_overlay}></div>
              <div className={styles.settings_in}>
                <div>
                  <h1 className={styles.h1}>Unlisted NFTs</h1>
                </div>

                <div className={styles.nft_option}>
                {showunListedNFT && myunlistedNFTs.length > 0 ? myunlistedNFTs?.map((myunlistedNFT:NFTMetadata,index:number) => (
                    <div key={index} className={styles.nft_options_}>
                      <div className={styles.nft_options__} key={index}>
                          <Image src={myunlistedNFT.image} width={100} height={100} priority style={{objectFit:'cover',width: '100%',height: '250px',borderTopLeftRadius: '16px',borderTopRightRadius: '16px',padding: '0'}} alt='bg options'/>
                            <div className={styles.nft_head}>
                                <div className={styles.nft_pfh}><h2>{myunlistedNFT.name} {<FontAwesomeIcon icon={faCircleCheck} style={{color:'#e3a204'}}/>}</h2></div>
                                <div className={styles.nft_desc}>
                                    <span>{myunlistedNFT.description.substring(0, 40)+' ...'}</span>
                                </div>
                                <div className={styles.nft_addbtn}>
                                    <div className={styles.nft_addr}>
                                      <span>{myunlistedNFT.creator.substring(0, 8)+' ...'}</span>
                                      <span className={styles.c_nft_addr}>{myunlistedNFT.creator}</span>
                                      <button type='button' onClick={(e) => toggleAddr(e.target)} className={styles.addr_btn}>view</button>
                                    </div>
                                    <div className={styles.nft_list}>
                                      {myunlistedNFT.owner == myunlistedNFT.creator ? <button type='button' className={styles.listnft} onClick={(e) => openListItemDiv(myunlistedNFT.tokenId,e)}>List NFT</button> : ""}
                                  </div>
                                </div>
                            </div>
                      </div>
                    </div>
                  )) : 
                  <div className={styles.notfound_p}>
                    <div className={styles.notfound}>No items were found</div>
                  </div>}
                </div>
              </div>
            </div>
          </div>


          {/* listed nft */}

          <div className={styles.main_c}>
            <div className={styles.settings}>
              <div className={styles.settings_bg_overlay}></div>
              <div className={styles.settings_in}>
                <div>
                  <h1 className={styles.h1}>Listed NFTs</h1>
                </div>

                <div className={styles.nft_option}>
                {showListedNFT && mylistedNFTs.length > 0 ? mylistedNFTs?.map((mylistedNFT:NFTFullMetadata,index:number) => (
                    <div key={index} className={styles.nft_options_}>
                      <div className={styles.nft_options__} >
                          <a href={`/nft/${mylistedNFT.name.replace(/[ ]+/g, "-")}/${mylistedNFT.tokenId!.toString()}`}>
                            <Image src={mylistedNFT.image} width={100} priority height={100}  style={{objectFit:'cover',width: '100%',height: '250px',borderTopLeftRadius: '16px',borderTopRightRadius: '16px',padding: '0'}} alt='bg options'/>
                          </a>
                          <div className={styles.nft_head}>
                              <a href={`/nft/${mylistedNFT.name.replace(/[ ]+/g, "-")}/${mylistedNFT.tokenId!.toString()}`}>
                                <div className={styles.nft_pfh}><h2>{mylistedNFT.name} {<FontAwesomeIcon icon={faCircleCheck} style={{color:'#e3a204'}}/>}</h2></div>
                                <div className={styles.nft_desc}>
                                    <span>{mylistedNFT.description.substring(0, 40)+' ...'}</span>
                                </div>
                                <div className={styles.nft_addbtn}>
                                    <div className={styles.nft_addr}>
                                      <span>{mylistedNFT.owner.substring(0, 8)+' ...'}</span>
                                      <span className={styles.c_nft_addr}>{mylistedNFT.owner}</span>
                                      <button type='button' onClick={(e) => toggleAddr(e.target)} className={styles.addr_btn}>view</button>
                                    </div>
                                    <div className={styles.nft_list}>
                                      <span className={styles.listed}>Listed {<FontAwesomeIcon icon={faCheck} style={{color:'#e3a204'}}/>}</span> 
                                    </div>
                                </div>
                                <div className={styles.nft_list_p}>
                                  <div>
                                    <div className={styles.listedp}>Selling Price</div> <div className={styles.listedp}>{mylistedNFT.price?.toNumber()}{mylistedNFT.chainId = 97 ? 'BNB': 'MATIC'}</div>
                                  </div>
                                  <div>
                                    <div className={styles.listedp}>Min Bid Price</div> <div className={styles.listedp}>{mylistedNFT.minbidamount?.toNumber()}{mylistedNFT.chainId = 97 ? 'BNB': 'MATIC'}</div>
                                  </div>
                                  <div>
                                    <div className={styles.listedp}>Sold</div> <div className={styles.listedp}>{mylistedNFT.sold == false ? 'No' : 'Yes'}</div>
                                  </div>
                                </div>
                                <div className={styles.nft_list_p}>
                                  <div>
                                    <span className={styles.listedp}>Bidding Duration</span> <span className={styles.listedp}>{Math.floor(mylistedNFT.biddingduration?.toNumber()/86400000)} Days</span>
                                  </div>
                                </div>
                              </a>
                              <div className={styles.nft_list_b}>
                                <div>
                                  {mylistedNFT.owner == mylistedNFT.creator ? <button className={styles.listedp} type='button' onClick={() => unlistItem(mylistedNFT.itemId!.toString())}>Unlist</button> : <button className={styles.listedp} type='button' onClick={() => listbackItem(mylistedNFT.itemId!.toString())}>Unlist</button>} 
                                </div>
                                <div>
                                  {nftbidsLoaded2 === true ? <button className={styles.listedp} type='button' onClick={() => getItemBidds(mylistedNFT.itemId?.toString(),mylistedNFT.name)}>View Offers</button> : <div style={{fontSize: '14px'}}>No offers yet</div>}
                                </div>
                                <div>
                                  <button className={styles.listedp} type='button' onClick={(e) => changeitemPrice(e)}>Update Bid Price</button> 
                                </div>
                              </div>
                          </div>
                      </div>
                    </div>
                  )) : 
                  <div className={styles.notfound_p}>
                    <div className={styles.notfound}>No items were found</div>
                  </div>}
                </div>
              </div>
            </div>
          </div>

      </div>
    </>
  );
}

export default MyNFTs