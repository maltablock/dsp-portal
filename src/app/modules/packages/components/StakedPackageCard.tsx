import React from 'react';
import { observer } from 'mobx-react';

import StakedPackage from '../state/StakedPackage';
import PackageCard from './PackageCard';
import { formatAsset } from 'app/shared/eos';
import { DialogStore } from 'app/modules/dialogs';
import { unstakeTransaction } from 'app/modules/transactions/logic/transactions';
import TransactionUnstakePending from 'app/modules/transactions/components/TransactionUnstakePending';
import TransactionUnstakeSuccess from 'app/modules/transactions/components/TransactionUnstakeSuccess';

type Props = {
  stakedPackage: StakedPackage
  dialogStore: DialogStore
}

const formatUnstakePeriod = seconds => {
  const hours = (seconds / 3600).toFixed(2)
  const postfix = hours == `1.00` ? `Hour` : `Hours`
  return `${hours} ${postfix}`
}

const StakedPackageCard = ({ stakedPackage, dialogStore }: Props) => {
  const p = stakedPackage;
  const onClick = () => {
    const selectedStakedPackage = p.packageStore.selectedStakedPackage;
    if(!selectedStakedPackage) return;

    const stakePayload = {
      provider: selectedStakedPackage.providerLowercased,
      service: selectedStakedPackage.serviceLowercased,
      package: selectedStakedPackage.packageId,
      quantity: p.packageStore.stakeValue,
    }

    dialogStore.openTransactionDialog({
      contentSuccess: <TransactionUnstakeSuccess {...stakePayload}/>,
      contentPending: <TransactionUnstakePending {...stakePayload}/>,
      performTransaction: async () => {
        const result = unstakeTransaction(stakePayload);
        await p.packageStore.rootStore.profileStore.fetchInfo();
        return result;
      },
      onClose: () => {
        p.packageStore.selectPackage(null)
      }
    });
  };

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
        onClick,
      }}
    />
  )
}

export default observer(StakedPackageCard);
