import React from 'react';
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';
import { ProfileStore } from 'app/modules/profile';
import MenuSimple from 'app/shared/components/MenuSimple';
import { LoginMenu, LoginOptionContent } from './LoginMenu';

import scatterIcon from 'app/shared/icons/scatter_icon.svg';
import ledgerIcon from 'app/shared/icons/ledger_icon.png';
import lynxIcon from 'app/shared/icons/lynx_icon.jpg';
import meetOneIcon from 'app/shared/icons/meet_one_icon.jpg';
import tokenPocketIcon from 'app/shared/icons/token_pocket_icon.jpg';
import { WALLETS } from 'app/shared/eos/constants';
import UiStore from 'app/root/state/UiStore';
import ToggleButton from 'app/shared/components/ToggleButton';
import darkModeIcon from 'app/shared/icons/darkmode_icon.svg';
import lightModeIcon from 'app/shared/icons/icon-lightmode.svg';

export const TOP_BAR_HEIGHT = 66;

export const LeftBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;

export const RightBlock = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
`;

export const LoginControlsWrapper = styled.div`
  display: flex;
  align-items: center;

  & > :not(:last-child) {
    margin-right: 16px;
  }
`;

export const LogoText = styled.div`
  font-size: 19px;
  font-weight: bold;
  margin-left: 12px;

  @media (max-width: 670px) {
    display: none;
  }
`;


const MenuWrapper = styled.div`
  /* width: 150px; */
`;

type LoginControlsProps = {
  profileStore?: ProfileStore;
};

const _LoginControls = ({ profileStore }: LoginControlsProps) => {
  const { login } = profileStore!;

  if (profileStore!.isLoggedIn)
    return (
      <MenuSimple
        transparentBg
        text={profileStore!.accountInfo!.account_name}
        options={[{ content: 'Logout', value: 'logout', onClick: profileStore!.logout }]}
      />
    );

  return (
    <LoginControlsWrapper>
      <MenuWrapper>
        <MenuSimple
          transparentBg
          text={profileStore!.eosNetwork === 'kylin' ? 'Kylin Testnet' : 'Mainnet'}
          options={[
            { content: 'Mainnet', value: 'mainnet' },
            { content: 'Kylin Testnet', value: 'kylin' },
          ].map(({ content, value }) => ({
            content,
            value,
            isActive: profileStore!.eosNetwork === value,
            onClick: profileStore!.setEosNetwork,
          }))}
        />
      </MenuWrapper>
      <LoginMenu
        id="login-menu"
        text={profileStore!.isLoggingIn ? 'Logging in...' : 'Login'}
        options={[
          {
            text: 'Scatter',
            icon: scatterIcon,
            wallet: WALLETS.scatter,
          },
          {
            text: 'Ledger',
            icon: ledgerIcon,
            wallet: WALLETS.ledger,
          },
          {
            text: 'Lynx',
            icon: lynxIcon,
            wallet: WALLETS.lynx,
          },
          {
            text: 'Meet.One',
            icon: meetOneIcon,
            wallet: WALLETS.meetone,
          },
          {
            text: 'TokenPocket',
            icon: tokenPocketIcon,
            wallet: WALLETS.tokenpocket,
          },
        ].map(({ text, icon, wallet }) => ({
          content: <LoginOptionContent text={text} icon={icon} />,
          value: wallet,
          onClick: () => login(wallet),
        }))}
      />
    </LoginControlsWrapper>
  );
};

export const LoginControls = inject('profileStore')(observer(_LoginControls));

const ThemeIcon = styled.img`
  margin: 0 12px 0 12px;
`;

type ThemeToggleProps = {
  uiStore?: UiStore;
};

const _ThemeToggle = ({ uiStore }: ThemeToggleProps) => {
  return (
    <React.Fragment>
      <ThemeIcon src={lightModeIcon} />
      <ToggleButton checked={uiStore!.mode === 'dark'} onClick={uiStore!.toggleTheme} />
      <ThemeIcon src={darkModeIcon} />
    </React.Fragment>
  );
};

export const ThemeToggle = inject('uiStore')(observer(_ThemeToggle));
