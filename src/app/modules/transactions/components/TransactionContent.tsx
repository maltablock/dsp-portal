import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { TransactionStatus } from 'app/modules/dialogs/state/DialogStore';
import { Info, HighlightedText2 } from './TransactionStyles';
import TransactionFailedContent from './TransactionFailedContent';

const Content = styled.div`
  margin-top: 22px;
  text-align: center;
  line-height: 1.6;
`;

type Props = {
  transactionStatus: TransactionStatus,
  transactionId?: string,
  transactionError?: string,
  contentPending: any,
  contentSuccess: any,
}

const TransactionContent = (dialog: Props) => {
  const {
    transactionStatus,
    transactionId,
    transactionError,
    contentPending,
    contentSuccess,
  } = dialog;

  switch (transactionStatus) {
    case TransactionStatus.Pending: {
      return <Content>{contentPending}</Content>;
    }
    case TransactionStatus.Success: {
      return (
        <React.Fragment>
          <Content>{contentSuccess}</Content>

          <Info>See Transaction</Info>

          <HighlightedText2>{transactionId}</HighlightedText2>
        </React.Fragment>
      );
    }
    case TransactionStatus.Failure: {
      return <TransactionFailedContent transactionError={transactionError!} />;
    }
  }
};

export default TransactionContent;
