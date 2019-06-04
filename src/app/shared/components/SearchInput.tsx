import React from 'react';
import styled from 'styled-components';

import searchIcon from 'app/shared/icons/search_icon.svg'
import closeIcon from 'app/shared/icons/close_icon.svg'

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const InputElement = styled.input`
  background-color: #263040;
  border-radius: 4px;
  border: none;
  width: 100%;
  padding: 15px 62px;
  color: #fff;
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

const CloseIcon = styled.img`
  position: absolute;
  top: 18px;
  right: 20px;
  width: 14px;
  height: 14px;
  cursor: pointer;
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
        <CloseIcon src={closeIcon} onClick={onClear} />
      }
    </InputWrapper>
  )
}

export default SearchInput
