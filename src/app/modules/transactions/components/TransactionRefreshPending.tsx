import React from 'react';

import { AmountText, ContentInfo, HighlightedText } from './TransactionStyles';

type Props = {
  isClaimTransaction: boolean
}
const TransactionRefreshPending = ({ isClaimTransaction }: Props) => {
  return (
      <ContentInfo>
        {isClaimTransaction ? `Claiming` : `Refreshing`} <AmountText>Air-HODLed DAPP</AmountText> tokens
      </ContentInfo>
  )
};

export default TransactionRefreshPending;
