import React from 'react';
import { observer, inject } from 'mobx-react';

import ProfileStore from '../state/ProfileStore';
import AuthRequiredCard from './AuthRequiredCard';
import StakeStatusContainer from './StakeStatusContainer';

type Props = {
  profileStore?: ProfileStore
};

const ProfileStatusContainer = ({ profileStore }: Props) => {
  return profileStore!.isLoggedIn
    ? <StakeStatusContainer />
    : <AuthRequiredCard />
}

export default inject('profileStore')(observer(ProfileStatusContainer));
