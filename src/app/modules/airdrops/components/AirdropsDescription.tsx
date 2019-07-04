import React, { useState } from 'react';
import styled from 'styled-components';

import BlueGradientCard from 'app/shared/components/BlueGradientCard';
import { lightDarkValues } from 'app/shared/styles/utils';
import AirdropStore from '../state/AirdropStore';
import { inject, observer } from 'mobx-react';
import Button from 'app/shared/components/Button';

const CardWrapper = styled(BlueGradientCard)`
  width: 640px;
  height: auto;
  padding: 40px 16px 40px 16px;
  margin: 74px auto 60px;
  color: #fff;

  @media (max-width: 672px) {
    width: calc(100% - 32px);
    margin: 32px 16px;
  }
`;

const Title = styled.div`
  font-size: 23px;
  font-weight: 600;
  text-align: center;
  margin: 0 auto;
`;

const Message = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  max-width: 540px;
  margin: 16px auto 0;
  text-align: center;
`;

const InputTransparent = styled.input`
  flex: 1;
  display: inline-block;
  background-color: transparent;
  border: none;
  color: ${lightDarkValues(`#333`, `#fff`)};
  font-size: 14px;
  font-weight: 600;
  outline: none;

  ::placeholder {
    color: #a1a8b3;
  }
`;

const StyledButton = styled(Button)`
  background: linear-gradient(0deg, #5460ff 0%, #414eff 100%);
  padding: 8px;
`;

const StyledForm = styled.form`
  display: flex;
  width: 300px;
  margin: 40px auto 0;
  padding: 4px 4px 4px 20px;
  border-radius: 4px;
  background-color: ${lightDarkValues(`#ffffff`, `#1b222f`)};
`;

type Props = {
  airdropStore?: AirdropStore;
};

const AirdropsDescription: React.FC<Props> = ({ airdropStore }: Props) => {
  const [account, setAccount] = useState(airdropStore!.displayAccount);

  const onSubmit = async event => {
    event.preventDefault();
    airdropStore!.changeDisplayAccount(account);
    await airdropStore!.fetchBalances();
  };

  return (
    <CardWrapper>
      <Title>vAirdrops</Title>
      <Message>
        vAirdrop is a new breakthrough technique for distributing tokens on a massive scale using
        Web Oracle Service through a DAPP Service Provider (DSP). vAirdrop can be done at a fraction
        of the cost involved in doing an airdrop in the traditional way.
      </Message>
      <StyledForm onSubmit={onSubmit}>
        <InputTransparent
          id="accountName"
          name="accountName"
          placeholder={airdropStore!.displayAccount || `account`}
          value={account}
          onChange={event => setAccount((event.target as HTMLInputElement).value)}
          autoFocus={!airdropStore!.rootStore.profileStore.isLoggedIn}
          maxLength={13}
        />
        <StyledButton type="submit">Search</StyledButton>
      </StyledForm>
    </CardWrapper>
  );
};

export default inject('airdropStore')(observer(AirdropsDescription));
