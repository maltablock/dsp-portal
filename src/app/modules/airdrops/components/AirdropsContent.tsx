import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import AirdropsDescription from './AirdropsDescription';
import AirdropStore from '../state/AirdropStore';

const Wrapper = styled.div`
  margin: 0 auto 16px;
  width: ${976 + 16 * 2}px;
  flex: 1;

  @media (min-width: 672px) and (max-width: 1008px) {
    width: ${640 + 16 * 2}px;
  }

  @media (max-width: 671px) {
    width: 100%;
    overflow-x: scroll;
  }
`;

type Props = {
  airdropStore?: AirdropStore;
};

const AirdropsContent = ({ airdropStore }: Props) => {
  useEffect(() => {
    airdropStore!.fetchAirdrops();
  }, [airdropStore]);

  return (
    <Wrapper>
      <AirdropsDescription />
      <ol>
        {airdropStore!.airdrops.map(airdrop => (
          <li>
            {airdrop.tokenName} {airdrop.tokenContract}
          </li>
        ))}
      </ol>
    </Wrapper>
  );
};

export default inject('airdropStore')(observer(AirdropsContent));