import React from 'react'
import BlueGradientCard from 'app/shared/components/BlueGradientCard';
import styled from 'styled-components';
import ProfileStore from '../state/ProfileStore';
import { inject, observer } from 'mobx-react';

const CardWrapper = styled(BlueGradientCard)`
  width: 640px;
  height: auto;
  padding: 32px 16px;
  margin: 74px auto 97px;

  @media (max-width: 672px) {
    width: calc(100% - 32px);
    margin: 32px 16px;
  }
`;

const Title = styled.div`
  font-size: 23px;
  font-weight: 600;
  margin: 0 auto;
`;

const Message = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  max-width: 400px;
  margin: 8px auto 0;
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
}

const AuthRequiredCard = ({ profileStore }: Props) => {
  return (
    <CardWrapper>
      <Title>
        The DSP Portal
      </Title>
      <Message>
        dApp Service Providers (DSPs) provide the tools that help developers work more effectively.
      </Message>
      <CtaButton onClick={() => {
        const loginMenu = document.querySelector('#login-menu');
        // @ts-ignore
        if (loginMenu) loginMenu.click()
      }}>
        {
          profileStore!.isLoggingIn
          ? 'Logging in...'
          : 'Login to Get Started'
        }
      </CtaButton>
    </CardWrapper>
  )
}

export default inject('profileStore')(observer(AuthRequiredCard));
