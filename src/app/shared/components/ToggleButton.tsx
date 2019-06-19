import React from 'react';
import styled, { css } from 'styled-components';

const Wrapper = styled.div<any>`
  position: relative;
  display: inline-block;
  width: 32px;
  height: 16px;
`;

const Slider = styled.div<any>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.checked ? '#414DFF' : '#E7EBF2'};
  border-radius: 16px;
  transition: 0.4s;

  ::before {
    position: absolute;
    content: '';
    height: 12px;
    width: 12px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;

    ${props =>
      props.checked &&
      css`
        transform: translateX(16px);
      `}
  }
`;



type Props = {
  checked: boolean
  onClick?: (...any) => any
}

const ToggleButton = ({ checked, onClick }: Props) => {
  return (
    <Wrapper onClick={onClick}>
      <Slider checked={checked} />
    </Wrapper>
  );
};

export default ToggleButton;
