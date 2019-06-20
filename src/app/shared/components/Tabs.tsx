import React from 'react';
import styled from 'styled-components';
import { lightDarkValues } from '../styles/utils';

export const TabsWrapper = styled.div`
  display: flex;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
`;

export const Tab = styled.div<any>`
  width: 100%;
  padding: 16px 40px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  color: ${props => (props.active ? '#fff' : '#67768E')};
  background-color: ${props => (props.active ? '#414DFF' : lightDarkValues('#e7ebf2', '#263040'))};

  transition: border-color 0s;

  &:not(:last-child) {
    border-right: 1px solid;
    border-color: ${lightDarkValues('#d6d7dc', '#10131f')};
  }
`;
