import React from 'react';
import styled, { css } from 'styled-components';

const Wrapper = styled.div<{ size: number }>`
  position: relative;
  display: inline-block;
  width: ${props => props.size * 2}px;
  height: ${props => props.size}px;
`;

const Slider = styled.div<{ size: number, checked: boolean, alwaysActiveBg: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => (props.checked || props.alwaysActiveBg) ? '#414DFF' : '#d4dae3'};
  border-radius: 16px;
  transition: 0.4s;

  ::before {
    position: absolute;
    content: '';
    height: ${props => props.size - 4}px;
    width: ${props => props.size - 4}px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;

    ${props =>
      props.checked &&
      css`
        transform: translateX(${props.size}px);
      `}
  }
`;



type Props = {
  checked: boolean
  size?: number
  alwaysActiveBg?: boolean
  onClick?: (...any) => any
}

const ToggleButton = ({ checked, onClick, size = 16, alwaysActiveBg = false }: Props) => {
  return (
    <Wrapper onClick={onClick} size={size}>
      <Slider checked={checked} size={size} alwaysActiveBg={alwaysActiveBg} />
    </Wrapper>
  );
};

export default ToggleButton;
