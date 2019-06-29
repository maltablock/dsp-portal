import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import { SearchStore } from 'app/modules/search';
import { DialogStore } from 'app/modules/dialogs';
import DappPackageCard from 'app/modules/packages/components/DappPackageCard';
import StakedPackageCard from 'app/modules/packages/components/StakedPackageCard';
import { DspTable, ServiceTable } from 'app/modules/dsp';

import { ProfileStatusContainer } from 'app/modules/profile';
import { SearchBar, PackagesTabs } from 'app/modules/search';

const Wrapper = styled.div`
  margin: 0 auto 16px;
  width: ${976 + 16 * 2}px;

  @media (min-width: 672px) and (max-width: 1008px) {
    width: ${640 + 16 * 2}px;
  }

  @media (max-width: 671px) {
    width: 100%;
    overflow-x: scroll;
  }
`;


type Props = {
  searchStore?: SearchStore;
  dialogStore?: DialogStore;
};

const DspServicesContent = ({ searchStore, dialogStore }: Props) => {
  let content;
  switch (searchStore!.selectedTab) {
    case 'Staked': {
      content = searchStore!.sortedStakedPackages.map(p => (
        <StakedPackageCard key={p.data.id} dialogStore={dialogStore!} stakedPackage={p} />
      ));
      break;
    }
    case 'Packages': {
      content = searchStore!.sortedDappPackages.map(p => (
        <DappPackageCard key={p.data.id} dialogStore={dialogStore!} dappPackage={p} />
      ));
      break;
    }
    case 'Services': {
      content = <ServiceTable />;
      break;
    }
    case 'DSPs':
    default: {
      content = <DspTable />;
      break;
    }
  }

  return (
    <React.Fragment>
      <ProfileStatusContainer />
      <PackagesTabs />
      <SearchBar />
      <Wrapper>{content}</Wrapper>
    </React.Fragment>
  );
};

export default inject('searchStore', 'dialogStore')(observer(DspServicesContent));
