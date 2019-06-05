import React from 'react';

import { AmountText, ContentInfo, HighlightedText } from './TransactionStyles';
import { StakePayload } from '../logic/transactions';

const TransactionStakePending = (payload: StakePayload) => {
  return (
    <React.Fragment>
      <div>
        Staking <AmountText>{payload.quantity} DAPP</AmountText> to
      </div>
      <ContentInfo>
        <HighlightedText>{payload.provider}</HighlightedText>
        for
        <HighlightedText>{payload.package}</HighlightedText>
      </ContentInfo>
    </React.Fragment>
  )
};

export default TransactionStakePending;
