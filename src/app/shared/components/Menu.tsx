import React, { useState } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import styled, { css } from 'styled-components';
import onClickOutside from 'react-onclickoutside';

import sixDotsIcon from 'app/shared/icons/six_dots_icon.svg';

const MenuWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

const MenuInput = styled.div`
  position: relative;
  background-color: #263040;
  border-radius: 4px;
  border: none;
  width: 100%;
  padding: 16px 18px;
  color: #67768E;
  font-size: 14px;
  font-family: Montserrat-SemiBold;
`;

const DotsIcon = styled.img`
  position: absolute;
  width: 14px;
  top: 18px;
  right: 18px;
`;

const OptionsList = styled.div`
  position: absolute;
  z-index: 2;
  width: 100%;
  margin-top: 4px;
  padding: 4px 0;
  background-color: #263040;
`;

const OptionItem = styled.div<any>`
  padding: 12px 18px;
  font-size: 15px;
  color: #eee;

  ${props => props.active && css`
    background-color: #0b1422;
    color: #67768e;
  `}

  &:hover {
    background-color: #0b1422;
  }
`;

type Props = {
  text: string
  options: Array<{
    text: string
    value: any
    isActive: boolean
    onClick: () => void
  }>
}

@observer
class Menu extends React.Component<Props> {
  @observable isOpen = false;

  @action toggleIsOpen = () => this.isOpen = !this.isOpen;

  handleClickOutside = () => {
    if (this.isOpen) this.isOpen = false;
  }

  render() {
    const { text, options } = this.props;

    return (
      <MenuWrapper onClick={this.toggleIsOpen}>
        <MenuInput>
          {text}
          <DotsIcon src={sixDotsIcon} />
        </MenuInput>

        {
          this.isOpen &&
          <OptionsList>
            {
              options.map(option =>
                <OptionItem
                  active={option.isActive}
                  onClick={option.onClick}
                  key={option.value}
                >
                  {option.text}
                </OptionItem>
              )
            }
          </OptionsList>
        }
      </MenuWrapper>
    )
  }
}

export default onClickOutside(Menu);
