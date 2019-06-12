import React from 'react'
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';

import { ProfileStore } from 'app/modules/profile';
import maltablockIcon from 'app/shared/icons/malta_block_icon.png';
import Button from 'app/shared/components/Button';
import MenuSimple from 'app/shared/components/MenuSimple';
import { LoginMenu, LoginOptionContent } from './LoginMenu';

import scatterIcon from 'app/shared/icons/scatter_icon.svg';
import ledgerIcon from 'app/shared/icons/ledger_icon.png';
import lynxIcon from 'app/shared/icons/lynx_icon.jpg';
import meetOneIcon from 'app/shared/icons/meet_one_icon.jpg';
import tokenPocketIcon from 'app/shared/icons/token_pocket_icon.jpg';
import { WALLETS } from 'app/shared/eos/constants';


const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  padding: 8px 16px;
  width: 100%;

  @media (min-width: 1440px) {
    width: 1440px;
  }
`;

const LeftBlock = styled.div``;

const RightBlock = styled.div`
  margin-left: auto;
`;

const Logo = styled.img`
  width: 48px;
  height: 48px;
  width: auto;
`;

const LoginControlsWrapper = styled.div`
  display: flex;
  align-items: center;

  & > :not(:last-child) {
    margin-right: 16px;
  }
`;

const MenuWrapper = styled.div`
  width: 150px;
`;

const LoginButton = styled(Button)`
  background: linear-gradient(0deg, #5460ff 0%, #414eff 100%);
`;

type Props = {
  profileStore?: ProfileStore
}

const TopBar = ({ profileStore }: Props) => {
  const { login } = profileStore!;

  return (
    <Wrapper>
      <LeftBlock>
        <Logo src={maltablockIcon} />
      </LeftBlock>

      <RightBlock>
        {
          profileStore!.isLoggedIn
          ? <MenuSimple
              text={profileStore!.accountInfo!.account_name}
              options={[
                { content: "Logout", value: "logout", onClick: profileStore!.logout}
              ]}
            />
          : <LoginControlsWrapper>
              <MenuWrapper>
                <MenuSimple
                  text={profileStore!.eosNetwork === 'kylin' ? 'Kylin Testnet' : 'Mainnet'}
                  options={
                    [
                      { content: 'Mainnet', value: 'mainnet'},
                      { content: 'Kylin Testnet', value: 'kylin' }
                    ].map(
                      ({ content, value }) => ({
                        content,
                        value,
                        isActive: profileStore!.eosNetwork === value,
                        onClick: profileStore!.setEosNetwork,
                      })
                    )
                  }
                />
              </MenuWrapper>
              <LoginMenu
                id="login-menu"
                text={profileStore!.isLoggingIn ? 'Logging in...' : 'Login'}
                options={[
                  {
                    text: 'Scatter',
                    icon: scatterIcon,
                    wallet: WALLETS.scatter
                  },
                  {
                    text: 'Ledger',
                    icon: ledgerIcon,
                    wallet: WALLETS.ledger
                  },
                  {
                    text: 'Lynx',
                    icon: lynxIcon,
                    wallet: WALLETS.lynx
                  },
                  {
                    text: 'Meet.One',
                    icon: meetOneIcon,
                    wallet: WALLETS.meetone
                  },
                  {
                    text: 'TokenPocket',
                    icon: tokenPocketIcon,
                    wallet: WALLETS.tokenpocket
                  }
                ].map(({ text, icon, wallet }) => ({
                  content: <LoginOptionContent text={text} icon={icon} />,
                  onClick: () => login(wallet)
                }))}
              />
            </LoginControlsWrapper>
        }
      </RightBlock>
    </Wrapper>
  )
}

export default inject('profileStore')(observer(TopBar));
