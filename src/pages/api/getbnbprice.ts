import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';

let pancakeSwapAbi =  [
    {"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},
    ];
   

    
    let pancakeSwapContract = "0x10ED43C718714eb63d5aA57B78B54704E256024E".toLowerCase();
    
    async function calcBNBPrice(){
        const web3 = new Web3("https://bsc-dataseed1.binance.org");
        const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //BNB
        const USDTokenAddress  = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //USDT
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
    
    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
        // Handle HTTP requests here
        if (req.method === 'GET') {
            let bnbPrice: number = await calcBNBPrice() as number// query pancakeswap to get the price of BNB in USDT
            console.log(`CURRENT BNB PRICE: ${bnbPrice}`);
            // Them amount of tokens to sell. adjust this value based on you need, you can encounter errors with high supply tokens when this value is 1.
            
            res.status(200).json({ bnbprice: bnbPrice});
        } else {
            // Handle other HTTP methods
            res.status(405).json({ message: 'Method Not Allowed' });
        }
    }