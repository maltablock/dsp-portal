import React from 'react';
import { observer } from 'mobx-react';

import DappPackage from '../state/DappPackage';
import PackageCard from './PackageCard';
import { DialogStore } from 'app/modules/dialogs';
import { stakeTransaction } from 'app/modules/transactions/logic/transactions';
import TransactionStakeSuccess from 'app/modules/transactions/components/TransactionStakeSuccess';
import TransactionStakePending from 'app/modules/transactions/components/TransactionStakePending';

type Props = {
  dappPackage: DappPackage;
  dialogStore: DialogStore;
};

const DappPackageCard = ({ dappPackage, dialogStore }: Props) => {
  const p = dappPackage;
  const onClick = () => {
    const selectedDappPackage = p.packageStore.selectedDappPackage;
    if (!selectedDappPackage) return;

    const stakePayload = {
      provider: selectedDappPackage.providerLowercased,
      service: selectedDappPackage.serviceLowercased,
      package: selectedDappPackage.packageId,
      quantity: p.packageStore.stakeValue,
      unstakedDappHdlAmount: p.packageStore.rootStore.profileStore.dappHdlUnstakedBalance,
      unstakedDappAmount: p.packageStore.rootStore.profileStore.unstakedBalance,
    };

    dialogStore.openTransactionDialog({
      contentSuccess: <TransactionStakeSuccess {...stakePayload} />,
      contentPending: <TransactionStakePending {...stakePayload} />,
      performTransaction: async () => {
        const result = await stakeTransaction(stakePayload);
        await Promise.all([
          p.packageStore.rootStore.profileStore.fetchInfo(),
          p.packageStore.fetchStakedPackages(),
        ]);
        return result;
      },
      onClose: () => {
        p.packageStore.selectPackage(null);
      },
    });
  };

  return (
    <PackageCard
      package={dappPackage}
      details={[
        [
          { label: 'Quota', value: p.data.quota },
          { label: 'Min Stake', value: p.data.min_stake_quantity },
          { label: 'Unstake time', value: p.unstakeTimeText },
        ],
      ]}
      input={{
        placeholder: `Stake Amount ${p.data.min_stake_quantity.split(` `)[0]}`,
      }}
      button={{
        text: 'Stake',
        onClick,
      }}
    />
  );
};

export default observer(DappPackageCard);
