import { NextApiRequest, NextApiResponse } from 'next';

let pancakeSwapAbi =  [
    {"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},
    ];
    let tokenAbi = [
    {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    ];

    import Web3 from 'web3';
    
    /*
    Required Node.js
    -- Web3 Token Charting --
    Checkout my repo about building a clone of poocoin/dextools on bsc/pancakeswap and on any other similar chain/dex
    https://github.com/Linch1/Web3TokenCharting
    -- Usage --
    1. Make a directory on your pc
    2. Open a terminal 
    3. go inside the created directory
    4. run : npm init
    5. run : npm i --save web3
    6. Create a file: tokenPrice.js
    7. Copy this text inside that file
    8. run: node tokenPrice.js
    -- Direct contact --
    https://www.reddit.com/user/Linch-1
    */
    
    
    let pancakeSwapContract = "0x10ED43C718714eb63d5aA57B78B54704E256024E".toLowerCase();
    
    async function calcSell( tokensToSell: any, tokenAddres: any){
        const web3 = new Web3("https://bsc-dataseed1.binance.org");
        const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //BNB
    
        let tokenRouter = await new web3.eth.Contract( tokenAbi, tokenAddres );
        let tokenDecimals = await tokenRouter.methods.decimals().call();
        
        tokensToSell = setDecimals(tokensToSell, tokenDecimals);
        let amountOut;
        try {
            let router = await new web3.eth.Contract( pancakeSwapAbi, pancakeSwapContract );
            amountOut = await router.methods.getAmountsOut(tokensToSell, [tokenAddres ,BNBTokenAddress]).call();
            amountOut =  web3.utils.fromWei(amountOut as any,'ether');
        } catch (error) {}
        
        if(!amountOut) return 0;
        return amountOut;
    }
    async function calcBNBPrice(){
        const web3 = new Web3("https://bsc-dataseed1.binance.org");
        const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //BNB
        const USDTokenAddress  = "0x55d398326f99059fF775485246999027B3197955" //USDT
        let bnbToSell = web3.utils.toWei("1", "ether") ;
        let amountOut;
        try {
            let router = await new web3.eth.Contract( pancakeSwapAbi, pancakeSwapContract );
            amountOut = await router.methods.getAmountsOut(bnbToSell, [BNBTokenAddress ,USDTokenAddress]).call() as any;
            amountOut =  web3.utils.fromWei(amountOut[1] as any,'ether');
        } catch (error) {}
        if(!amountOut) return 0;
        return amountOut;
    }
    function setDecimals( number: any, decimals: any ){
        number = number.toString();
        let numberAbs = number.split('.')[0]
        let numberDecimals = number.split('.')[1] ? number.split('.')[1] : '';
        while( numberDecimals.length < decimals ){
            numberDecimals += "0";
        }
        return numberAbs + numberDecimals;
    }
    /*
    How it works?
    This script simply comunicates with the smart contract deployed by pancakeswap and calls the main
    function that was build to retrive the token prices
    */
    (async () => {
        
    })();

    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
        // Handle HTTP requests here
        if (req.method === 'GET') {
            const tokenAddres = '0x6fe537b0ba874eab212bb8321ad17cf6bb3a0afc'; // change this with the token addres that you want to know the 
            let bnbPrice: number = await calcBNBPrice() as number// query pancakeswap to get the price of BNB in USDT
            console.log(`CURRENT BNB PRICE: ${bnbPrice}`);
            // Them amount of tokens to sell. adjust this value based on you need, you can encounter errors with high supply tokens when this value is 1.
            let tokens_to_sell = 1; 
            let priceInBnb: number = await calcSell(tokens_to_sell, tokenAddres) as number/(tokens_to_sell); // calculate TOKEN price in BNB
            console.log( 'SHIT_TOKEN VALUE IN BNB : ' + priceInBnb + ' | Just convert it to USD ' );
            console.log(`SHIT_TOKEN VALUE IN USD: ${priceInBnb*bnbPrice}`); // convert the token price from BNB to USD based on the retrived BNB value
            res.status(200).json({ /* Response data */ });
        } else {
            // Handle other HTTP methods
            res.status(405).json({ message: 'Method Not Allowed' });
        }
    }