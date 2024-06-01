import { BigNumber } from "ethers";

export interface GuessFootBallHeroMetadata {
    Id : BigNumber;
    gameId: BigNumber;
    amountplayed: BigNumber;
    rewardamount: BigNumber;
    time: BigNumber;
    played: BigNumber;
    level: BigNumber;
    wins: BigNumber;
    remaining: BigNumber;
    hint: [
        playername: string,
        playerimage: string
    ];
    walletaddress: string;
}