import React from 'react';
import { VClaimPayload } from '../logic/transactions';
import { AmountText, ContentInfo } from './TransactionStyles';

const TransactionVClaimPending = (payload: VClaimPayload) => {
  return (
    <React.Fragment>
      <ContentInfo>
        Claiming <AmountText>{payload.symbol.split(`,`)[1]}</AmountText> tokens.
      </ContentInfo>
    </React.Fragment>
  );
};

export default TransactionVClaimPending;
