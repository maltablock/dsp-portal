import React, { ReactElement } from 'react';
import { ContentInfo, HighlightedText } from './TransactionStyles';

type Props = {
  transactionError: string;
};

export default function TransactionFailedContent({ transactionError }: Props) {
  let errorMessage: ReactElement;

  if (/Your account is not whitelisted/i.test(transactionError)) {
    errorMessage = (
      <span>
        The selected DSP (airdropsdac1) is a premium service that requires pre-authorization and we
        request the project team to contact <a href="https://t.me/michaelgucci">@michaelgucci</a> on
        telegram.
      </span>
    );
  } else {
    errorMessage = <HighlightedText>{transactionError}</HighlightedText>;
  }

  return <ContentInfo>{errorMessage}</ContentInfo>;
}
