import { BigNumber } from "ethers";

export interface Bets {
    betId: BigNumber,
    matchId: BigNumber,
    username: string,
    matchfixture: string,
    openedBy: string,
    participant: string,
    betamount: number,
    totalbetparticipantscount: BigNumber,
    remainingparticipantscount: BigNumber,
    prediction: string,
    bettingteam: string,
    betstatus: string,
    participants: string,
    betwinners: string,
    betlosers: string
  }