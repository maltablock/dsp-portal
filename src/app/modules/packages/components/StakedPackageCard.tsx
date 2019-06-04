import React from 'react';
import { observer } from 'mobx-react';

import StakedPackage from '../state/StakedPackage';
import PackageCard from './PackageCard';
import { formatAsset } from 'app/shared/eos';

type Props = {
  stakedPackage: StakedPackage
}

const StakedPackageCard = ({ stakedPackage }: Props) => {
  const p = stakedPackage;

  return (
    <PackageCard
      package={stakedPackage}
      details={[
        {
          label: 'Amount Staked',
          value: formatAsset({ amount: p.data.balance, symbol: p.data.symbol }),
        }
        // TODO: we also need to provide unstake time
        // but there's no such data for staked packages
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
