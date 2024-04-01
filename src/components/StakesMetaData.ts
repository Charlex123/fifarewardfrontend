import { BigNumber } from "ethers";

export interface StakesMetadata {
    stakeId: BigNumber,
    rewardTime: BigNumber,
    stakeDuration: BigNumber,
    profitpercent: BigNumber,
    stakeAmount: BigNumber,
    currentstakeReward: BigNumber,
    stakeRewardPerDay: BigNumber,
    totalstakeReward: BigNumber,
    totalReward: BigNumber,
    isActive: boolean,
    stakerAddress: string
}