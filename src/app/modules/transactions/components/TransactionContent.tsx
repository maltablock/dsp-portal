import React from 'react';
import styled from 'styled-components';

import { TransactionStatus } from 'app/modules/dialogs/state/TransactionDialogItem';
import { Info, HighlightedText2 } from './TransactionStyles';
import TransactionFailedContent from './TransactionFailedContent';
import { getBlockExplorerUrl } from '../utils';

const Content = styled.div`
  margin-top: 22px;
  text-align: center;
  line-height: 1.6;
`;

type Props = {
  transactionStatus: TransactionStatus;
  transactionId?: string;
  transactionError?: string;
  contentPending: any;
  contentSuccess: any;
};

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

          <a href={getBlockExplorerUrl(transactionId)} target="_blank" rel="noopener noreferrer">
            <HighlightedText2>{transactionId}</HighlightedText2>
          </a>
        </React.Fragment>
      );
    }
    case TransactionStatus.Failure: {
      return (
        <Content>
          <TransactionFailedContent transactionError={transactionError!} />
        </Content>
      );
    }
  }
};

export default TransactionContent;
