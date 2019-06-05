import React from 'react';

import { AmountText, ContentInfo, HighlightedText } from './TransactionStyles';
import { UnstakePayload } from '../logic/transactions';

const TransactionUnstakePending = (payload: UnstakePayload) => {
  return (
    <React.Fragment>
      <div>
        <strong>Un</strong>Staking <AmountText>{payload.quantity} DAPP</AmountText> from
      </div>
      <ContentInfo>
        <HighlightedText>{payload.provider}</HighlightedText>
      </ContentInfo>
    </React.Fragment>
  )
};

export default TransactionUnstakePending;
