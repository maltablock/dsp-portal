import React from 'react'
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import DappPackageStore from '../state/DappPackageStore';
import DappPackageCard from './DappPackageCard';
import { SearchStore } from 'app/modules/search';

const Wrapper = styled.div`
  margin: 0 auto;
  width: ${976 + 16 * 2}px;

  @media (min-width: 672px) and (max-width: 1008px) {
    width: ${640 + 16 * 2}px;
  }

  @media (max-width: 671px) {
    width: 100%;
  }
`;

type Props = {
  dappPackageStore?: DappPackageStore;
  searchStore?: SearchStore;
}

const PackagesList = ({ dappPackageStore, searchStore }: Props) => {
  return (
    <Wrapper>
      {
        searchStore!.selectedTab === 'Staked'
        ? dappPackageStore!.stakedPackages.map(p =>
            <div>
              {JSON.stringify(p.data)}
            </div>
          )
        : dappPackageStore!.sortedPackages.map(p =>
            <DappPackageCard key={p.data.id} dappPackage={p} />
          )
      }
    </Wrapper>
  )
}

export default inject('dappPackageStore', 'searchStore')(observer(PackagesList));
