import React from 'react';
import { observer } from 'mobx-react';

import DappPackage from '../state/DappPackage';
import PackageCard from './PackageCard';
import { DialogStore } from 'app/modules/dialogs';
import { stakeTransaction } from 'app/shared/eos/transactions';
import { ContentInfo, HighlightedText, AmountText } from 'app/shared/components/TransactionStyles';

type Props = {
  dappPackage: DappPackage;
  dialogStore: DialogStore;
};

const DappPackageCard = ({ dappPackage, dialogStore }: Props) => {
  const p = dappPackage;
  const onClick = () => {
    const selectedDappPackage = p.packageStore.selectedDappPackage;
    if(!selectedDappPackage) return;

    const stakePayload = {
      provider: selectedDappPackage.providerLowercased,
      service: selectedDappPackage.serviceLowercased,
      package: selectedDappPackage.packageId,
      quantity: p.packageStore.stakeValue,
    }

    dialogStore.openTransactionDialog({
      contentSuccess: (
        <React.Fragment>
          <div>
            You have staked <AmountText>{stakePayload.quantity} DAPP</AmountText> to
          </div>
          <ContentInfo>
            <HighlightedText>{stakePayload.provider}</HighlightedText>
            for
            <HighlightedText>{stakePayload.package}</HighlightedText>
          </ContentInfo>
        </React.Fragment>
      ),
      contentPending: (
        <React.Fragment>
          <div>
            Staking <AmountText>{stakePayload.quantity} DAPP</AmountText> to
          </div>
          <ContentInfo>
            <HighlightedText>{stakePayload.provider}</HighlightedText>
            for
            <HighlightedText>{stakePayload.package}</HighlightedText>
          </ContentInfo>
        </React.Fragment>
      ),
      performTransaction: async () => {
        const result = stakeTransaction(stakePayload);
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
      package={dappPackage}
      details={[
        { label: 'Quota', value: p.data.quota },
        { label: 'Min Stake', value: p.data.min_stake_quantity },
        { label: 'Unstake time', value: p.unstakeTimeText },
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
