import React from 'react';

import { AmountText, ContentInfo, HighlightedText } from './TransactionStyles';
import { UnstakePayload } from '../logic/transactions';

const TransactionUnstakeSuccess = (payload: UnstakePayload) => {
  return(
    <React.Fragment>
      <div>
        You have <strong>un</strong>staked <AmountText>{payload.quantity} DAPP</AmountText> from
      </div>
      <ContentInfo>
        <HighlightedText>{payload.provider}</HighlightedText>
      </ContentInfo>
    </React.Fragment>
  )
};

export default TransactionUnstakeSuccess;
