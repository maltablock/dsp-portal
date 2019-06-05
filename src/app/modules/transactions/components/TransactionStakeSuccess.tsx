import React from 'react';

import { AmountText, ContentInfo, HighlightedText } from './TransactionStyles';
import { StakePayload } from '../logic/transactions';

const TransactionStakeSuccess = (payload: StakePayload) => {
  return (
    <React.Fragment>
      <div>
        You have staked <AmountText>{payload.quantity} DAPP</AmountText> to
      </div>
      <ContentInfo>
        <HighlightedText>{payload.provider}</HighlightedText>
        for
        <HighlightedText>{payload.package}</HighlightedText>
      </ContentInfo>
    </React.Fragment>
  )
};

export default TransactionStakeSuccess;
