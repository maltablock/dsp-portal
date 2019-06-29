import styled from 'styled-components';
import { lightDarkValues } from '../styles/utils';

export const TabsWrapper = styled.div`
  display: flex;
  width: 100%;
  border-radius: 4px;
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

export const MainNavigationTab = styled.button<any>`
  position: relative;
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  padding: 0 36px;
  height: 100%;

  color: ${lightDarkValues('#ffff00', '#ffffff')};
  background: transparent;

  transition: border-color 0s;
  border: none;
  cursor: pointer;
  outline: inherit;

  &::after {
    position: absolute;
    display: ${props => (props.active ? `block` : 'none')};
    content: ' ';
    height: 7px;
    bottom: -8px;
    left: 0;
    right: 0;
    background: ${props => (props.active ? lightDarkValues('blue', 'linear-gradient(180deg, #414DFF 0%, #5660FF 100%)') : 'transparent')};
  }
`;
