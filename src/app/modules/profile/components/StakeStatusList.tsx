import React from 'react'
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import { ProfileStore } from 'app/modules/profile';
import { DAPP_SYMBOL } from 'app/shared/eos/constants';
import StakeStatusCard from './StakeStatusCard';

const MOBILE_WIDTH = 960;

const ListWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin: 74px auto 97px;
  padding: 0 8px;

  @media (max-width: ${MOBILE_WIDTH}px) {
    flex-direction: column;
    margin: 32px 8px;
    padding: 0;
    width: calc(100% - 32px);
  }

  @media (min-width: 1300px) {
    width: 1300px;
  }
`;

const ToggleExpandButton = styled.div`
  position: absolute;
  top: 150px;
  right: 16px;
  z-index: 10;
  padding: 8px;
  cursor: pointer;

  @media (min-width: ${MOBILE_WIDTH + 1}px) {
    display: none;
  }
`;

type Props = {
  profileStore?: ProfileStore
};

const StakeStatusList = (props: Props) => {
  const store = props.profileStore!;

  const dappToUsd = dapp => dapp / Math.pow(10, DAPP_SYMBOL.precision) * store.usdPerDapp

  return (
    <ListWrapper>
      <ToggleExpandButton onClick={store.toggleCardsExpanded}>
        {store.isCardsExpanded ? 'CLOSE' : 'EXPAND'}
      </ToggleExpandButton>

      {
        [
          {
            text: 'Total DAPP',
            amount: store.totalDappAmount,
            amountUsd: dappToUsd(store.totalDappAmount)
          },
          {
            text: 'Staked DAPP',
            amount: store.totalStakedDappAmount,
            amountUsd: dappToUsd(store.totalStakedDappAmount),
            buttonText: 'Unstake',
            buttonOnClick: store.handleUnstake
          },
          {
            text: 'Unstaked DAPP',
            amount: store.unstakedBalance,
            amountUsd: dappToUsd(store.unstakedBalance)
          },
          {
            text: 'Air-HODLed token',
            amount: store.dappHdlBalance,
            amountUsd: dappToUsd(store.dappHdlBalance),
            remainingTilDate: store.vestingEndDate,
            buttonText: 'Withdraw',
            buttonOnClick: store.handleWithdraw
          },
        ].map((props, index, arr) =>
          <StakeStatusCard
            key={props.text}
            expanded={store.isCardsExpanded}
            zIndex={arr.length - index}
            {...props}
          />
        )
      }
    </ListWrapper>
  )
}

export default inject('profileStore')(observer(StakeStatusList));
