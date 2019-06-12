import React from 'react'
import styled from 'styled-components';

import { menuFactory, _OptionsList, _OptionItem } from 'app/shared/components/Menu';
import Button from 'app/shared/components/Button';


const MenuInput = styled(Button)`
  background: linear-gradient(0deg, #5460ff 0%, #414eff 100%);
`;

const OptionsList = styled(_OptionsList)`
  width: auto;
  right: 0;
  margin-top: 16px;
  padding: 16px 0;
  background-color: #273041;
`;

const OptionItem = styled(_OptionItem)`
  padding: 10px 36px;
`;

export const LoginMenu = menuFactory({
  MenuInput,
  OptionsList,
  OptionItem,
  iconSrc: "",
});

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 180px;
`;

const IconWrapper = styled.div<any>`
  margin-left: auto;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-image: url(${props => props.iconSrc});
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
`;

export const LoginOptionContent = ({ text, icon }) => (
  <ContentWrapper>
    <div>{text}</div>
    <IconWrapper iconSrc={icon} />
  </ContentWrapper>
);
