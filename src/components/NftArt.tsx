import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import bnblogo from '../assets/images/bnb-bnb-logo.png'
import { ThemeContext } from '../contexts/theme-context';
import NFTCountdownTimer from './NftCountDownTimer';
import NFTMarketPlaceabi from '../../artifacts/contracts/FRDNFTMarketPlace.sol/FRDNFTMarketPlace.json';
import NFTMarketPlaceFeaturesabi from '../../artifacts/contracts/FRDNFTMarketPlaceFeatures.sol/FRDNFTMarketPlaceFeatures.json';
import axios from 'axios';
import { ethers } from 'ethers';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { NFTBidMetadata } from './NFTBidMetadata';
import { NFTFullMetadata } from './NFTFullMetadata';
import Loading from './Loading';
import BgOverlay from './BgOverlay';
import ActionSuccessModal from './ActionSuccess';
import AlertDanger from './AlertDanger';
import Head from 'next/head';
import styles from "../styles/nftart.module.css";
import dotenv from 'dotenv';
import { FaAlignJustify, FaCartShopping, FaChevronLeft, FaCircleCheck, FaCircleDollarToSlot, FaHeart, FaTag, FaWandMagicSparkles, FaXmark } from 'react-icons/fa6';
dotenv.config();

const NFTArt: React.FC<{}> = () =>  {

    const [showloading, setShowLoading] = useState<boolean>(false);
    const { open } = useWeb3Modal();
    const { walletProvider } = useWeb3ModalProvider();
    const Wprovider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545");
    const  walletPrivKey: any = process.env.NEXT_PUBLIC_FRD_PRIVATE_KEY as any;
    const { isConnected } = useWeb3ModalAccount();
    const [username, setUsername] = useState<string>("");
    const [bnbPrice, setBnbPrice] = useState<number>();
    const [bnbdollarPrice, setBnbDollarPrice] = useState<number>();
    const [nftLoaded,setNFTLoaded] = useState<boolean>(false);
    const [nftbidsLoaded,setNFTBidsLoaded] = useState<boolean>(false);
    const [showAlertDanger,setShowAlertDanger] = useState<boolean>(false);
    const [errorMessage,seterrorMessage] = useState<string>("");
    const [showBgOverlay,setShowBgOverlay] = useState<boolean>(false);
    const [bidPrice, setBidPrice] = useState<string>("");
    const [_itemId, set_ItemId] = useState<any>();
    const [_tokenId, set_tokenId] = useState<number>();
    const [itemprice, setItemPrice] = useState<any>(0);
    const [itemprice2, setItemPrice2] = useState<any>(0);
    const [itemname, setItemName] = useState<any>('');
    const [auctiontimeremaining,setAuctionTimeRemaining] = useState<number>();
    const [isauctionremainingtimeset,setIsAuctionRemainingTimeSet] = useState<boolean>(false);
    const [minbidamount, setMinBidAmount] = useState<any>(0);
    const [showbidmodal, setShowBidModal] = useState<boolean>(false);
    const { theme } = useContext(ThemeContext);
    const [nftactionsuccess,setActionSuccess] = useState<boolean>(false);
    
    const NFTCA = process.env.NEXT_PUBLIC_NFTMARKETPLACE_CA;
    const NFTFeatureCA = process.env.NEXT_PUBLIC_NFTMARKETPLACE_FEATURES_CA;

    const [itemBids,setItemBids] = useState<NFTBidMetadata[]>([]);

    const [nftauctItem,setNftAuctItem] = useState<NFTFullMetadata>();

    const [urltitleparams,setTitleParams] = useState<string>('');

    const router = useRouter();
    const { nft } = router.query;
    
  useEffect(() => {

    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
      if(!udetails) {
        open()
      }else {
        
      }

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
    
    console.log("nft query",nft)
    
    if(nft) {
        setTitleParams(nft[0]);
        const getnftItem = async () => {
        try {
            setShowLoading(true);
                let provider, signer;
        
                if(walletProvider) {
                    provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
                    signer = provider.getSigner();
                }else {
                    const provider = walletProvider as any || Wprovider as any;
                    const wallet = new ethers.Wallet(walletPrivKey as any, provider);
                    signer = provider.getSigner(wallet.address);
                }
                if(signer) {
                    /* next, create the item */
                    let featurescontract = new ethers.Contract(NFTFeatureCA!, NFTMarketPlaceFeaturesabi, signer);
                    let nftcontract = new ethers.Contract(NFTCA!, NFTMarketPlaceabi, signer);
                    if(featurescontract) {
                        // const nftitemremtime = await contract.getAuctionItemRemainingTime(nft[1]);
                        
                        const nftitem = await featurescontract.getAuctionItem(nft[1]);
                        console.log("ghyup opi",nftitem)
                        if(nftitem && nftitem !== "") {
                            let ipfsurl = nftitem[4];
                            let ipfsurlarray = ipfsurl.split('//');
                            
                            let ipfsmetarray = ipfsurlarray[1].split('/');
                            const metadata = await axios.get(`https://${ipfsmetarray[0]}.ipfs.nftstorage.link/metadata.json`);
                            const { name, description, traits, image } = metadata.data;
                            let img = image.split('//');
                            const image_ = `https://nftstorage.link/ipfs/${img[1]}`;
                            let item: NFTFullMetadata = {
                                name: name,
                                image: image_,
                                description: description,
                                traits: traits,
                                chainId: nftitem.chainId,
                                seller: nftitem.seller,
                                creator: nftitem.creator,
                                bidduration: nftitem.bidduration,
                                owner: nftitem.owner,
                                decimalplaces: nftitem.decimalplaces,
                                tokenId: nftitem.tokenId,
                                tokenURI: nftitem.tokenURI,
                                price: nftitem.sellingprice,
                                itemId: nftitem.itemId,
                                biddingduration: nftitem.biddingduration,
                                minbidamount: nftitem.minbidamount
                            }
                            
                            setNftAuctItem(item);
                            setNFTLoaded(true);
                            setShowLoading(false);
                            setItemPrice2(item.price?.toString())
                            getBnbPrice().then((bnbPriceInUsd: any) => {
                                if (bnbPriceInUsd !== null) {
                                    const nftp = item?.price?.toString() as any;
                                    setBnbPrice(bnbPriceInUsd * nftp);
                                    setBnbDollarPrice(bnbPriceInUsd)
                                }
                            });
                            const gettimeremaining = await featurescontract.getAuctionItemRemainingTime(item.itemId?.toNumber());
                            if(gettimeremaining) {
                                setAuctionTimeRemaining(gettimeremaining.toNumber());
                                setIsAuctionRemainingTimeSet(true);
                            }
                            
                            const getitembids = await nftcontract.getAllBidsForItem(item.itemId?.toNumber());
                            if(getitembids.length > 0) {
                                await getitembids.forEach(async (element:any) => {
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
                            
                            return item;
                        }
                    
                    }
                }
            } catch (error) {
                console.error('Error creating Web3Provider:', error);
                // Handle or rethrow the error as needed
            }
                
        }
        getnftItem();
    }


        
    },[nft])

    const bidNFTs = async () => {
        if(minbidamount > bidPrice) {
            setShowAlertDanger(true);
            seterrorMessage(`Minimum bid amount is ${minbidamount}`);
            return;
        }
        if(bidPrice == "") {
            setShowAlertDanger(true);
            seterrorMessage(`Enter bidding price`);
            return;
        }
        if(bidPrice >= minbidamount && bidPrice != ""){
            setShowAlertDanger(false);
            setShowLoading(true);
            setShowBidModal(false);
            const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
            const signer = provider.getSigner();
            
            try {
                
                let contract = new ethers.Contract(NFTCA!, NFTMarketPlaceabi, signer);
                
                try {
                    const bidnftC = await contract.bidOnNFT(_itemId,bidPrice,{gasLimit: 1000000});
            
                    try {
                    const receipt = await bidnftC.wait();
                    if (receipt && receipt.status === 1) {
                        setShowLoading(false);
                        setShowBgOverlay(false);
                        setActionSuccess(true);
                    }
                    } catch (receiptError: any) {
                    console.log('Transaction receipt error', receiptError);
                    setShowAlertDanger(true);
                    seterrorMessage(receiptError.code || receiptError.message);
                    setShowLoading(false);
                    }
                } catch (transactionError: any) {
                    console.log('Transaction error', transactionError);
                    setShowAlertDanger(true);
                    seterrorMessage(transactionError.code || transactionError.message);
                    setShowLoading(false);
                }
                
            } catch (error: any) {
                setShowLoading(false);
                setShowBgOverlay(true);
                setShowAlertDanger(true);
                seterrorMessage(error.code);
            }
        }
        
        
    }

    const BuyNFT = async (itemId: any, price: any) => {
        
        setShowAlertDanger(false);
        setShowLoading(true);
        setShowBidModal(false);
        setShowBgOverlay(true);
        
        try {
            const provider = new ethers.providers.Web3Provider(walletProvider as any) || null;
            const signer = provider.getSigner();

            let contract = new ethers.Contract(NFTCA!, NFTMarketPlaceabi, signer);
            
            try {
                const buynftC = await contract.DirectNFTSale(itemId,price, {gasLimit: 1000000});
        
                try {
                const receipt = await buynftC.wait();
                if (receipt && receipt.status === 1) {
                    setShowLoading(false);
                    setShowBgOverlay(false);
                    setActionSuccess(true);
                }
                } catch (receiptError: any) {
                console.log('Transaction receipt error', receiptError);
                setShowAlertDanger(true);
                seterrorMessage(receiptError.code || receiptError.message);
                setShowLoading(false);
                }
            } catch (transactionError: any) {
                console.log('Transaction error', transactionError);
                setShowAlertDanger(true);
                seterrorMessage(transactionError.code || transactionError.message);
                setShowLoading(false);
            }
            
        } catch (error: any) {
            console.log("error c",error);
            setShowLoading(false);
            setShowBgOverlay(true);
            setShowAlertDanger(true);
            seterrorMessage(error.code);
        }
        
    }

    const openBidModal = (tokenId: any,itemId: any, price: any, minbidamt: any, itemName: any) => {
        set_tokenId(tokenId);
        set_ItemId(itemId);
        setItemPrice(price);
        setMinBidAmount(minbidamt);
        setItemName(itemName);
        setShowBidModal(true);
        setShowBgOverlay(true);
    }

    const closeBidItemModalDiv = () => {
        setShowBgOverlay(false);
        setShowBidModal(false);
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
        // router.reload();
    }

    const closeBgModal = () => {
        setShowLoading(false);
        setShowBgOverlay(false);
    }

    const DetailsTab = (det_id: string,offer_id: string, desc_id: string) => {
        let detDiv = document.getElementById(det_id) as HTMLDivElement;
        let offerDiv = document.getElementById(offer_id) as HTMLDivElement;
        let descDiv = document.getElementById(desc_id) as HTMLDivElement;
        detDiv.style.display = "block";
        offerDiv.style.display = "none";
        descDiv.style.display = "none";
    }

    const OffersTab = (det_id: string,offer_id: string, desc_id: string) => {
        let detDiv = document.getElementById(det_id) as HTMLDivElement;
        let offerDiv = document.getElementById(offer_id) as HTMLDivElement;
        let descDiv = document.getElementById(desc_id) as HTMLDivElement;
        detDiv.style.display = "none";
        offerDiv.style.display = "block";
        descDiv.style.display =  "none";
    }

    const DescsTab = (det_id: string,offer_id: string, desc_id: string) => {
        let detDiv = document.getElementById(det_id) as HTMLDivElement;
        let offerDiv = document.getElementById(offer_id) as HTMLDivElement;
        let descDiv = document.getElementById(desc_id) as HTMLDivElement;
        detDiv.style.display = "none";
        offerDiv.style.display = "none";
        descDiv.style.display =  "block";
        if (window.innerWidth <= 991) {
            descDiv.style.display =  "block";
        } else {
           
        }
    }

    const goBack = () => {
        router.back();
    }
  
  return (
    <>
    <Head>
        <title>NFT Art | {urltitleparams}</title>
        <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends'/>
    </Head>
    
      <div className={`${styles.main} ${theme === 'dark' ? styles['darktheme'] : styles['lighttheme']}`}>
        <div className={styles.goback}>
          <button type='button' title='button' onClick={goBack} style={{color: 'white'}}> {'< '} back</button> 
        </div>

        <div className={styles.main_bg_overlay}></div>
        <div><button onClick={goBack}>{<FaChevronLeft/>} back</button></div>
        {showloading && <Loading/>}
        {showBgOverlay && <BgOverlay onChange={closeBgModal}/>}
        {showAlertDanger && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
        {nftactionsuccess && 
            <ActionSuccessModal prop='Bidding ' onChange={closeActionModalComp}/>
        }
        {showbidmodal && 
            <div className={styles.bidnftitem}>
                <div className={styles.bidnftitem_c}>
                <div className={styles.bidnftitem_h}>
                    <div className={styles.hhd}>
                        <h1> Bid on {itemname}</h1>
                    </div>
                    <div>
                        <button type='button' onClick={closeBidItemModalDiv} style={{color: 'white'}}>{<FaXmark/>}</button>
                    </div>
                </div>
                <div className={styles.bidnftitem_c_in}>
                    <div>
                        <ul>
                            <li>
                                Minimum bid amount is <span style={{color: '#e28304'}}>{minbidamount}BNB</span>
                            </li>
                            <li>
                                Floor price is <span style={{color: '#e28304'}}>{itemprice}BNB</span>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.bidnftitem_c_ina}>
                        <div className={styles.list_tc}>
                            <label>Enter bid amount</label>
                            <input type='number' onChange={(e) => setBidPrice(e.target.value) } placeholder='20'/>
                        </div>
                    </div>
                    <div>
                        <button className={styles.createlistitem_} onClick={bidNFTs}>Bid</button>
                    </div>
                </div>
                </div>
            </div>
        }
          {nftLoaded &&
            <div className={styles.main_c}>
                <div className={` ${styles.nft_art} ${theme === 'dark' ? styles['darkmod'] : styles['lighttmod']}`}>
                    <div className={styles.nft_art_bg_overlay}></div>
                    <div className={styles.nft_art_}>
                        <div className={styles.nft_art_top}>
                            <div className={styles.nft_op}>
                                <div className={styles.nft_op_}>
                                    <Image src={bnblogo} alt='bnb logo' style={{width: '25px',height: '25px'}}/>
                                </div>
                                <div className={styles.nft_op_}>
                                    <button>{<FaHeart/>}</button>
                                </div>
                            </div>  
                        </div>
                        <div className={styles.nft_art_in}>
                            <Image src={nftauctItem!.image} alt='nft art' width={100} height={100} priority style={{objectFit: 'contain',width: '100%',height: 'inherit',marginTop: '0',borderBottomLeftRadius: '8px',borderBottomRightRadius: '8px'}}/>
                            <div className={styles.nft_desc0}>
                                <div className={styles.descp}>
                                    {<FaAlignJustify/>} <span>Description</span>
                                </div>
                                <div className={styles.descp_m}>
                                    <div className={styles.descp_m_in}>
                                        <span className={styles.by}>By</span> <span className={styles.fr}>{username == '' ? nftauctItem?.seller.substring(0, 12) + '...' : username.toUpperCase() } {<FaCircleCheck style={{fontSize: '16px',marginBottom: '2px',color: '#e28305'}}/>}</span>
                                    </div>
                                    <p>
                                        {nftauctItem?.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.nft_auctn}>
                    <div className={styles.nft_auctn_in}>
                        <div>
                            <div>
                            <h1> {nftauctItem?.description} <span style={{fontSize: '24px'}}><small>{nftauctItem?.seller.substring(0,8)+'...'}</small></span></h1>
                            </div>
                            <div className={styles.intro_p}>
                            <p>
                                Created By <span className={styles.createdby}>{username == '' ? nftauctItem?.seller.substring(0, 12) + '...' : username.toUpperCase() }</span>
                            </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.nft_auctbuy}>
                        {isauctionremainingtimeset &&
                            <div>
                                <div className={styles.sales_p}>
                                    <span>Sales ends </span> 
                                </div>
                                <div className={styles.timer}>
                                    <NFTCountdownTimer time={auctiontimeremaining}/>
                                </div> 
                            </div>
                        }
                        <div className={styles.nft_p}>
                            <div className={styles.cp}>
                                <span className={styles.cp_in}>Current price</span>
                            </div>
                            <div className={styles.ap}>
                                <span className={styles.ap_in}>{nftauctItem?.price?.toString()} BNB <span className={styles.ap_inp}>${`${bnbPrice?.toLocaleString() || ''}`}</span></span> 
                            </div>
                            <div className={styles.b_btns}>
                                <div>
                                    <button className={styles.b_btn} onClick={() => BuyNFT(nftauctItem?.itemId?.toString(),nftauctItem?.price?.toString())}><span>{<FaCartShopping/>}</span> Buy Now </button> 
                                </div>
                                <div>
                                    <button className={styles.b_btn1} onClick={() => openBidModal(nftauctItem?.tokenId?.toString(),nftauctItem?.itemId?.toString(),nftauctItem?.price?.toString(),nftauctItem?.minbidamount.toString(),nftauctItem?.name)}><span>{<FaCircleDollarToSlot/>}</span> Make Offer </button> 
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.tabc} ${theme === 'dark' ? styles['darkmod'] : styles['lighttmod']}`}>
                        <div className={`${styles.tabs}`}>
                            <div onClick={() => DetailsTab('nft_det','nft_offer','nft_desc')}>
                                {<FaTag/>} <span>Details </span> 
                            </div>
                            <div onClick={() => OffersTab('nft_det','nft_offer','nft_desc')}>
                                {<FaWandMagicSparkles/>} <span>Offers </span> 
                            </div>
                            <div onClick={() => DescsTab('nft_det','nft_offer','nft_desc')}>
                                {<FaAlignJustify/>} <span> Desc </span> 
                            </div>
                        </div>

                        <div className={styles.nft_det} id="nft_det">
                            <div className={styles.det_p}>
                                <div className={styles.det_p_in}>
                                    {<FaTag/>} <span>Details </span> 
                                </div>
                            </div>
                            <div className={styles.det_list}>
                                <div className={styles.lp}>
                                    <ul>
                                        <li>
                                            <div className={styles.li_det}>
                                                <div>
                                                    Contract Address
                                                </div>
                                                <div>
                                                    <a href={`https://testnet.bscscan.com/token/${nftauctItem?.owner}`} rel='noopener noreferrer'>{nftauctItem?.owner.substring(0,8)+'......'}</a>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={styles.li_det}>
                                                <div>
                                                    TokenId
                                                </div>
                                                <div>
                                                    {nftauctItem?.tokenId?.toString()}
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={styles.li_det}>
                                                <div>
                                                    Token Standard
                                                </div>
                                                <div>
                                                    BEP-20
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={styles.li_det}>
                                                <div>
                                                    Chain
                                                </div>
                                                <div>
                                                    Binance Smart Chain
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className={styles.nft_offer} id="nft_offer">
                            <div className={styles.offer_p}>
                                <div className={styles.offer_p_in}>
                                    {<FaWandMagicSparkles/>} <span>Offers </span> 
                                </div>
                            </div>
                            <div className={styles.offer_list}>
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
                        </div>

                        <div className={styles.nft_desc} id="nft_desc">
                            <div className={styles.descp}>
                                {<FaAlignJustify/>} <span>Description</span>
                            </div>
                            <div className={styles.descp_m}>
                                <div className={styles.descp_m_in}>
                                    <span className={styles.by}>By</span> <span className={styles.fr}> {username == '' ? nftauctItem?.seller.substring(0, 12) + '...' : username.toUpperCase() } {<FaCircleCheck style={{fontSize: '16px',marginBottom: '2px',color: '#e28305'}}/>}</span>
                                </div>
                                <p>
                                    {nftauctItem?.description}
                                </p>
                            </div>
                        </div>

                    </div>
                    
                </div>

                
                
            </div>
        }
      </div>
    </>
  );
}

export default NFTArt