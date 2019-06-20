import React from 'react'
import styled from 'styled-components';

const StakingIconWrapper = styled.div`
  background-color: #5660FF;
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StakingIcon = () => {
  return (
    <StakingIconWrapper>
      S
    </StakingIconWrapper>
  )
}

export default StakingIcon
