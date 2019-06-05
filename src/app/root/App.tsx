import React from 'react';
import { Provider as MobxProvider, observer } from 'mobx-react';

import RootStore from './RootStore';
import PageWrapper from './components/PageWrapper';
import { PackagesList } from 'app/modules/packages';
import { AllDialogsContainer } from 'app/modules/dialogs';
import { ProfileStatusContainer, TopBar } from 'app/modules/profile';
import { SearchBar, PackagesTabs } from 'app/modules/search';

const rootStore = new RootStore();

// @ts-ignore
window.rootStore = rootStore; // just for in-browser debugging, not used in the code


class App extends React.Component {
  componentDidMount() {
    rootStore.init();
  }

  render() {
    return (
      <MobxProvider {...rootStore}>
        <PageWrapper>
          <TopBar />
          <ProfileStatusContainer />
          <PackagesTabs />
          <SearchBar />
          <PackagesList />
          <AllDialogsContainer />
        </PageWrapper>
      </MobxProvider>
    );
  }
}

export default App;
