import React from 'react';
import { observer } from 'mobx-react';

import StakedPackage from '../state/StakedPackage';
import PackageCard from './PackageCard';
import { formatAsset } from 'app/shared/eos';

type Props = {
  stakedPackage: StakedPackage
}

const formatUnstakePeriod = seconds => {
  const hours = (seconds / 3600).toFixed(2)
  const postfix = hours == `1.00` ? `Hour` : `Hours`
  return `${hours} ${postfix}`
}

const StakedPackageCard = ({ stakedPackage }: Props) => {
  const p = stakedPackage;

  return (
    <PackageCard
      package={stakedPackage}
      details={[
        {
          label: 'Amount Staked:',
          value: formatAsset({ amount: p.data.balance, symbol: p.data.symbol }),
        },
        {
          label: 'Unstake Time:',
          value: formatUnstakePeriod(p.minUnstakePeriod),
        }
      ]}
      input={{
        placeholder: "UnStake Amount",
      }}
      button={{
        text: 'UnStake',
        onClick: p.packageStore.handleUnstake,
      }}
    />
  )
}

export default observer(StakedPackageCard);
