import React from 'react'
import { inject, observer } from 'mobx-react';

import UiStore from '../state/UiStore';
import { AirdropsContent } from 'app/modules/airdrops';
import DspServicesContent from './DspServicesContent';

type Props = {
  uiStore?: UiStore;
}

const PageContent = ({ uiStore }: Props) => {
  let content

  switch(uiStore!.mainNavigation) {
    case 'vAirdrops': {
      content = <AirdropsContent />
        break;
      }
      case 'DSP Services':
      default: {
        content = <DspServicesContent />
        break;
      }
  }

  return content
}

export default inject('uiStore')(observer(PageContent));






