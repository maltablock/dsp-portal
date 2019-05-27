import React from 'react'
import styled from 'styled-components';
import maltablockIcon from 'app/shared/icons/malta_block_icon.png';
import Button from 'app/shared/components/Button';

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
  return (
    <Wrapper>
      <Logo src={maltablockIcon} />
      <LoginButton>Login</LoginButton>
    </Wrapper>
  )
}

export default TopBar;
