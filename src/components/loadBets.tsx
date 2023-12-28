import React, { useEffect } from 'react';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronLeft  } from "@fortawesome/free-solid-svg-icons";
import dotenv from 'dotenv';
dotenv.config();
// material
// component

function LoadBets () {
  try {

    // var config = {
    //   method: 'get',
    //   url: 'https://v3.football.api-sports.io/leagues',
    //   headers: {
    //     'x-rapidapi-key': 'aa2a3bb1320411e0c7ad474b053c6514',
    //     'x-rapidapi-host': 'v3.football.api-sports.io'
    //   }
    // };
    
    // axios(config)
    // .then(function (response:any) {
    //   console.log(JSON.stringify(response.data));
    //   return 
    // })
    // .catch(function (error:any) {
    //   console.log(error);
    // });
}catch(error) 
{
  console.log(error)
}

  useEffect(() => {
//     console.log('api key',process.env.NEXT_PUBLIC_API_SPORTS)
//     try {

//       // var config = {
//       //   method: 'get',
//       //   url: 'https://v3.football.api-sports.io/leagues',
//       //   headers: {
//       //     'x-rapidapi-key': 'aa2a3bb1320411e0c7ad474b053c6514',
//       //     'x-rapidapi-host': 'v3.football.api-sports.io'
//       //   }
//       // };
      
//       // axios(config)
//       // .then(function (response:any) {
//       //   console.log(JSON.stringify(response.data));
//       //   return 
//       // })
//       // .catch(function (error:any) {
//       //   console.log(error);
//       // });
//   }catch(error) 
//   {
//     console.log(error)
//   }
})

  return (
    <>
        <div style={{color: 'white'}}>Hello</div>
    </>
  );
}

export default LoadBets
