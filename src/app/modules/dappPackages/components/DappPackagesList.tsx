import React from 'react'
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import DappPackageStore from '../state/DappPackageStore';
import DappPackageCard from './DappPackageCard';

const Wrapper = styled.div`
  margin: 0 auto;
  width: ${976 + 16 * 2}px;

  @media (min-width: 672px) and (max-width: 1008px) {
    width: ${640 + 16 * 2}px;
  }

  @media (max-width: 671px) {
    width: ${310 + 16 * 2}px;
  }
`;

type Props = {
  dappPackageStore?: DappPackageStore;
}

const DappPackagesList = (props: Props) => {
  const store = props.dappPackageStore!;
  return (
    <Wrapper>
      {
        store.sortedPackages.map(p =>
          <DappPackageCard key={p.data.id} dappPackage={p} store={store} />
        )
      }
    </Wrapper>
  )
}

export default inject('dappPackageStore')(observer(DappPackagesList));
