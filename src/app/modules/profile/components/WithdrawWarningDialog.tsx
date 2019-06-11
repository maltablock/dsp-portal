import React from 'react';
import styled from 'styled-components';

import DialogItem from 'app/modules/dialogs/state/DialogItem';
import _Button from 'app/shared/components/Button';
import { ReactComponent as CloseIconSvg } from 'app/shared/icons/close_icon.svg';

import {
  DialogContainer,
  DialogCard as _DialogCard,
  ButtonsWrapper
} from 'app/modules/dialogs/components/DialogComponents';

const DialogCard = styled(_DialogCard)`
  position: relative;
  background-image: none;
  background-color: #fd4971;

  > * {
    font-weight: 600;
    text-align: center;
  }

  @media (min-width: 840px) {
    padding: 40px 100px;
  }
`;

const Title = styled.div`
  font-size: 23px;
`;

const WarningText1 = styled.div`
  font-size: 16px;
  margin-top: 16px;
  max-width: 420px;
`;

const WarningText2 = styled.div`
  font-size: 14px;
  margin-top: 24px;
  text-transform: uppercase;
`;

const AmountText = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin-top: 36px;
`;

const Button = styled(_Button)`
  padding: 11px 64px;
  color: #555;
  background-color: #fff;
`;

const CloseButton = styled.div`
  position: absolute;
  cursor: pointer;
  top: 16px;
  right: 16px;
  width: 16px;
  svg > * {
    fill: #fff;
  }
`;

type Props = {
  dialog?: DialogItem
}

const WithdrawWarningDialog = ({ dialog }: Props) => {
  const { cancel, submit, data } = dialog!;
  const { balance, isWithdrawDisabled } = data;
  return (
    <DialogContainer>
      <DialogCard>
        <CloseButton onClick={cancel}>
          <CloseIconSvg fill="#fff" />
        </CloseButton>

        <Title>
          Withdrawing Your Air-HODL Tokens
        </Title>

        <WarningText1>
          WARNING: withdrawing will permanently forfeit your unvested tokens! Only proceed if you are sure you wish to do this.
        </WarningText1>

        <WarningText2>
          This action is irrevocable. It cannot be undone.
        </WarningText2>

        <AmountText>
          {balance || 'Not Currently Available'}
        </AmountText>

        <ButtonsWrapper>
          <Button
            disabled={isWithdrawDisabled}
            onClick={submit}
          >
            Withdraw
          </Button>
        </ButtonsWrapper>
      </DialogCard>
    </DialogContainer>
  )
}

export default WithdrawWarningDialog
