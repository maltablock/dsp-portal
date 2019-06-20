import React from 'react';
import styled from 'styled-components';

import { ReactComponent as CheckIcon } from 'app/shared/icons/check_icon.svg';
import { lightDarkValues } from '../styles/utils';

const Wrapper = styled.div<any>`
  position: relative;
  width: 24px;
  height: 24px;

  border-radius: 50%;
  border: 2px solid;
  border-color: ${props => (props.checked ? props.color : lightDarkValues('#172131', '#fff'))};
  background-color: ${props => props.checked ? props.color : 'none'};

  svg {
    top: -2px;
    left: -2px;
    position: absolute;
  }

  * {
    fill: ${lightDarkValues('#fff', '#000')};
  }
`;

type Props = {
  checked: boolean
  color?: string
  onClick?: (...any) => any
}

const Checkbox = (props: Props) => {

  return (
    <Wrapper {...props}>
      {
        props.checked &&
        <CheckIcon />
      }
    </Wrapper>
  );
};

export default Checkbox;
