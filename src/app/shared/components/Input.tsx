import React from 'react'
import styled from 'styled-components';
import { lightDarkValues } from '../styles/utils';

const InputWrapper = styled.div`
  position: relative;
`;

export const InputElement = styled.input`
  background-color: ${lightDarkValues('#e7ebf2', '#fff')};
  border-radius: 4px;
  border: none;
  width: 100%;
  padding: 11px 16px;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  outline: none;

  ::placeholder {
    color: #A1A8B3;
  }
`;

const InputRightLabel = styled.div`
  color: #A1A8B3;
  position: absolute;
  top: 0;
  right: 0;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 700;
`;

const Input = ({
  value,
  onChange,
  placeholder = '',
  autoFocus = false,
  label = '',
  ...inputProps
}) => {
  return (
    <InputWrapper>
      <InputElement
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        {...inputProps}
      />
      <InputRightLabel>{label}</InputRightLabel>
    </InputWrapper>
  )
}

export default Input
