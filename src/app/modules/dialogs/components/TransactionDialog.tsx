import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import Button from 'app/shared/components/Button';
import { TransactionDialogItem } from '../state/TransactionDialogItem';
import TransactionContent from 'app/modules/transactions/components/TransactionContent';
import { DialogContainer, DialogCard, Title, ButtonsWrapper } from './DialogComponents';

const CloseBtn = styled(Button)`
  background: #0b1422;
  padding: 11px 36px;
  font-size: 14px;
`;

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
          <CloseBtn onClick={close}>Close</CloseBtn>
        </ButtonsWrapper>
      </DialogCard>
    </DialogContainer>
  );
};

export default observer(TransactionDialog)
