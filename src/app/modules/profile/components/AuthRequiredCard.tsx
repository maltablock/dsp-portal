import React from 'react';
import BlueGradientCard from 'app/shared/components/BlueGradientCard';
import styled from 'styled-components';
import { ReactComponent as Logo } from 'app/shared/assets/logo-maltablock.svg';
import ProfileStore from '../state/ProfileStore';
import { inject, observer } from 'mobx-react';

const CardWrapper = styled(BlueGradientCard)`
  width: 640px;
  height: auto;
  padding: 16px;
  margin: 74px auto 97px;

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

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const Message = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  max-width: 540px;
  margin: 16px auto 0;
  text-align: center;
`;

const CtaButton = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin: 26px auto 0;
  cursor: pointer;
`;

type Props = {
  profileStore?: ProfileStore;
};

const AuthRequiredCard = ({ profileStore }: Props) => {
  return (
    <CardWrapper>
      <LogoWrapper>
        <Logo width={60} height={60} />
      </LogoWrapper>
      <Title>Malta Block DSP Portal</Title>
      <Message>
        This portal allow developers to use dApp Service Providers (DSPs) to work more effectively.
        Select a service to stake DAPP to use.
      </Message>
      <CtaButton
        onClick={() => {
          const loginMenu = document.querySelector('#login-menu');
          // @ts-ignore
          if (loginMenu) loginMenu.click();
        }}
      >
        {profileStore!.isLoggingIn ? 'Logging in...' : 'Login to Get Started'}
      </CtaButton>
    </CardWrapper>
  );
};

export default inject('profileStore')(observer(AuthRequiredCard));
