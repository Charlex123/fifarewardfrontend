import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';

let pancakeSwapAbi =  [
    {"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},
    ];
    let tokenAbi = [
        {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"dexPool","type":"address"}],"name":"addDexPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"buyFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"exemptFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"feeAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"maxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"dexPool","type":"address"}],"name":"removeDexPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sellFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxTxAmount","type":"uint256"}],"name":"setMaxTxAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"transferFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_buyFee","type":"uint256"},{"internalType":"uint256","name":"_sellFee","type":"uint256"},{"internalType":"uint256","name":"_transferFee","type":"uint256"}],"name":"updateFees","outputs":[],"stateMutability":"nonpayable","type":"function"}
        ];

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
    
    let usdequiv = 10;

    async function calcSell( tokensToSell: any, tokenAddres: any){
        const web3 = new Web3("https://bsc-dataseed1.binance.org");
        const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //BNB
    
        let tokenRouter = await new web3.eth.Contract( tokenAbi, tokenAddres );
        let tokenDecimals = await tokenRouter.methods.decimals().call();
        
        tokensToSell = setDecimals(tokensToSell, tokenDecimals);
        let amountOut;
        try {
            let router = await new web3.eth.Contract( pancakeSwapAbi, pancakeSwapContract );
            amountOut = await router.methods.getAmountsOut(tokensToSell, [tokenAddres ,BNBTokenAddress]).call() as any;
            amountOut =  web3.utils.fromWei(amountOut[1] as any,'ether');
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

    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
        // Handle HTTP requests here
        if (req.method === 'GET') {
            const tokenAddres = '0x6fe537b0ba874eab212bb8321ad17cf6bb3a0afc'; // change this with the token addres that you want to know the 
            let bnbPrice: number = await calcBNBPrice() as number// query pancakeswap to get the price of BNB in USDT
            console.log(`CURRENT BNB PRICE: ${bnbPrice}`);
            // Them amount of tokens to sell. adjust this value based on you need, you can encounter errors with high supply tokens when this value is 1.
            let tokens_to_sell = 1; 
            let priceInBnb: number = await calcSell(tokens_to_sell, tokenAddres) as number/(tokens_to_sell); // calculate TOKEN price in BNB
            console.log( 'FRD VALUE IN BNB : ' + priceInBnb + ' | Just convert it to USD ' );
            console.log(`FRD VALUE IN USD: ${priceInBnb*bnbPrice}`); // convert the token price from BNB to USD based on the retrived BNB value
            res.status(200).json({ bnbprice: priceInBnb, usdprice: priceInBnb*bnbPrice, usdequivalentfrdamount: Math.floor(usdequiv/(priceInBnb*bnbPrice)) });
        } else {
            // Handle other HTTP methods
            res.status(405).json({ message: 'Method Not Allowed' });
        }
    }