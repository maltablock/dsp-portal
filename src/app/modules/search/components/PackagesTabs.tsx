import React from 'react'
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import { ProfileStore } from 'app/modules/profile';
import { SearchStore } from 'app/modules/search';
import { TabsWrapper, Tab as _Tab } from 'app/shared/components/Tabs';

const Wrapper = styled.div`
  display: flex;
  margin: 0 auto 16px;

  @media (max-width: 670px) {
    width: calc(100% - 32px);
    overflow-x: auto;
    margin: 0 16px 16px;
  }
`;

const Tab = styled(_Tab)`
  width: 170px;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

type Props = {
  searchStore?: SearchStore
  profileStore?: ProfileStore
}

const PackagesTabs = (props: Props) => {
  const { selectedTab, handleSelectTab } = props.searchStore!;
  const { isLoggedIn } = props.profileStore!;

  const tabs = ['Packages', isLoggedIn ? 'Staked' : '', 'DSPs', 'Services'].filter(Boolean)

  return (
    <Wrapper>
      <TabsWrapper>
        {
          tabs.map(tabName =>
            <Tab key={tabName} active={selectedTab === tabName} onClick={() => handleSelectTab(tabName)}>
              {tabName}
            </Tab>
          )
        }
      </TabsWrapper>
    </Wrapper>
  )
}

export default inject('searchStore', 'profileStore')(observer(PackagesTabs));
