import { BigNumber } from "ethers";

export interface BetConditions {
    username: string;
    betamount: BigNumber;
    predictioncount: BigNumber;
    hasjoinedthisbet: boolean;
    prediction: string;
    bettingteam: string;
  }