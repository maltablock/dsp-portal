import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import UiStore from 'app/root/state/UiStore';
import { ReactComponent as Logo } from 'app/shared/assets/logo-maltablock.svg';
import { MainNavigationTab } from 'app/shared/components/Tabs';
import { media } from 'app/shared/styles/breakpoints';
import { LeftBlock, LoginControls, RightBlock, ThemeToggle, LogoText } from './TopBarShared';

const MainNavigation = styled.div`
  height: 100%;
  margin-left: 0;

  ${media.greaterThan('sm')} {
    margin-left: 20px;
  }

  ${media.greaterThan('md')} {
    margin-left: 40px;
  }

  ${media.greaterThan('lg')} {
    margin-left: 90px;
  }
`;

type Props = {
  uiStore?: UiStore;
};

const TopBar = ({ uiStore }: Props) => {
  return (
    <React.Fragment>
      <LeftBlock>
        <Logo width={48} height={48} />
        <LogoText>Malta Block</LogoText>
        <MainNavigation>
          <MainNavigationTab
            active={uiStore!.mainNavigation === 'DSP Services'}
            onClick={() => uiStore!.changeMainNavigation('DSP Services')}
          >
            DSP Services
          </MainNavigationTab>
          <MainNavigationTab
            active={uiStore!.mainNavigation === 'LiquidAirdrops'}
            onClick={() => uiStore!.changeMainNavigation('LiquidAirdrops')}
          >
            LiquidAirdrops
          </MainNavigationTab>
        </MainNavigation>
      </LeftBlock>

      <RightBlock>
        <ThemeToggle />
        <LoginControls />
      </RightBlock>
    </React.Fragment>
  );
};

export default inject('profileStore', 'uiStore')(observer(TopBar));
