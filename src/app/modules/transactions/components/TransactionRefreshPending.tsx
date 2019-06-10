import React from 'react';

import { AmountText, ContentInfo } from './TransactionStyles';

type Props = {
  isClaimTransaction?: boolean
}
const TransactionRefreshPending = ({ isClaimTransaction = false }: Props) => {
  return (
      <ContentInfo>
        {isClaimTransaction ? `Claiming` : `Refreshing`} <AmountText>Air-HODLed DAPP</AmountText> tokens
      </ContentInfo>
  )
};

export default TransactionRefreshPending;
