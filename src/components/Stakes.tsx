import React from 'react';
import { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
// import axios from 'axios';
import DappSideBar from './Dappsidebar';
// material
import { useUser } from '../contexts/UserContext';
import Loading from "./Loading";
// import AlertMessage from "./AlertMessage";
import dappstyles from "../styles/dapp.module.css";
import dappsidebarstyles from '../styles/dappsidebar.module.css';
import ConnectWallet from './ConnectWalletButton';
import CountdownTimer from './CountDownTimer';
import ReferralLink from './ReferralLink';
import AlertDanger from './AlertDanger';
import BgOverlay from './BgOverlay';
import ActionSuccessModal from './ActionSuccess';
import { ethers } from 'ethers';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import FRDAbi from '../../artifacts/contracts/FifaRewardToken.sol/FifaRewardToken.json';
import StakeAbi from '../../artifacts/contracts/FRDStaking.sol/FRDStaking.json';
import { ThemeContext } from '../contexts/theme-context';
import DappNav from './Dappnav';
import Head from 'next/head';
import axios from 'axios';
import FooterNavBar from './FooterNav';
import RewardsBadge from './RewardsBadge';
import { StakesMetadata } from './StakesMetaData';
import { FaAlignJustify, FaChevronDown, FaClock, FaXmark } from 'react-icons/fa6';

const Staking = () =>  {

  const router = useRouter();
  const { connectedaddress } = useUser();
  const FRDCA = process.env.NEXT_PUBLIC_FRD_DEPLOYED_CA;
  const StakeCA = process.env.NEXT_PUBLIC_FRD_STAKING_CA;
  console.log("FRD CA", FRDCA)
  const divRef = useRef<HTMLDivElement>(null);
  const { theme} = useContext(ThemeContext);
  const [isNavOpen, setNavOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [isSideBarToggled, setIsSideBarToggled] = useState(false)
  const [stakeactionsuccess, setActionSuccess] = useState(false);
  const [actionsuccessmessage, setActionSuccessMessage] = useState<string>('');
  const [dappsidebartoggle, setSideBarToggle] = useState(false);
  // const [dropdwnIcon1, setDropdownIcon1] = useState(<FaChevronDown size='22px' className={dappsidebarstyles.sidebarlisttoggle}/>);
  // const [dropdwnIcon2, setDropdownIcon2] = useState(<FaChevronDown size='22px' className={dappsidebarstyles.sidebarlisttoggle}/>);
  // const [dropdwnIcon3, setDropdownIcon3] = useState(<FaChevronDown size='22px' className={dappsidebarstyles.sidebarlisttoggle}/>);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");  
  const [_stakeId, setStakeId] = useState<number>(); 
  const [withdrawamount, setWithdrawAmount] = useState<any>();  
  const [estimatedprofit,setEstimatedProfit] = useState<number>();
  const [reward,setReward] = useState<any>();
  const [withdrawreward,setWithdrawReward] = useState<any>();
  const [staketimeremaining,setStakeTimeRemaining] = useState<number>();
  const [isstakeremainingtimeset,setIsStakeRemainingTimeSet] = useState<boolean>(false);
  const [showwithdrawmodal,setShowWithdrawModal] = useState<boolean>(false);
  const [usdequivfrdamount, setUsdEquivFrdAmount] = useState<number>(0);
  const [dollarequiv, setDollarEquiv] = useState<number>(0);
  const [dollarprice, setDollarPrice] = useState<number>(0);

  const [stakesloaded, setStakesLoaded] = useState<boolean>(false);
  const [stakesdata,setStakesData] = useState<StakesMetadata[]>([]);
  const [showBgOverlay,setShowBgOverlay] = useState<boolean>(false);
  const [showAlertDanger,setShowAlertDanger] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [earningprofitpercent, setEarningProfitPercent] = useState<any>(0.005);
  const [stakeAmount, setstakeAmount] = useState<any>(0);
  const [stakeduration, setstakeduration] = useState<any>(180);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<number[]>([]);
  // const [deltaX, setDeltaX] = useState(0);
  // const [draggedRangeIndex, setDraggedRangeIndex] = useState<number | null>(null);
  const [profitpercent, setProfitPercent] = useState<any>(0.005);
  
  // const { isOpen, onOpen, onClose, closeWeb3Modal,openWeb3Modal } = useContext(Web3ModalContext);
  const { walletProvider } = useWeb3ModalProvider();
  const { open } = useWeb3Modal();
  const [referralLink, setreferralLink] = useState('');
  const [buttonText, setButtonText] = useState("Copy");

  const minInput1 = 0;
  const maxInput1 = 1000000;
  const minInput2 = 180;
  const maxInput2 = 2360;
  const minProfitPercentage = 0.005;
  const maxProfitPercentage = 0.1;
  
  const handleCopyClick = () => {
   // Create a temporary textarea element
   const textArea = document.createElement('textarea');
   
   // Set the value of the textarea to the text you want to copy
   textArea.value = referralLink;

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

  // async function onSignMessage() {
  //   const provider = new ethers.providers.Web3Provider(walletProvider)
  //   const signer = provider.getSigner()
  //   const signature = await signer?.signMessage('Hello Web3Modal Ethers')
  //   console.log(signature)
  // }

  
  const StakeFRD = async (e: any) => {
    try {
      if(walletProvider) {
        

        const provider = new ethers.providers.Web3Provider(walletProvider as any)
        const signer = provider.getSigner();
        const StakeContract = new ethers.Contract(StakeCA!, StakeAbi, signer);
        const amt = stakeAmount + "000000000000000000";
        const stkamount = ethers.BigNumber.from(amt);
        const profpercent = profitpercent * 1000;

        try {
          const reslt = await StakeContract.stake(stkamount,stakeduration,profpercent,{gasLimit: 3000000});
          const receipt = await reslt.wait();

          if (receipt && receipt.status === 1) {
            // transaction success
              setShowLoading(false);
              setShowBgOverlay(false);
              setActionSuccess(true);
              setActionSuccessMessage('Stake ');
          }
        } catch (error: any) {
          console.log(error)
          setShowAlertDanger(true);
          seterrorMessage(error.code || error.message);
          setShowLoading(false);
        }

      }
        
    } catch (error:any) {
      console.log(error);
      setShowAlertDanger(true);
      seterrorMessage(error.message);
    }
  }

  const Approve = async (e: any) => {
    
    try {
      setShowLoading(true);
      setShowBgOverlay(true);
      if(walletProvider) {
        

        const provider = new ethers.providers.Web3Provider(walletProvider as any)
        const signer = provider.getSigner();
        const FRDContract = new ethers.Contract(FRDCA!, FRDAbi, signer);
        let transaction = await FRDContract.balanceOf(connectedaddress);
            
        let frdBal = ethers.utils.formatEther(transaction);
        
        if(stakeAmount < usdequivfrdamount) {
          setShowAlertDanger(true);
          seterrorMessage(`Minimum stake amount is ${(usdequivfrdamount).toLocaleString()} FRD ($10)`);
          setShowLoading(false);
          return;
        }else if(parseInt(frdBal) < usdequivfrdamount) {
          setShowAlertDanger(true);
          seterrorMessage(`You need a minimum of ${(usdequivfrdamount).toLocaleString()} FRD ($10) to stake`);
          setShowLoading(false);
          return;
        }else {
          const amt = stakeAmount + "000000000000000000";
          const stkamount = ethers.BigNumber.from(amt);
          const reslt = await FRDContract.approve(StakeCA,stkamount);
          if(reslt) {
            console.log("approve function",reslt)
            StakeFRD(e);
          }
        }
        
      }
    } catch (error:any) {
      console.log("approve error", error)
      setShowAlertDanger(true);
      seterrorMessage(error.code || error.message);
    }
    
  }


  const calculateReward = async (stakeId: number,e:any) => {
    try {
      let rwddiv = e.parentElement.parentElement.previousElementSibling;
      console.log("rwd div",rwddiv);

      setShowLoading(true);
      setShowBgOverlay(true);
      if(walletProvider) {
        

        const provider = new ethers.providers.Web3Provider(walletProvider as any);
        const signer = provider.getSigner();
        const StakeContract = new ethers.Contract(StakeCA!, StakeAbi, signer);
        const reslt = await StakeContract.calcReward(stakeId);
        console.log('calc reward error',reslt);
        setShowLoading(false);
        setShowBgOverlay(false);
        rwddiv.style.display = "block";
        setReward(reslt/10**18);
      }
    }catch(error: any) {
      console.log("reward error",error)
      setShowAlertDanger(true);
      seterrorMessage(error.code);
    }
    
  }

  // const calculateWithdrawReward = async (stakeId: number) => {
  //   try {
  //     if(isConnected) {
  //       if(walletProvider) {
  //         

  //         const provider = new ethers.providers.Web3Provider(walletProvider as any);
  //         const signer = provider.getSigner();
  //         const StakeContract = new ethers.Contract(StakeCA!, StakeAbi, signer);
  //         const reslt = await StakeContract.calcReward(stakeId);
  //         console.log('calc reward reslt',reslt);
  //         setWithdrawReward(reslt/10**18);
  //         setWithdrawAmount(reslt/10**18);
  //       }
  //     }else {
  //       open();
  //     }
  //   }catch(error: any) {
  //     console.log("reward error",error)
  //   }
    
  // }

  const estimateReward = async (e: any) => {
    try {
      setShowLoading(true);
      setShowBgOverlay(true);
      
      if(walletProvider) {
        

        let estdiv = e.parentElement.parentElement.previousElementSibling;
        const provider = new ethers.providers.Web3Provider(walletProvider as any);
        const signer = provider.getSigner();
        const StakeContract = new ethers.Contract(StakeCA!, StakeAbi, signer);
        const profpercent = profitpercent * 1000;
        const reslt = await StakeContract.EstimateReward(stakeAmount, stakeduration,profpercent);
        console.log('calc reward error',reslt);
        estdiv.style.display = "block";
        setEstimatedProfit(reslt);
        setShowLoading(false);
        setShowBgOverlay(false);
      }
    }catch(error: any) {
      console.log("eeroce",error)
      setShowAlertDanger(true);
      seterrorMessage(error.code);
    }
    
  }

  const getMaxWIthdrawAmount = async () => {
    try {
      if(walletProvider) {
        
        const provider = new ethers.providers.Web3Provider(walletProvider as any);
        const signer = provider.getSigner();
        const StakeContract = new ethers.Contract(StakeCA!, StakeAbi, signer);
        const reslt = await StakeContract.getMaxWithdrawAmount(stakeAmount, stakeduration,profitpercent);
        console.log('calc reward error',reslt);
        setWithdrawReward(reslt/10**18);
        setWithdrawAmount(reslt/10**18)
      }
      
    }catch(error: any) {
      // setShowAlertDanger(true);
      // seterrorMessage(error.code);
    }
  }

  const getMinWithdrawAmount_ = async (stakeId: number) => {
    try {
      if(walletProvider) {

        const provider = new ethers.providers.Web3Provider(walletProvider as any);
        const signer = provider.getSigner();
        const StakeContract = new ethers.Contract(StakeCA!, StakeAbi, signer);
        const reslt = await StakeContract.getMinWithdrawAmount(stakeId);
        console.log('min withd amt',reslt);
        console.log('min withd amt to no',reslt.toString()/(10**18));
        setWithdrawReward(reslt.toString()/10**18);
        setWithdrawAmount(reslt.toString()/10**18);
      }
      
    }catch(error: any) {
      // setShowAlertDanger(true);
      // seterrorMessage(error.code);
    }
  }

  

  const Withdraw = async (stakeId: number,e: any) => {
    try {
      setShowLoading(true);
      setShowBgOverlay(true);
      if(walletProvider) {
        
        
        const provider = new ethers.providers.Web3Provider(walletProvider as any);
        const signer = provider.getSigner();
        const StakeContract = new ethers.Contract(StakeCA!, StakeAbi, signer);
        console.log(" wi amt",withdrawamount);
        const withdamt = withdrawamount+ "000000000000000000";
        const wamount = ethers.BigNumber.from(withdamt);
        console.log(" wi amt sec",withdamt);
        const reslt = await StakeContract.withdrawStake(stakeId, wamount, {gasLimit: 1000000});
        
        reslt.wait().then(async (receipt:any) => {
          // console.log(receipt);
          if (receipt && receipt.status == 1) {
              // transaction success.
              setShowLoading(false);
              setShowBgOverlay(false);
              setActionSuccess(true);
              setActionSuccessMessage('Stake withdrawal ');
          }
        })
      }
    } catch (error: any) {
      console.log("err",error);
      setShowAlertDanger(true);
      seterrorMessage(error.code);
    }
  }

  
  useEffect(() => {
    
    const udetails = JSON.parse(localStorage.getItem("userInfo")!);
    
    if(udetails && udetails !== null && udetails !== "") {
      const username_ = udetails.username;  
      if(username_) {
        setUsername(username_);
      }
    }else {
      open()
    }

    // Calculate the profit percentage based on the new values of input1 and input2
    const calculateProfitPercentage = (val1: any, val2: any) => {
      const range1 = maxInput1 - minInput1;
      const range2 = maxInput2 - minInput2;

      const normalizedVal1 = (val1 - minInput1) / range1;
      const normalizedVal2 = (val2 - minInput2) / range2;

      // Calculate the profit percentage based on the normalized values
      const profitRange = maxProfitPercentage - minProfitPercentage;
      const newProfitPercentage: number = minProfitPercentage + (normalizedVal1 + normalizedVal2) / 2 * profitRange;
      
      let newpercent;
      if(newProfitPercentage < 0.1 ) {
        newpercent = newProfitPercentage.toFixed(3);
      }else {
        newpercent = newProfitPercentage.toFixed(1);
      }
      return newpercent;
    };

    const newProfitPercentage = calculateProfitPercentage(stakeAmount, stakeduration);
    
    setEarningProfitPercent(newProfitPercentage);
    setProfitPercent(newProfitPercentage);
  // Function to handle window resize
  const handleResize = () => {
      // Check the device width and update isNavOpen accordingly
      if (window.innerWidth <= 990) {
      setNavOpen(false);
      setSideBarToggle(true);
      setIsSideBarToggled(true);
      } else {
      setNavOpen(true);
      setSideBarToggle(false);
      setIsSideBarToggled(false);
      }
  };

  // Initial check when the component mounts
  handleResize();

  // Add a resize event listener to update isNavOpen when the window is resized
  window.addEventListener('resize', handleResize);

  // Clean up the event listener when the component unmounts

  const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
  };

  window.addEventListener('scroll', handleScroll);

  // Cleanup function to clear the interval, handlescroll and handleresize when the component is unmounted
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
  };
  
  
 }, [router,username,stakeAmount,stakeduration,walletProvider,isDragging,initialValues])

 useEffect(() => {
  const getUSDEQUIVFRDAMOUNT =  async () => {
    try {
      const config = {
        headers: {
            "Content-type": "application/json"
        }
      }  
      const {data} = await axios.get("../../../../api/gettokenprice", config);
      setDollarPrice(data.usdprice);
      setUsdEquivFrdAmount(data.usdequivalentfrdamount);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  getUSDEQUIVFRDAMOUNT();

  const getStakes = async () => {
    try {
      // setShowLoading(true);
      // setShowBgOverlay(true);
      if(walletProvider) {

        const provider = new ethers.providers.Web3Provider(walletProvider as any);
        const signer = provider.getSigner();
        const StakeContract = new ethers.Contract(StakeCA!, StakeAbi, signer);
        console.log("stajke contract",StakeContract)
        const stks = await StakeContract.loadUserStakes(connectedaddress);
        console.log('stake data',stks);
        await stks.forEach(async (element:any) => {
          if(element) {
            console.log("stake time",element.stakeDuration)
            let item: StakesMetadata = {
              stakeId: element.stakeId,
              rewardTime: element.rewardTime,
              stakeDuration: element.stakeDuration,
              profitpercent: element.profitpercent,
              stakeAmount: element.stakeAmount,
              currentstakeReward: element.currentstakeReward,
              stakeRewardPerDay: element.stakeRewardPerDay,
              totalstakeReward: element.totalstakeReward,
              totalReward: element.totalReward,
              isActive: element.isActive,
              stakerAddress: element.stakerAddress
            }
            const getstaketimeremaining = await StakeContract.getStakeRemainingTime(element.stakeId?.toNumber());
            console.log("remaining stake time",getstaketimeremaining);
            setStakeTimeRemaining(getstaketimeremaining.toNumber());
            console.log("st time oo",getstaketimeremaining.toNumber());
            setIsStakeRemainingTimeSet(true);
            stakesdata.push(item);
            setStakesData(stakesdata);
            setStakesLoaded(true);
            setShowLoading(false);
            return item;
          }
        });
      }
    }catch(error) {
      setShowAlertDanger(true);
      seterrorMessage("No active stake found");
    }
  }
  getStakes();
 },[connectedaddress])

 // Function to toggle the navigation menu
 const toggleSideBar = () => {
    setSideBarToggle(!dappsidebartoggle);
    setIsSideBarToggled(!isSideBarToggled);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    // setstakeAmount(newValue);
    setShowAlertDanger(true);
    seterrorMessage(`Stake amount is set from the duration, drag the duration input and amount will be automatically set`)
    console.log("stake mount range uipnput daragged")
  };

  const handleStakeDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    setstakeduration(newValue);

    // Calculate the proportional change for input1
    const input2Ratio = (newValue - minInput2) / (maxInput2 - minInput2);
    const newInput1Value = minInput1 + input2Ratio * (maxInput1 - minInput1);
    setDollarEquiv(Math.ceil(newInput1Value * dollarprice));
    setstakeAmount(Math.ceil(newInput1Value));
  };

  const closeWAlert = () => {
    setShowLoading(false);
    setShowBgOverlay(false);
  }

  const closeAlertModal = () => {
    setShowAlertDanger(false);
    setShowBgOverlay(false);
    setShowLoading(false);
  }

  const closeActionModalComp = () => {
    // let hiw_bgoverlay = document.querySelector('#hiw_overlay') as HTMLElement;
    // hiw_bgoverlay.style.display = 'none';
    setShowBgOverlay(false);
    setActionSuccess(false);
    router.reload()
  }

  const openwithdrawModalDiv = (stakeid: any, event: React.MouseEvent) => {
    event.preventDefault();
    setStakeId(stakeid);
    // calculateWithdrawReward(stakeid);
    getMinWithdrawAmount_(stakeid);
    setShowBgOverlay(true);
    setShowWithdrawModal(true);
    setTimeout(function() {
      if(divRef.current) {
        divRef.current.focus()
      }
    }, 2000);
  }

  const closewithdrawModalDiv = () => {
    setShowBgOverlay(false);
    setShowLoading(false);
    setShowWithdrawModal(false);
  }

  const closeBgModal = () => {
    setShowLoading(false);
    setShowBgOverlay(false);
  }

const sideBarToggleCheck = dappsidebartoggle ? dappstyles.sidebartoggled : '';

  return (
    <>
        <Head>
            <title> Stake | FifaReward</title>
            <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
        </Head>
        <DappNav/>
        
        <div className={`${dappstyles.main_w} ${theme === 'dark' ? dappstyles['darktheme'] : dappstyles['lighttheme']}`}>
            <div className={dappstyles.main_c}>
              <div className={`${dappstyles.sidebar} ${sideBarToggleCheck}`}>
                  <DappSideBar onChange={toggleSideBar}/>
              </div>
              <div className={`${dappstyles.main} ${sideBarToggleCheck}`}>
              <div className={dappstyles.con_btns}>
                  <ConnectWallet />
              </div>
              <button title='togglebtn' className={dappstyles.sidebar_toggle_btn} type='button' onClick={toggleSideBar}>
                <FaAlignJustify size={28} color='#f1f1f1' className={dappstyles.navlisttoggle}/> 
              </button>
              <div>
                <RewardsBadge />
              </div>
              <div>
                <ReferralLink />
              </div>
              {stakeactionsuccess && 
                  <ActionSuccessModal prop={actionsuccessmessage} onChange={closeActionModalComp}/>
              }
              {showLoading && <Loading />}
              {showBgOverlay && <BgOverlay onChange={closeBgModal}/>}
              {showAlertDanger && <AlertDanger errorMessage={errorMessage} onChange={closeAlertModal} />}
              {showwithdrawmodal && 
                <div className={dappstyles.width_stake} ref={divRef} tabIndex={-1}>
                  <div className={dappstyles.width_stake_c}>
                    <div className={dappstyles.width_stake_h}>
                        <div>
                          
                        </div>
                        <div>
                          <h1> Withdraw Stake </h1>
                        </div>
                        <div>
                          <button type='button' onClick={closewithdrawModalDiv}>{<FaXmark />}</button>
                        </div>
                    </div>
                    <div className={dappstyles.width_stake_c_in}>
                        <div className={dappstyles.width_stake_c_ina}>
                            <div className={dappstyles.list_tc}>
                              <div className={dappstyles.labelc}>
                                <div>
                                  <label>Withdraw Amount(FRD)</label>
                                </div>
                                <div>Available {withdrawreward} FRD</div>
                              </div>
                              <input type='number' onChange={(e) => setWithdrawAmount(e.target.value) } value={withdrawamount} placeholder='20'/>
                              <div className={dappstyles.wbtn}>
                                {staketimeremaining! > 0 ? <button onClick={getMaxWIthdrawAmount} className={dappstyles.maxwithdbtn}>Max</button> : '' }
                              </div>
                            </div>
                        </div>
                        <div>
                          <button className={dappstyles.createlistitem_} onClick={(e) => Withdraw(_stakeId!,e)}>Withdraw</button>
                        </div>
                    </div>
                  </div>
              </div>
              }
                <div className={dappstyles.stk_h1}><h1>Stake FRD</h1></div>
                <div className={dappstyles.stk_p}>
                    <div className={`${dappstyles.stake}`}>
                        <div className={`${dappstyles.stake_mod}`}>
                            <div className={dappstyles.top}><h1>Stake FRD</h1></div>
                            <div className={dappstyles.s_m}>
                              <h3>Earn more FRD through staking</h3>
                              <div className={dappstyles.s_m_in }>
                                  <div className={dappstyles.s_m_inna}>
                                    <div><label>Stake Amount</label><span className={dappstyles.stkamt_p}> {stakeAmount.toLocaleString()} FRD</span> ${dollarequiv.toLocaleString()+'.00'}</div>
                                    <div className={dappstyles.amountprog}>
                                      <input title='input'
                                        type="range"
                                        id="horizontalInputforamount"
                                        min={minInput1}
                                        max={maxInput1}
                                        step={1}
                                        value={stakeAmount}
                                        onChange={handleChange}
                                        style={{ width: '100%',height: '5px', cursor: 'pointer', backgroundColor: 'orange' , color: 'orange'}}
                                      />
                                    </div>
                                  </div>
                                  <div className={dappstyles.s_m_inna}>
                                    <div><label>Stake Duration</label><span className={dappstyles.stkdur_p}> {stakeduration.toLocaleString()} Days</span> <span className={dappstyles.stkdur_y}> {(stakeduration/365).toFixed(1)} Years</span></div>
                                    <div className={dappstyles.amountprog}>
                                      <input title='input'
                                        type="range"
                                        id="horizontalInputforstake"
                                        min={minInput2}
                                        max={maxInput2}
                                        step={2}
                                        value={stakeduration}
                                        onChange={handleStakeDuration}
                                        style={{ width: '100%',height: '5px', cursor: 'pointer', backgroundColor: 'orange', color: 'orange' }}
                                      />
                                    </div>
                                    <div className={dappstyles.s_m_in_c}>
                                        <div className={dappstyles.s_a}>Expected Earning</div>
                                        <div className={dappstyles.s_b}> {earningprofitpercent}% daily</div>
                                    </div>
                                    {/* <div className={dappstyles.s_m_in_c}>
                                        <div className={dappstyles.s_a}>
                                          <select title='select' onChange={handleStakeDuration}>
                                            <option value="">Select Duration</option>
                                            <option value="30">30 Days</option>
                                            <option value="90">90 Days</option>
                                            <option value="365">365 Days</option>
                                            <option value="1000">1000 Days</option>
                                          </select>
                                        </div>
                                    </div> */}
                                  </div>

                                  {/* <div className={dappstyles.interest_returns}>
                                    <ul>
                                      <li>
                                        <div className={dappstyles.ir_c}>
                                          <div>INTEREST</div> <div>FRD REWARD</div>
                                        </div>
                                      </li>
                                      <li>
                                        <div className={dappstyles.ir_c}>
                                          <div>Daily</div> <div>2%</div>
                                        </div>
                                      </li>
                                      <li>
                                        <div className={dappstyles.ir_c}>
                                          <div>Weekly</div><div>14%</div>
                                        </div>
                                      </li>
                                      <li>
                                        <div className={dappstyles.ir_c}>
                                          <div>Monthly</div> <div>60%</div>
                                        </div>
                                      </li>
                                      <li>
                                        <div className={dappstyles.ir_c}>
                                          <div>Yearly</div><div>730%</div>
                                        </div>
                                      </li>
                                    </ul>
                                  </div> */}

                                  <div className={dappstyles.cw_btn_div}>
                                      <div className={dappstyles.estprof}>Estimated profit: <span>{estimatedprofit?.toLocaleString()}</span> FRD ${`${(Math.ceil(Number(estimatedprofit?.toString()) * Number(dollarprice))).toLocaleString()}`} </div>
                                      <div className={dappstyles.st_btns}>
                                          <div>
                                              <button type='button' className={dappstyles.stakebtn} onClick={(e) => Approve(e.target)}>Stake</button>
                                          </div>
                                          <div>
                                              <button type='button' className={dappstyles.estrwd} onClick={(e) => estimateReward(e.target)}>Estimate Reward</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
                  {/* end of stake conntainer */}

                  <div className={dappstyles.stk_h1}><h1>My Stakes</h1></div>
                  {stakesloaded && stakesdata.length > 0 ?
                      <div className={dappstyles.stake_p}>

                          {stakesdata.map((stake,index) => (
                            <div className={`${dappstyles.stake}`} key={index}>
                              <div className={`${dappstyles.stake_mod}`}>
                                  <div className={dappstyles.top}><h1>Stake</h1></div>
                                  <div className={dappstyles.s_m}>
                                    {isstakeremainingtimeset && 
                                          <>
                                            <div className={dappstyles.staketimer}> <FaClock style={{marginRight: '5px',marginTop: '2px'}}/> <CountdownTimer time={staketimeremaining} /></div>
                                          </>
                                        }
                                    <div className={dappstyles.s_m_in }>
                                        <div className={dappstyles.cw_btn_div}>
                                            <div className={dappstyles.crwd}>Reward: <span>{Math.ceil(reward?.toString())}</span> FRD ${`${(Math.ceil(Number(reward?.toString()) * Number(dollarprice))).toLocaleString()}`} </div>
                                            <div className={dappstyles.st_btns}>
                                                <div>
                                                    <button type='button' className={dappstyles.calcrwd} onClick={(e) => calculateReward(stake.stakeId.toNumber(),e.target)}>Calc Reward</button>
                                                </div>

                                                <div>
                                                  <button type='button' className={dappstyles.withd} onClick={(e) => openwithdrawModalDiv(stake.stakeId.toNumber(),e)}>Withdraw</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                  </div>
                              </div>
                          </div>
                          ))}
                      </div> :
                      <div className={dappstyles.notfound_p}>
                        <div className={dappstyles.notfound}>No stakes found, stake FRD and see all your stakes here!</div>
                      </div>
                    }
              </div>
            </div>
        </div>
        {/* {isOpen && (<SelectWalletModal isOpen={isOpen} closeWeb3Modal={closeWeb3Modal} />)} */}
        {/* <DappFooter /> */}
        <FooterNavBar />
    </>
  );
}

export default Staking