import React from 'react';
import { observer } from 'mobx-react';

import DappPackage from '../state/DappPackage';
import PackageCard from './PackageCard';
import { DialogStore } from 'app/modules/dialogs';
import { stakeTransaction } from 'app/modules/transactions/logic/transactions';
import TransactionStakeSuccess from 'app/modules/transactions/components/TransactionStakeSuccess';
import TransactionStakePending from 'app/modules/transactions/components/TransactionStakePending';
import { formatAsset } from 'app/shared/eos';
import { DAPP_SYMBOL, DAPPHODL_SYMBOL } from 'app/shared/eos/constants';

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
      quantityDapp: p.packageStore.stakeValueDapp,
      quantityDappHdl: p.packageStore.stakeValueDappHdl,
      unstakedDappHdlAmount: p.packageStore.rootStore.profileStore.unstakedDappHdlAmount,
      unstakedDappAmount: p.packageStore.rootStore.profileStore.unstakedDappAmount,
    };

    dialogStore.openTransactionDialog({
      contentSuccess: <TransactionStakeSuccess {...stakePayload} />,
      contentPending: <TransactionStakePending {...stakePayload} />,
      performTransaction: async () => {
        const result = await stakeTransaction(stakePayload);
        await p.packageStore.rootStore.profileStore.fetchInfo();
        return result;
      },
      onClose: () => {
        p.packageStore.selectPackage(null);
      },
    });
  };

  const { stakingBalanceFromSelf } = p;
  const { unstakedDappAmount, unstakedDappHdlAmount } = p.packageStore.rootStore.profileStore;

  const unstakedDapp = formatAsset(
    { amount: unstakedDappAmount, symbol: DAPP_SYMBOL },
    { withSymbol: false },
  );
  const unstakedDappHdl = formatAsset(
    { amount: unstakedDappHdlAmount, symbol: DAPPHODL_SYMBOL },
    { withSymbol: false },
  );

  const details = [
    [
      { label: 'Quota', value: p.data.quota },
      { label: 'Min Stake', value: p.data.min_stake_quantity },
    ],
  ];

  if (stakingBalanceFromSelf) {
    details[0].push({
      label: 'Amount Staked:',
      value: formatAsset({ amount: stakingBalanceFromSelf, symbol: DAPP_SYMBOL }),
    });
  }

  details[0].push({ label: 'Unstake time', value: p.unstakeTimeText });

  return (
    <PackageCard
      package={dappPackage}
      showStakingIcon={dappPackage.isStakedToByUser}
      details={details}
      input={{
        placeholder: `Stake Amount ${p.data.min_stake_quantity.split(` `)[0]}`,
      }}
      button={{
        text: 'Stake',
        onClick,
      }}
      stakedDappAmount={p.stakingBalanceFromSelf}
      stakedDappHdlAmount={p.stakingBalanceFromSelfDappHdl}
      dappLabelButton={{
        text: unstakedDapp + ' Max',
        onClick: () => {
          p.packageStore.stakeValueDapp = unstakedDapp;
        },
      }}
      dappHdlLabelButton={{
        text: unstakedDappHdl + ' Max',
        onClick: () => {
          p.packageStore.stakeValueDappHdl = unstakedDappHdl;
        },
      }}
    />
  );
};

export default observer(DappPackageCard);
