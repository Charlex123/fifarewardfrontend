import { useContext,useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Loading from "./Loading";
import AlertMessage from "./AlertMessage";
import regstyles from "../styles/addguessfootballherodata.module.css";
import { ThemeContext } from '../contexts/theme-context';
// component
import Head from 'next/head';
import { useWeb3Modal } from '@web3modal/ethers5/react';
// import { faLock } from '@fortawesome/free-solid-svg-icons';

// ----------------------------------------------------------------------
// library.add(faEye, faEyeSlash);
const AddGuessFootballHeroData = () =>  {

  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);  
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const { open } = useWeb3Modal();
  const [name, setName] = useState("");
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hint, setHint] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  //   const [accounts, setAccounts] = useState([]);

//   const isConnected = Boolean(accounts[0]);

    useEffect(() => {
      const udetails = JSON.parse(localStorage.getItem("userInfo")!);
      if(!udetails) {
        open()
      }else {
        
      }
    },[])

    
  const checkName = async (e:any) => {
    setLoading(true);
    setName(e.target.value)
    console.log(name)
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    }
    const {data} = await axios.post("https://fifarewardbackend-1.onrender.com/api/players/checkname", {
          name,
    }, config);
    console.log("dera",data)
    if(data) {
      setLoading(false);
      setError(true)
      setErrorMessage(data.message)
    }
  }


  const submitHandler = async (e:any) => {
    e.preventDefault();
    console.log('name',name)
    if(file && name && hint) {
        setError(false);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('https://fifarewardbackend-1.onrender.com/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            });

            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }  
            const image = response.data.url;
            const dresponse = await axios.post('https://fifarewardbackend-1.onrender.com/api/players/addplayer', {
                name,
                image,
                hint
            }, config);
            if(dresponse) {
                setError(true);
                setErrorMessage("Successfully added ")
            }else {
                console.log("data res",dresponse)
            }
        } catch (error: any) {
            console.log("errrrr",error.message)
            setLoading(false);
            setError(true)
            setErrorMessage(error.message)
        }
    }else {
        setError(true);
        setErrorMessage("Enter all fields")
    }
}

const updateHandler = async (e:any) => {
    e.preventDefault();
    console.log('name',name)
    if(file && name && hint) {
        setError(false);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('https://fifarewardbackend-1.onrender.com/uploadplayerimage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            });

            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }  
            const image = response.data.fullUrl;
            console.log("res pom",response.data.fullUrl)
            const data = await axios.post('https://fifarewardbackend-1.onrender.com/api/players/updateplayer', {
                name,
                image,
                hint
            }, config);
            if(data) {
                setError(true);
                setErrorMessage("Success ")
            }
        } catch (error: any) {
            setLoading(false);
            setError(true)
            setErrorMessage(error.message)
        }
    }else {
        setError(true);
        setErrorMessage("Enter all fields")
    }
}

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
    
  };

const closeAlertModal = () => {
  setError(false)
}

const goBack = () => {
  router.back();
}

  return (
    <>
        <Head>
            <title>Add Player Data | Fifareward</title>
            <meta name='description' content='FifaReward | Bet, Stake, Mine and craeate NFTs of football legends, fifa reward a layer2/layer 3 roll up'/>
        </Head>
        <div className={`${regstyles.main} ${theme === 'dark' ? regstyles['darktheme'] : regstyles['lighttheme']}`}>
            <button type='button' title='button' className={regstyles.back} onClick={goBack}> {'<<'} Back</button>
            
            <div>
                <form className={regstyles.formTag} onSubmit={submitHandler}>
                
                {error && <AlertMessage errorMessage={errorMessage} onChange={closeAlertModal} />}
                {loading && <Loading />}
                
                <div className={regstyles.fhead}>
                    <h3>Add Player Data </h3>
                </div>
                
                <div className={regstyles.form_group}>
                    <label className={regstyles.formlabel} htmlFor="grid-last-name">Player Full Name</label>
                    <input className={regstyles.forminput} id="grid_user_name" type="varchar" placeholder="Enter player full name" required
                      value={name}
                      onBlur={checkName}
                      onChange={(e) => setName(e.target.value)}
                      />
                </div>
                <div className={regstyles.form_group}>
                    <label className={regstyles.formlabel}>Enter player hint</label>
                    <textarea onChange={(e) => setHint(e.target.value)} className={regstyles.textarea}></textarea>
                </div>
                <div className={regstyles.form_group}>
                    <label>Upload Player Picture</label>
                    <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*,video/*"
                            ref={fileInputRef}
                        />
                </div>
                <div className={regstyles.btns}>
                  <button className={regstyles.registerButton} type="submit">
                    Add Player
                  </button>
                </div>
              </form>
          </div>

          <div>
              <form className={regstyles.formTag} onSubmit={updateHandler}>
                
                {error && <AlertMessage errorMessage={errorMessage} onChange={closeAlertModal} />}
                {loading && <Loading />}
                
                <div className={regstyles.fhead}>
                    <h3>Update Player Data </h3>
                </div>
                
                <div className={regstyles.form_group}>
                    <label className={regstyles.formlabel} htmlFor="grid-last-name">Player Full Name</label>
                    <input className={regstyles.forminput} id="grid_user_name" type="varchar" placeholder="Enter player full name" required
                      value={name}
                      onBlur={checkName}
                      onChange={(e) => setName(e.target.value)}
                      />
                </div>
                <div className={regstyles.form_group}>
                    <label className={regstyles.formlabel}>Enter player hint</label>
                    <textarea onChange={(e) => setHint(e.target.value)} className={regstyles.textarea}></textarea>
                </div>
                <div className={regstyles.form_group}>
                    <label>Upload Player Picture</label>
                    <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*,video/*"
                            ref={fileInputRef}
                        />
                </div>
                <div className={regstyles.btns}>
                  <button className={regstyles.registerButton} type="submit">
                    Update Player
                  </button>
                </div>
              </form>
          </div>
          
        </div>
    </>
  );
}

export default AddGuessFootballHeroData