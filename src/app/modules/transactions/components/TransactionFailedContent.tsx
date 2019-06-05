import React from 'react';
import { ContentInfo, HighlightedText } from './TransactionStyles';

type Props = {
  transactionError: string;
};

export default function TransactionFailedContent({ transactionError }: Props) {
  return (
    <React.Fragment>
      <div>The transaction failed.</div>
      <ContentInfo>
        <HighlightedText>{transactionError}</HighlightedText>
      </ContentInfo>
    </React.Fragment>
  );
}
