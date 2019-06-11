import React from 'react';
import { observer } from 'mobx-react';

import StakedPackage from '../state/StakedPackage';
import PackageCard from './PackageCard';
import { formatAsset } from 'app/shared/eos';
import { DialogStore } from 'app/modules/dialogs';
import { unstakeTransaction } from 'app/modules/transactions/logic/transactions';
import TransactionUnstakePending from 'app/modules/transactions/components/TransactionUnstakePending';
import TransactionUnstakeSuccess from 'app/modules/transactions/components/TransactionUnstakeSuccess';
import { DAPP_SYMBOL, DAPPHODL_SYMBOL, QUOTA_SYMBOL } from 'app/shared/eos/constants';
import { secondsToTimeObject } from 'app/shared/utils/time';
import { format, differenceInSeconds, addSeconds } from 'date-fns';

type Props = {
  stakedPackage: StakedPackage;
  dialogStore: DialogStore;
};

const formatMinUnstakePeriod = seconds => {
  const hours = (seconds / 3600).toFixed(2);
  const postfix = hours === `1.00` ? `Hour` : `Hours`;
  return `${hours} ${postfix}`;
};

const formatUnstakeEndTime = (date:Date) => {
  const diffSeconds = differenceInSeconds(date, new Date())
  const t = secondsToTimeObject(diffSeconds)
  let timeString = ``
  if(t.days > 0) timeString += `${t.days}D: `
  if(t.hours > 0) timeString += `${t.hours}H: `
  timeString += `${t.minutes}M`
  return timeString
};

const getCardDetails = (p: StakedPackage) => {
  const details = [[
    {
      label: 'Quota:',
      value: formatAsset({ amount: p.quotaNumber, symbol: QUOTA_SYMBOL }),
    },
    {
      label: 'Amount Staked:',
      value: formatAsset({ amount: p.data.balance, symbol: DAPP_SYMBOL }),
    },
  ]];

  const canUnstakeMore = p.refundFromSelfAmount + p.refundFromSelfDappHdlAmount < p.stakingBalanceFromSelf + p.stakingBalanceFromSelfDappHdl
  if(canUnstakeMore) {
    details[0].push(
      {
        label: 'Unstake Time:',
        value: formatMinUnstakePeriod(p.minUnstakePeriod),
      })
  }

  if(p.refundFromSelf) {
    details.push([{
      label: 'Amount Unstaking:',
      value: formatAsset({ amount: p.refundFromSelf.amount, symbol: DAPP_SYMBOL }),
    }, {
      label: 'Time Remaining:',
      value: formatUnstakeEndTime(p.refundFromSelf.unstake_time),
    }])
  }

  if(p.refundFromSelfDappHdl) {
    details.push([{
      label: 'Amount Unstaking:',
      value: formatAsset({ amount: p.refundFromSelfDappHdl.amount, symbol: DAPPHODL_SYMBOL }),
    }, {
      label: 'Time Remaining:',
      value: formatUnstakeEndTime(p.refundFromSelfDappHdl.unstake_time),
    }])
  }

  return details
};

const StakedPackageCard = ({ stakedPackage, dialogStore }: Props) => {
  const p = stakedPackage;
  const onClick = () => {
    const selectedStakedPackage = p.packageStore.selectedStakedPackage;
    if (!selectedStakedPackage) return;

    const unstakePayload = {
      provider: selectedStakedPackage.providerLowercased,
      service: selectedStakedPackage.serviceLowercased,
      package: selectedStakedPackage.packageId,
      quantity: p.packageStore.stakeValue,
      stakingBalanceFromSelf: selectedStakedPackage.stakingBalanceFromSelf,
      stakingBalanceFromSelfDappHdl: selectedStakedPackage.stakingBalanceFromSelfDappHdl,
    };

    dialogStore.openTransactionDialog({
      contentSuccess: <TransactionUnstakeSuccess {...unstakePayload} />,
      contentPending: <TransactionUnstakePending {...unstakePayload} />,
      performTransaction: async () => {
        const result = await unstakeTransaction(unstakePayload);
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
      package={stakedPackage}
      details={getCardDetails(p)}
      input={{
        placeholder: 'UnStake Amount',
      }}
      button={{
        text: 'UnStake',
        onClick,
      }}
    />
  );
};

export default observer(StakedPackageCard);
