import { BigNumber } from "ethers";

export interface Bets {
    betId: BigNumber,
    matchId: BigNumber,
    uniquebetId: BigNumber,
    betamount: number,
    matchfixture: string,
    openedBy: string,
    totalbetparticipantscount: BigNumber,
    remainingparticipantscount: BigNumber,
    betstatus: string,
    participants: string,
    betwinners: string,
    betlosers: string
  }