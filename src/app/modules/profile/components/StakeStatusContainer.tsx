import React from 'react'
import { inject, observer } from 'mobx-react';

import { ProfileStore } from 'app/modules/profile';
import { StakeStatusCardsWrapper, StakeStatusCard, ToggleExpandButton } from './StakeStatusComponents';
import { DAPP_SYMBOL } from 'app/shared/eos/constants';

type Props = {
  profileStore?: ProfileStore
};

const StakeStatusContainer = (props: Props) => {
  const store = props.profileStore!;

  const dappToUsd = dapp => dapp / Math.pow(10, DAPP_SYMBOL.precision) * store.usdPerDapp

  return (
    <StakeStatusCardsWrapper>
      <ToggleExpandButton onClick={store.toggleCardsExpanded}>
        {store.isCardsExpanded ? 'CLOSE' : 'EXPAND'}
      </ToggleExpandButton>

      {
        [
          { text: 'Total DAPP', amount: store.totalDappAmount, amountUsd: dappToUsd(store.totalDappAmount) },
          { text: 'Staked DAPP', amount: store.totalStakedDappAmount, amountUsd: dappToUsd(store.totalStakedDappAmount) },
          { text: 'Unstaked DAPP', amount: store.unstakedBalance, amountUsd: dappToUsd(store.unstakedBalance) },
          { text: 'Air-HODLed token', amount: store.dappHdlBalance, amountUsd: dappToUsd(store.dappHdlBalance) },
        ].map(({ text, amount, amountUsd }, index, arr) =>
          <StakeStatusCard
            key={text}
            text={text}
            amount={amount}
            amountUsd={amountUsd}
            expanded={store.isCardsExpanded}
            zIndex={arr.length - index}
          />
        )
      }
    </StakeStatusCardsWrapper>
  )
}

export default inject('profileStore')(observer(StakeStatusContainer));
