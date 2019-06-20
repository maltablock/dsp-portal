import React from 'react';
import styled from 'styled-components';

import BlueGradientCard from 'app/shared/components/BlueGradientCard';
import Button from 'app/shared/components/Button';

export const DialogContainer = styled.div`
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
`;

export const DialogCard = styled(BlueGradientCard)`
  width: auto;
  height: auto;
  display: flex;
  margin: 200px auto 0;
  padding: 40px 32px;
  > * {
    margin-left: auto;
    margin-right: auto;
  }
`;

export const Title = styled.div`
  font-size: 23px;
`;

export const ButtonsWrapper = styled.div`
  margin-top: 40px;
`;

export const SubmitButton = styled(Button)`
  background: #0b1422;
  padding: 11px 36px;
  font-size: 14px;
`;
