import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import StakedPackage from '../state/StakedPackage';
import PackageCard from './PackageCard';
import { formatAsset } from 'app/shared/eos';
import { DialogStore } from 'app/modules/dialogs';
import { unstakeTransaction, stakeTransaction } from 'app/modules/transactions/logic/transactions';
import TransactionUnstakePending from 'app/modules/transactions/components/TransactionUnstakePending';
import TransactionUnstakeSuccess from 'app/modules/transactions/components/TransactionUnstakeSuccess';
import { DAPP_SYMBOL, DAPPHODL_SYMBOL } from 'app/shared/eos/constants';
import { secondsToTimeObject } from 'app/shared/utils/time';
import { differenceInSeconds } from 'date-fns';
import ToggleButton from 'app/shared/components/ToggleButton';
import TransactionStakeSuccess from 'app/modules/transactions/components/TransactionStakeSuccess';
import TransactionStakePending from 'app/modules/transactions/components/TransactionStakePending';

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 0;
`;

const ToggleLabel = styled.div<{ isActive?: boolean, alignRight?: boolean }>`
  width: 50%;
  opacity: ${props => props.isActive ? 1 : 0.3};
  text-align: ${props => props.alignRight ? 'right' : 'left'};
  transition: 0.4s;
`;

type Props = {
  stakedPackage: StakedPackage;
  dialogStore: DialogStore;
};

const formatMinUnstakePeriod = seconds => {
  const hours = (seconds / 3600).toFixed(2);
  const postfix = hours === `1.00` ? `Hour` : `Hours`;
  return `${hours} ${postfix}`;
};

const formatUnstakeEndTime = (date: Date) => {
  const diffSeconds = differenceInSeconds(date, new Date());
  const t = secondsToTimeObject(diffSeconds);
  let timeString = ``;
  if (t.days > 0) timeString += `${t.days}D: `;
  if (t.hours > 0) timeString += `${t.hours}H: `;
  timeString += `${t.minutes}M`;
  return timeString;
};

const getCardDetails = (p: StakedPackage) => {
  const details = [
    [
      {
        label: 'Quota:',
        value: p.quotaAsTransactionsPerTimeFormatted,
      },
      {
        label: 'Amount Staked:',
        value: formatAsset({ amount: p.data.balance, symbol: DAPP_SYMBOL }),
      },
      {
        label: 'Min Stake:',
        value: formatAsset({ amount: p.minStakeNumber, symbol: DAPP_SYMBOL }),
      },
    ],
  ];

  const canUnstakeMore =
    p.refundFromSelfAmount + p.refundFromSelfDappHdlAmount <
    p.stakingBalanceFromSelf + p.stakingBalanceFromSelfDappHdl;
  if (canUnstakeMore) {
    details[0].push({
      label: 'Min Unstake Time:',
      value: formatMinUnstakePeriod(p.minUnstakePeriod),
    });
  }

  if (p.refundFromSelf || p.refundFromSelfDappHdl) {
    const dappUnstakeTime = p.refundFromSelf ? p.refundFromSelf.unstake_time : new Date(0)
    const dappHdlUnstakeTime = p.refundFromSelfDappHdl ? p.refundFromSelfDappHdl.unstake_time : new Date(0)
    const maxUnstakeTime = dappUnstakeTime.getTime() > dappHdlUnstakeTime.getTime() ? dappUnstakeTime : dappHdlUnstakeTime
    details.push([
      {
        label: 'Amount Unstaking:',
        value: formatAsset({ amount: p.refundFromSelfAmount + p.refundFromSelfDappHdlAmount, symbol: DAPP_SYMBOL }),
      },
      {
        label: 'Time Remaining:',
        value: formatUnstakeEndTime(maxUnstakeTime),
      },
    ]);
  }

  return details;
};

const StakedPackageCard = ({ stakedPackage, dialogStore }: Props) => {
  const p = stakedPackage;
  const { isUnstakeSelected, toggleIsUnstakeSelected } = p.packageStore;

  const onClick = () => {
    const selectedStakedPackage = p.packageStore.selectedStakedPackage;
    if (!selectedStakedPackage) return;

    const unstakePayload = {
      provider: selectedStakedPackage.providerLowercased,
      service: selectedStakedPackage.serviceLowercased,
      package: selectedStakedPackage.packageId,
      quantityDapp: p.packageStore.stakeValueDapp,
      quantityDappHdl: p.packageStore.stakeValueDappHdl,
      stakingBalanceFromSelf: selectedStakedPackage.stakingBalanceFromSelf,
      stakingBalanceFromSelfDappHdl: selectedStakedPackage.stakingBalanceFromSelfDappHdl,
    };

    const stakePayload = {
      provider: selectedStakedPackage.providerLowercased,
      service: selectedStakedPackage.serviceLowercased,
      package: selectedStakedPackage.packageId,
      quantityDapp: p.packageStore.stakeValueDapp,
      quantityDappHdl: p.packageStore.stakeValueDappHdl,
      unstakedDappHdlAmount: p.packageStore.rootStore.profileStore.unstakedDappHdlAmount,
      unstakedDappAmount: p.packageStore.rootStore.profileStore.unstakedDappAmount,
    };

    dialogStore.openTransactionDialog({
      contentSuccess: isUnstakeSelected ? <TransactionUnstakeSuccess {...unstakePayload} /> : <TransactionStakeSuccess {...stakePayload} />,
      contentPending: isUnstakeSelected ? <TransactionUnstakePending {...unstakePayload} /> : <TransactionStakePending {...stakePayload} />,
      performTransaction: async () => {
        const result = await (
          isUnstakeSelected
          ? unstakeTransaction(unstakePayload)
          : stakeTransaction(stakePayload)
        );
        await p.packageStore.rootStore.profileStore.fetchInfo();
        return result;
      },
      onClose: () => {
        p.packageStore.selectPackage(null);
      },
    });
  };

  const { unstakedDappAmount, unstakedDappHdlAmount } = p.packageStore.rootStore.profileStore;
  const maxDapp = formatAsset(
    { amount: isUnstakeSelected ? p.stakingBalanceFromSelf : unstakedDappAmount, symbol: DAPP_SYMBOL },
    { withSymbol: false },
  );

  const maxDappHdl = formatAsset(
    { amount: isUnstakeSelected ? p.stakingBalanceFromSelfDappHdl : unstakedDappHdlAmount, symbol: DAPPHODL_SYMBOL },
    { withSymbol: false },
  );

  const stakeUnstakeText = isUnstakeSelected ? 'UnStake' : 'Stake';

  return (
    <PackageCard
      package={stakedPackage}
      details={getCardDetails(p)}
      input={{
        placeholder: `${stakeUnstakeText} Amount`,
      }}
      button={{
        text: stakeUnstakeText,
        onClick,
      }}
      deprecated={p.isDeprecated}
      stakedDappAmount={p.stakingBalanceFromSelf}
      stakedDappHdlAmount={p.stakingBalanceFromSelfDappHdl}
      dappLabelButton={{
        text: maxDapp + ' Max',
        onClick: () => {
          p.packageStore.stakeValueDapp = maxDapp;
        },
      }}
      dappHdlLabelButton={{
        text: maxDappHdl + ' Max',
        onClick: () => {
          p.packageStore.stakeValueDappHdl = maxDappHdl;
        },
      }}
      afterDetailsContainer={
        p.isSelected &&
        <ToggleWrapper>
          <ToggleLabel isActive={!isUnstakeSelected}>Stake</ToggleLabel>
          <ToggleButton
            checked={isUnstakeSelected}
            onClick={toggleIsUnstakeSelected}
            alwaysActiveBg
            size={24}
          />
          <ToggleLabel isActive={isUnstakeSelected} alignRight>UnStake</ToggleLabel>
        </ToggleWrapper>
      }
    />
  );
};

export default observer(StakedPackageCard);
