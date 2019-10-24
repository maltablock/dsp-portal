import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import { ReactComponent as Logo } from 'app/shared/assets/logo-maltablock.svg';
import { MainNavigationTab } from 'app/shared/components/Tabs';
import { media } from 'app/shared/styles/breakpoints';
import { LeftBlock, LoginControls, RightBlock, ThemeToggle, LogoText } from './TopBarShared';
import { WithRouterProps } from 'app/shared/typings';
import { ROUTES_LIST } from 'app/root/constants/routes';

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

const TopBar = ({ location: { pathname } }: WithRouterProps) => {
  return (
    <React.Fragment>
      <LeftBlock>
        <Logo width={48} height={48} />
        <LogoText>Malta Block</LogoText>
        <MainNavigation>
          {
            ROUTES_LIST.map(({ path, text }) =>
              <Link to={path}>
                <MainNavigationTab active={path === pathname}>
                  {text}
                </MainNavigationTab>
              </Link>
            )
          }
        </MainNavigation>
      </LeftBlock>

      <RightBlock>
        <ThemeToggle />
        <LoginControls />
      </RightBlock>
    </React.Fragment>
  );
};

export default withRouter(TopBar);
