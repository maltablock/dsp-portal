import React from 'react';

import { ContentInfo, HighlightedText } from './TransactionStyles';
import { StakePayload } from '../logic/transactions';
import AssetFormatter from './AssetFormatter';

const TransactionStakeSuccess = (payload: StakePayload) => {
  return (
    <React.Fragment>
      <div>
        You have staked <AssetFormatter {...payload} /> to
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
