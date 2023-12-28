import React, { useEffect } from 'react';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronLeft  } from "@fortawesome/free-solid-svg-icons";
import dotenv from 'dotenv';
dotenv.config();
// material
// component

function loadBets () {
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
    // console.log(' hopa in')
//     console.log('api key',process.env.API_SPORTS)
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
        <div>Hello</div>
    </>
  );
}

export default loadBets
