import React from 'react'
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import { ProfileStore } from 'app/modules/profile';
import { SearchStore } from 'app/modules/search';
import { TabsWrapper, Tab as _Tab } from 'app/shared/components/Tabs';

const Wrapper = styled.div`
  display: flex;
  margin: 0 auto 16px;
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

  const tabs = ['Packages', isLoggedIn && 'Staked', 'DSPs'].filter(Boolean)

  return (
    <Wrapper>
      <TabsWrapper>
        {
          tabs.map(tabName =>
            <Tab active={selectedTab === tabName} onClick={() => handleSelectTab(tabName)}>
              {tabName}
            </Tab>
          )
        }
      </TabsWrapper>
    </Wrapper>
  )
}

export default inject('searchStore', 'profileStore')(observer(PackagesTabs));
