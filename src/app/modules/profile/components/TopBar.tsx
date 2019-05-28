import React from 'react'
import styled from 'styled-components';
import maltablockIcon from 'app/shared/icons/malta_block_icon.png';
import Button from 'app/shared/components/Button';
import { wallet } from 'app/shared/eos';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  padding: 8px 24px;
  width: 100%;

  @media (min-width: 1440px) {
    width: 1440px;
  }
`;

const Logo = styled.img`
  width: 48px;
  height: 48px;
  width: auto;
`;

const LoginButton = styled(Button)`
  margin-left: auto;
  background: linear-gradient(0deg, #5460ff 0%, #414eff 100%);
`;

const TopBar = () => {
  const handleLogin = React.useCallback(async () => {
    try {
      await wallet.connect();
      // last Scatter login is saved, need to remove to be able to login again
      if(wallet.accountInfo) {
        await wallet.logout();
      }
      const accountInfo = await wallet.login();

      // can use accountInfo.account_name to display login
      console.log(accountInfo)
    } catch (error) {
      console.error(error.message)
    }
  }, [])

  return (
    <Wrapper>
      <Logo src={maltablockIcon} />
      <LoginButton type="button" onClick={handleLogin}>Login</LoginButton>
    </Wrapper>
  )
}

export default TopBar;
