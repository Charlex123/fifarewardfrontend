import { BigNumber } from "ethers";

export interface BetConditions {
    username: string;
    betamount: BigNumber;
    predictioncount: BigNumber;
    useraddress: string;
    hasjoinedthisbet: boolean;
    prediction: string;
    bettingteam: string;
  }