import React from 'react';

import { ContentInfo, HighlightedText } from './TransactionStyles';
import { StakePayload } from '../logic/transactions';
import AssetFormatter from './AssetFormatter';

const TransactionStakePending = (payload: StakePayload) => {
  return (
    <React.Fragment>
      <div>
        Staking <AssetFormatter {...payload} /> to
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
