import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import BlueGradientCard from 'app/shared/components/BlueGradientCard';
import Button from 'app/shared/components/Button';
import { Info, HighlightedText, HighlightedText2 } from 'app/shared/components/TransactionStyles';
import { TransactionDialogItem, TransactionStatus } from '../state/DialogStore';
import TransactionFailedContent from './TransactionFailedContent';

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

const Content = styled.div`
  margin-top: 22px;
  text-align: center;
  line-height: 1.6;
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

const getContent = (dialog:TransactionDialogItem) => {
  const {
    transactionStatus,
    transactionId,
    transactionError,
    contentPending,
    contentSuccess,
  } = dialog;

  switch (transactionStatus) {
    case TransactionStatus.Pending: {
      return (
        <Content>
          {contentPending}
        </Content>
      );
    }
    case TransactionStatus.Success: {
      return (
        <React.Fragment>
          <Content>
            {contentSuccess}
          </Content>

          <Info>See Transaction</Info>

          <HighlightedText2>{transactionId}</HighlightedText2>
        </React.Fragment>
      );
    }
    case TransactionStatus.Failure: {
      console.log(`transactionError`, transactionError)
      return (
        <TransactionFailedContent transactionError={transactionError!} />
      );
    }
  }
};



const TransactionDialog = ({ dialog }: Props) => {
  const {
    close,
    title,
  } = dialog;

  const content = getContent(dialog);

  return (
    <DialogContainer>
      <DialogCard>
        <Title>{title}</Title>

        <Content>{content}</Content>

        <ButtonsWrapper>
          <CloseBtn onClick={close}>Close</CloseBtn>
        </ButtonsWrapper>
      </DialogCard>
    </DialogContainer>
  );
};

export default observer(TransactionDialog)
