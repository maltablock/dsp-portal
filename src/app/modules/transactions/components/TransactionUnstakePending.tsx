import React from 'react';

import { ContentInfo, HighlightedText } from './TransactionStyles';
import { UnstakePayload } from '../logic/transactions';
import AssetFormatter from './AssetFormatter';

const TransactionUnstakePending = (payload: UnstakePayload) => {
  return (
    <React.Fragment>
      <div>
        <strong>Un</strong>Staking <AssetFormatter {...payload} /> from
      </div>
      <ContentInfo>
        <HighlightedText>{payload.provider}</HighlightedText>
      </ContentInfo>
    </React.Fragment>
  )
};

export default TransactionUnstakePending;
