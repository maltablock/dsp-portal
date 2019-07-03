import React from 'react';
import { VClaimPayload } from '../logic/transactions';
import { AmountText, ContentInfo } from './TransactionStyles';

const TransactionVClaimSuccess = (payload: VClaimPayload) => {
  return (
    <React.Fragment>
      <ContentInfo>
        Claimed <AmountText>{payload.symbol.split(`,`)[1]}</AmountText> tokens.
      </ContentInfo>
    </React.Fragment>
  );
};

export default TransactionVClaimSuccess;
