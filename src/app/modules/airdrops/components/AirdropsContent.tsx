import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import { SearchStore } from 'app/modules/search';
import { DialogStore } from 'app/modules/dialogs';
import AirdropsDescription from './AirdropsDescription';

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
  searchStore?: SearchStore;
  dialogStore?: DialogStore;
};

const AirdropsContent = ({ searchStore, dialogStore }: Props) => {
  return <Wrapper><AirdropsDescription /></Wrapper>
};

export default inject('searchStore', 'dialogStore')(observer(AirdropsContent));
