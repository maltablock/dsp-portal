import React from 'react'
import styled from 'styled-components';

import arrowDownIcon from 'app/shared/icons/arrow_down.svg';
import { menuFactory, _MenuInput, _MenuWrapper, _Icon, _OptionsList, _OptionItem } from './Menu';

const MenuInput = styled(_MenuInput)`
  color: #fff;
  background-color: #111520;
  width: auto;
  padding: 16px 8px;
  padding-right: 32px;
  text-align: right;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
`;

const Icon = styled(_Icon)`
  width: 24px;
  top: 14px;
  right: 2px;
`;

const OptionsList = styled(_OptionsList)`
  margin-top: -2px;
`;

const OptionItem = styled(_OptionItem)`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
`;

const MenuSimple = menuFactory({
  MenuInput,
  Icon,
  iconSrc: arrowDownIcon,
  OptionsList,
  OptionItem,
})

export default MenuSimple
