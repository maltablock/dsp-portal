import React from 'react';
import styled from 'styled-components';

import BlueGradientCard from 'app/shared/components/BlueGradientCard';


const CardWrapper = styled(BlueGradientCard)`
  width: 640px;
  height: auto;
  padding: 40px 16px 40px 16px;
  margin: 74px auto 97px;
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

const AirdropsDescription = () => {
  return <CardWrapper>
  <Title>vAirdrops</Title>
  <Message>
    This portal allows claiming any vAirdropped token. vAirdrop is a new kind of airdrop of LiquidApps and Malta Block that does not require any RAM for the initial token distribution.
  </Message>
</CardWrapper>
};

export default AirdropsDescription
