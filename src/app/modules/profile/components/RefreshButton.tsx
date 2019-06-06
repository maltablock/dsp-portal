import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Icon } from 'app/shared/assets/icon-refresh.svg';


const IconWrapper = styled.button`
  display: inline-flex;
  margin: 0 0 0 8px;
  padding: 0;
  background: #fff;
  height: 24px;
  width: 24px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export default function RefreshButton(props) {
  return (
    <IconWrapper {...props}>
      <Icon width="16" height="16" />
    </IconWrapper>
  );
}
