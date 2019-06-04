import React from 'react'
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import PackageStore from '../state/PackageStore';
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
  packageStore?: PackageStore;
  searchStore?: SearchStore;
}

const PackagesList = ({ packageStore, searchStore }: Props) => {
  return (
    <Wrapper>
      {
        searchStore!.selectedTab === 'Staked'
        ? packageStore!.stakedPackages.map(p =>
            <div>
              {JSON.stringify(p.data)}
            </div>
          )
        : packageStore!.sortedPackages.map(p =>
            <DappPackageCard key={p.data.id} dappPackage={p} />
          )
      }
    </Wrapper>
  )
}

export default inject('packageStore', 'searchStore')(observer(PackagesList));
