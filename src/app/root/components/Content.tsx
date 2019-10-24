import React from 'react'
import { Route, Switch, Redirect } from 'react-router';

import { AirdropsContent } from 'app/modules/airdrops';
import DspServicesContent from './DspServicesContent';
import { ROUTES } from '../constants/routes';

const PageContent = () => (
  <Switch>
    <Route path={ROUTES.MAIN} exact component={DspServicesContent} />
    <Route path={ROUTES.LIQUID_AIRDROPS} exact component={AirdropsContent} />
    <Redirect to={ROUTES.MAIN} />
  </Switch>
)

export default PageContent;
