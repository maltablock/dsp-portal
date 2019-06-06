import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import { ProfileStore } from 'app/modules/profile';
import { DAPP_SYMBOL } from 'app/shared/eos/constants';
import TransactionRefreshPending from 'app/modules/transactions/components/TransactionRefreshPending';
import TransactionRefreshSuccess from 'app/modules/transactions/components/TransactionRefreshSuccess';
import TransactionWithdrawPending from 'app/modules/transactions/components/TransactionWithdrawPending';
import TransactionWithdrawSuccess from 'app/modules/transactions/components/TransactionWithdrawSuccess';
import StakeStatusCard from './StakeStatusCard';
import RefreshButton from './RefreshButton'

const MOBILE_WIDTH = 960;

const ListWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin: 74px auto 56px;
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
  profileStore?: ProfileStore;
};

const StakeStatusList = (props: Props) => {
  const store = props.profileStore!;

  const dappToUsd = dapp => (dapp / Math.pow(10, DAPP_SYMBOL.precision)) * store.usdPerDapp;

  // some users never received the AirHODL and cannot claim / withdraw
  const airHodlCard =
    store.dappHdlClaimed === null
      ? {
          text: 'Air-HODLed token',
          amount: 0,
          amountUsd: 0,
          remainingTilDate: store.vestingEndDate,
        }
      : {
          text: 'Air-HODLed token',
          amount: store.dappHdlBalance,
          amountUsd: dappToUsd(store.dappHdlBalance),
          remainingTilDate: store.vestingEndDate,
          showRefreshButton: store.dappHdlClaimed,
          refreshButton: <RefreshButton onClick={() =>
            store.handleRefresh({
              contentPending: <TransactionRefreshPending />,
              contentSuccess: <TransactionRefreshSuccess />,
            })}/>,
          buttonText: store.dappHdlClaimed ? 'Withdraw' : 'Claim',
          buttonOnClick: store.dappHdlClaimed
            ? () => store.handleWithdraw({
              contentPending: <TransactionWithdrawPending />,
              contentSuccess: <TransactionWithdrawSuccess />,
            })
            : () =>
                store.handleRefresh({
                  contentPending: <TransactionRefreshPending isClaimTransaction />,
                  contentSuccess: <TransactionRefreshSuccess isClaimTransaction />,
                }),
        };

  return (
    <ListWrapper>
      <ToggleExpandButton onClick={store.toggleCardsExpanded}>
        {store.isCardsExpanded ? 'CLOSE' : 'EXPAND'}
      </ToggleExpandButton>

      {[
        {
          text: 'Total DAPP',
          amount: store.totalDappAmount,
          amountUsd: dappToUsd(store.totalDappAmount),
        },
        {
          text: 'Staked DAPP',
          amount: store.totalStakedDappAmount,
          amountUsd: dappToUsd(store.totalStakedDappAmount),
        },
        {
          text: 'Unstaked DAPP',
          amount: store.unstakedBalance,
          amountUsd: dappToUsd(store.unstakedBalance),
        },
        airHodlCard,
      ].map((props, index, arr) => (
        <StakeStatusCard
          key={props.text}
          expanded={store.isCardsExpanded}
          zIndex={arr.length - index}
          {...props}
        />
      ))}
    </ListWrapper>
  );
};

export default inject('profileStore')(observer(StakeStatusList));
