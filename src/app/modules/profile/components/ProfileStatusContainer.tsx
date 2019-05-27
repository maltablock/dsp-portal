import React from 'react';
import AuthRequiredCard from './AuthRequiredCard';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 74px auto 97px;
`;

const ProfileStatusContainer = () => {
  return (
    <Wrapper>
      <AuthRequiredCard />
    </Wrapper>

  )
}

export default ProfileStatusContainer;
