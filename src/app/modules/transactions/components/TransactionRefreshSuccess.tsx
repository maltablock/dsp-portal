import React from 'react';

import { AmountText, ContentInfo } from './TransactionStyles';

type Props = {
  isClaimTransaction?: boolean
}
const TransactionRefreshSuccess = ({ isClaimTransaction = false }: Props) => {
  return (
      <ContentInfo>
        <AmountText>Air-HODLed DAPP</AmountText> tokens {isClaimTransaction ? `claimed` : `refreshed`}
      </ContentInfo>
  )
};

export default TransactionRefreshSuccess;
