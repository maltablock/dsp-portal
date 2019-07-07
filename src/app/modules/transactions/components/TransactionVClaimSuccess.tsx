import React from 'react';
import { VClaimPayload } from '../logic/transactions';
import { AmountText, ContentInfo, HighlightedText2 } from './TransactionStyles';

const TransactionVClaimSuccess = (payload: VClaimPayload) => {
  return (
    <React.Fragment>
      <ContentInfo>
        Claimed <AmountText>{payload.symbol.split(`,`)[1]}</AmountText> tokens for account <HighlightedText2>{payload.accountToClaimFor}</HighlightedText2>.
      </ContentInfo>
    </React.Fragment>
  );
};

export default TransactionVClaimSuccess;
