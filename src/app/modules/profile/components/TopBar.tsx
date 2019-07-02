import { lightDarkValues } from 'app/shared/styles/utils';
import { inject, observer } from 'mobx-react';
import React from 'react';
import Media from 'react-media';
import styled from 'styled-components';
import TopBarDesktop from './TopBarDesktop';
import TopBarMobile from './TopBarMobile';
import { TOP_BAR_HEIGHT } from './TopBarShared'


const MOBILE_WIDTH = 960;

const BackgroundDrop = styled.div`
  height: ${TOP_BAR_HEIGHT}px;
  background-color: ${lightDarkValues('#ffffff99', '#1b222f99')};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  padding: 8px 16px;
  width: 100%;
  height: 100%;
  max-width: 1440px;
`;

const TopBar = () => {
  return (
    <BackgroundDrop>
      <Wrapper>
        <Media query={`(max-width: ${MOBILE_WIDTH}px)`}>
          {matches => (matches ? <TopBarMobile /> : <TopBarDesktop />)}
        </Media>
      </Wrapper>
    </BackgroundDrop>
  );
};

export default inject('profileStore', 'uiStore')(observer(TopBar));
