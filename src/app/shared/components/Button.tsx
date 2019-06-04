import React from 'react'
import styled from 'styled-components';

const Button = styled.button<any>`
  padding: 11px 28px;
  /* background-color: ${props => props.color || '#5826FF'}; */
  background-color: #5826FF;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 4px;
  opacity: ${props => props.disabled ? 0.4 : 1};
  transition: opacity 0.2s ease;
`;

export default Button;
