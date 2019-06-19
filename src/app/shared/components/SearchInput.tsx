import React from 'react';
import styled from 'styled-components';

import searchIcon from 'app/shared/icons/search_icon.svg'
import { ReactComponent as CloseIconSvg } from 'app/shared/icons/close_icon.svg'
import { lightDarkValues } from '../styles/utils';

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const InputElement = styled.input`
  color: ${lightDarkValues('#555', '#fff')};
  background-color: ${lightDarkValues('#e7ebf2', '#263040')};
  border-radius: 4px;
  border: none;
  width: 100%;
  padding: 15px 62px;
  font-size: 15px;
  font-weight: 600;
  outline: none;

  ::placeholder {
    color: #8CA0C2;
  }
`;

const SearchIcon = styled.img`
  position: absolute;
  top: 15px;
  left: 20px;
`;

const CloseIcon = styled.div`
  position: absolute;
  top: 18px;
  right: 20px;
  width: 14px;
  height: 14px;
  cursor: pointer;

  svg > * {
    fill: #8ca0c2;
  }
`;

const SearchInput = ({
  placeholder,
  value,
  onChange,
  isClearSearchVisible,
  onClear,
}) => {
  return (
    <InputWrapper>
      <SearchIcon src={searchIcon} />

      <InputElement
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {
        isClearSearchVisible &&
        <CloseIcon onClick={onClear}><CloseIconSvg/></CloseIcon>
      }
    </InputWrapper>
  )
}

export default SearchInput
