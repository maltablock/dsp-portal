import React from 'react';
import { observer } from 'mobx-react';

import { TransactionDialogItem } from '../state/TransactionDialogItem';
import TransactionContent from 'app/modules/transactions/components/TransactionContent';
import { DialogContainer, DialogCard, Title, ButtonsWrapper, SubmitButton } from './DialogComponents';

type Props = {
  dialog: TransactionDialogItem;
};


const TransactionDialog = ({ dialog }: Props) => {
  const {
    close,
    title,
  } = dialog;

  return (
    <DialogContainer>
      <DialogCard>
        <Title>{title}</Title>

        <TransactionContent {...dialog} />

        <ButtonsWrapper>
          <SubmitButton onClick={close}>Close</SubmitButton>
        </ButtonsWrapper>
      </DialogCard>
    </DialogContainer>
  );
};

export default observer(TransactionDialog)
