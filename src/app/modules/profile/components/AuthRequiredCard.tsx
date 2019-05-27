import React from 'react'
import BlueGradientCard from 'app/shared/components/BlueGradientCard';
import styled from 'styled-components';

const Wrapper = styled(BlueGradientCard)`
  width: 640px;
  padding: 32px 16px;
`;

const Title = styled.div`
  font-size: 23px;
  font-family: Montserrat-Bold;
  margin: 0 auto;
`;

const Message = styled.div`
  font-family: Montserrat;
  font-size: 16px;
  line-height: 1.5;
  width: 400px;
  margin: 8px auto 0;
  text-align: center;
`;

const CtaButton = styled.div`
  font-family: Montserrat-Bold;
  font-size: 16px;
  margin: 26px auto 0;
  cursor: pointer;
`;

const AuthRequiredCard = () => {
  return (
    <Wrapper>
      <Title>
        The DSP Portal
      </Title>
      <Message>
        dApp Service Providers (DSPs) provide the tools that help developers work more effectively.
      </Message>
      <CtaButton>
        Login to Get Started
      </CtaButton>
    </Wrapper>
  )
}

export default AuthRequiredCard
