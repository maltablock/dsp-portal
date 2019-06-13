import React from 'react';

import { ContentInfo, HighlightedText } from './TransactionStyles';
import { UnstakePayload } from '../logic/transactions';
import AssetFormatter from './AssetFormatter';

const TransactionUnstakeSuccess = (payload: UnstakePayload) => {
  return(
    <React.Fragment>
      <div>
        You have <strong>un</strong>staked <AssetFormatter {...payload} /> from
      </div>
      <ContentInfo>
        <HighlightedText>{payload.provider}</HighlightedText>
      </ContentInfo>
    </React.Fragment>
  )
};

export default TransactionUnstakeSuccess;
