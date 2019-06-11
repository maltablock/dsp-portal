import { decomposeAsset } from 'app/shared/eos';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';

export type AccountExtRow = {
  id: number;
  account: string;
  balance: string;
  symbol: string;
  last_reward: string;
  last_usage: string;
  package: string;
  package_end: string;
  package_started: string;
  pending_package: string;
  provider: string;
  quota: string;
  service: string;
};

export type StakingTableRow = {
  id: number;
  account: string;
  balance: string;
  provider: string;
  service: string;
};

export type RefundsTableRow = {
  id: number;
  account: string;
  amount: string;
  provider: string;
  service: string;
  unstake_time: string;
};

type StakedPackagesFetchResults = {
  accountExtResults: AccountExtRow[];
  stakesDappHodlResults: StakingTableRow[];
  stakesAccountResults: StakingTableRow[];
  refundsDappHodlResults: RefundsTableRow[];
  refundsAccountResults: RefundsTableRow[];
};

const transformRefundObject = (refund?: RefundsTableRow) => {
  if (refund) {
    return {
      amount: decomposeAsset(refund.amount).amount,
      unstake_time: new Date(Number.parseInt(refund.unstake_time)),
    };
  }
  return undefined;
};

export const aggregateStackedPackagesData = ({
  accountExtResults,
  stakesDappHodlResults,
  stakesAccountResults,
  refundsDappHodlResults,
  refundsAccountResults,
}: StakedPackagesFetchResults) => {
  const groupedStakesAccount = groupBy(stakesAccountResults, s => `${s.provider}|${s.service}`);
  const groupedStakesDappHodl = groupBy(stakesDappHodlResults, s => `${s.provider}|${s.service}`);
  const groupedRefundsAccount = groupBy(refundsAccountResults, s => `${s.provider}|${s.service}`);
  const groupedRefundsDappHodl = groupBy(refundsDappHodlResults, s => `${s.provider}|${s.service}`);

  return accountExtResults.map(stake => {
    const identifier = `${stake.provider}|${stake.service}`;
    const { amount: balance, symbol } = decomposeAsset(stake.balance);
    const { amount: quota } = decomposeAsset(stake.quota);

    const stakingBalanceFromSelf: number = decomposeAsset(
      get(groupedStakesAccount, `${identifier}.0.balance`, `0.0000 DAPP`) as string,
    ).amount;
    const stakingBalanceFromSelfDappHdl: number = decomposeAsset(
      get(groupedStakesDappHodl, `${identifier}.0.balance`, `0.0000 DAPP`) as string,
    ).amount;

    let refundFromSelf = transformRefundObject(
      get(groupedRefundsAccount, `${identifier}.0`, undefined) as any,
    );
    let refundFromSelfDappHdl = transformRefundObject(
      get(groupedRefundsDappHodl, `${identifier}.0`, undefined) as any,
    );

    const data = {
      ...stake,
      balance,
      symbol,
      quota,
      icon: '',
      stakingBalanceFromSelf,
      stakingBalanceFromSelfDappHdl,
      refundFromSelf,
      refundFromSelfDappHdl,
    };

    return data;
  });
};
