import React from 'react'
import { inject, observer } from 'mobx-react';

import { ProfileStore } from 'app/modules/profile';
import { StakeStatusCardsWrapper, StakeStatusCard, ToggleExpandButton } from './StakeStatusComponents';

type Props = {
  profileStore?: ProfileStore
};

const StakeStatusContainer = (props: Props) => {
  const store = props.profileStore!;

  return (
    <StakeStatusCardsWrapper>
      <ToggleExpandButton onClick={store.toggleCardsExpanded}>
        {store.isCardsExpanded ? 'CLOSE' : 'EXPAND'}
      </ToggleExpandButton>

      {
        [
          { text: 'Total DAPP', amount: store.totalDappAmount, amountUsd: 0 },
          { text: 'Staked DAPP', amount: store.totalStakedDappAmount, amountUsd: 0 },
          { text: 'Unstaked DAPP', amount: store.unstakedBalance, amountUsd: 0 },
          { text: 'Air-HODLed token', amount: store.dappHdlAmount, amountUsd: store.dappHdlBalance },
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
