import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import BlueGradientCard from 'app/shared/components/BlueGradientCard';
import Button from 'app/shared/components/Button';
import { TransactionDialogItem } from '../state/DialogStore';
import TransactionContent from 'app/modules/transactions/components/TransactionContent';

const DialogContainer = styled.div`
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
`;

const DialogCard = styled(BlueGradientCard)`
  width: auto;
  height: auto;
  display: flex;
  margin: 200px auto 0;
  padding: 40px 32px;
  > * {
    margin: 0 auto;
  }
`;

const Title = styled.div`
  font-size: 23px;
`;

const ButtonsWrapper = styled.div`
  margin-top: 40px;
`;

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
