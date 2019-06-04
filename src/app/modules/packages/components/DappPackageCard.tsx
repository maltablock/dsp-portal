import React from 'react';
import { observer } from 'mobx-react';

import DappPackage from '../state/DappPackage';
import PackageCard from './PackageCard';

type Props = {
  dappPackage: DappPackage
}

const DappPackageCard = ({ dappPackage }: Props) => {
  const p = dappPackage;

  return (
    <PackageCard
      package={dappPackage}
      details={[
        { label: 'Quota', value: p.data.quota },
        { label: 'Min Stake', value: p.data.min_stake_quantity },
        { label: 'Unstake time', value: p.unstakeTimeText }
      ]}
      input={{
        placeholder: `Stake Amount ${p.data.min_stake_quantity.split(` `)[0]}`,
      }}
      button={{
        text: 'Stake',
        onClick: p.packageStore.handleStake,
      }}
    />
  )
}

export default observer(DappPackageCard);
