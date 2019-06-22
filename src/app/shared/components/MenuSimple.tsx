import styled from 'styled-components';

import arrowDownIcon from 'app/shared/icons/arrow_down.svg';
import { menuFactory, _MenuInput, _Icon, _OptionsList, _OptionItem } from './Menu';
import { lightDarkValues } from '../styles/utils';

const MenuInput = styled(_MenuInput)`
  background-color: ${props =>
    props.transparentBg ? 'transparent' : lightDarkValues('#e7ebf2', '#111520')};
  color: ${lightDarkValues('#333', '#fff')};
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
  max-height: 300px;
  overflow-y: scroll;
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
