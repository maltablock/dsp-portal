import React from 'react'
import { Route, Switch, Redirect } from 'react-router';

import { AirdropsContent } from 'app/modules/airdrops';
import DspServicesContent from './DspServicesContent';
import { ROUTES } from '../constants/routes';

const PageContent = () => (
  <Switch>
    <Route path={ROUTES.MAIN} exact component={DspServicesContent} />

    {/*
      Temporary fix to handle trailing slash for `LIQUID_AIRDROPS` route.
      TODO: Remove this redirect when it will be fixed on the server-side.
    */}
    <Redirect exact strict from={ROUTES.LIQUID_AIRDROPS + '/'} to={ROUTES.LIQUID_AIRDROPS} />

    <Route path={ROUTES.LIQUID_AIRDROPS} exact component={AirdropsContent} />
    <Redirect to={ROUTES.MAIN} />
  </Switch>
)

export default PageContent;
