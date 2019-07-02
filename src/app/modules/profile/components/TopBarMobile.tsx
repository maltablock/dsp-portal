import UiStore from 'app/root/state/UiStore';
import { ReactComponent as Logo } from 'app/shared/assets/logo-maltablock.svg';
import { ReactComponent as CloseIcon } from 'app/shared/icons/icon-menu-close.svg';
import { ReactComponent as MenuIcon } from 'app/shared/icons/icon-menu.svg';
import { lightDarkValues } from 'app/shared/styles/utils';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  LeftBlock,
  LoginControls,
  RightBlock,
  ThemeToggle,
  TOP_BAR_HEIGHT,
  LogoText,
} from './TopBarShared';
import { MainNavigationTab } from 'app/shared/components/Tabs';

const MenuIconWrapper = styled.button`
  margin-left: 16px;
  & > svg {
    vertical-align: middle;
  }

  background: none;
  border: none;
  cursor: pointer;
`;

const MobileOverlay = styled.div`
  background-color: ${lightDarkValues('#ffffff', '#1b222f')};
  position: fixed;
  z-index: 99999;
  top: ${TOP_BAR_HEIGHT}px;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 40px 0;
`;

const MainNavigationTabMobile = styled(MainNavigationTab)`
  height: 40px;
  margin-bottom: 40px;
`

type Props = {
  uiStore?: UiStore;
};

const TopBar = ({ uiStore }: Props) => {
  const [showMenu, setMenuVisible] = useState(false);

  // prevent scrolling in body when menu is open
  useEffect(() => {
    if (showMenu) document.body.classList.add('modal-open');

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showMenu]);

  const MatchingMenuIcon = showMenu ? CloseIcon : MenuIcon;

  return (
    <React.Fragment>
      <LeftBlock>
        <Logo width={48} height={48} />
        <LogoText>Malta Block</LogoText>
      </LeftBlock>

      <RightBlock>
        <LoginControls />
        <MenuIconWrapper onClick={() => setMenuVisible(prev => !prev)}>
          <MatchingMenuIcon width={16} height={16} />
        </MenuIconWrapper>
      </RightBlock>
      {showMenu && (
        <MobileOverlay>
          <MainNavigationTabMobile
            active={uiStore!.mainNavigation === 'DSP Services'}
            onClick={() => (setMenuVisible(false), uiStore!.changeMainNavigation('DSP Services'))}
          >
            DSP Services
          </MainNavigationTabMobile>
          <MainNavigationTabMobile
            active={uiStore!.mainNavigation === 'vAirdrops'}
            onClick={() => (setMenuVisible(false), uiStore!.changeMainNavigation('vAirdrops'))}
          >
            vAirdrops
          </MainNavigationTabMobile>
          <div>
            <ThemeToggle />
          </div>
        </MobileOverlay>
      )}
    </React.Fragment>
  );
};

export default inject('uiStore')(observer(TopBar));
