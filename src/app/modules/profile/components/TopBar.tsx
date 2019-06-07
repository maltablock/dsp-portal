import React from 'react'
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';

import { ProfileStore } from 'app/modules/profile';
import maltablockIcon from 'app/shared/icons/malta_block_icon.png';
import Button from 'app/shared/components/Button';
import MenuSimple from 'app/shared/components/MenuSimple';

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
  & > :not(:last-child) {
    margin-right: 16px;
  }
`;

const LoginButton = styled(Button)`
  background: linear-gradient(0deg, #5460ff 0%, #414eff 100%);
`;

type Props = {
  profileStore?: ProfileStore
}

const TopBar = ({ profileStore }: Props) => {
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
                { text: "Logout", value: "logout", onClick: profileStore!.logout}
              ]}
            />
          : <LoginControlsWrapper>
              <MenuSimple
                text={profileStore!.eosNetwork === 'kylin' ? 'Testnet' : 'Mainnet'}
                options={
                  [
                    { text: 'Mainnet', value: 'mainnet'},
                    { text: 'Testnet', value: 'kylin' }
                  ].map(
                    ({ text, value }) => ({
                      text,
                      value,
                      isActive: profileStore!.eosNetwork === value,
                      onClick: profileStore!.setEosNetwork,
                    })
                  )
                }
              />
              <LoginButton
                type="button"
                onClick={profileStore!.login}
                disabled={profileStore!.isLoggingIn}
              >
                {profileStore!.isLoggingIn ? 'Logging in...' : 'Login'}
              </LoginButton>
            </LoginControlsWrapper>
        }
      </RightBlock>
    </Wrapper>
  )
}

export default inject('profileStore')(observer(TopBar));
