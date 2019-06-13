import React from 'react';

import { AmountText, ContentInfo } from './TransactionStyles';

type Props = {
  isClaimTransaction?: boolean
}
const TransactionRefreshPending = ({ isClaimTransaction = false }: Props) => {
  return (
      <ContentInfo>
        {isClaimTransaction ? `Claiming` : `Refreshing`} <AmountText>DAPPHDL</AmountText> (Air-HODLed DAPP) tokens
      </ContentInfo>
  )
};

export default TransactionRefreshPending;
