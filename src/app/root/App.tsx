import React from 'react';
import { Provider as MobxProvider, observer } from 'mobx-react';
import { ThemeProvider } from 'styled-components';

import RootStore from './RootStore';
import PageWrapper from './components/PageWrapper';
import { AllDialogsContainer } from 'app/modules/dialogs';
import { ProfileStatusContainer, TopBar } from 'app/modules/profile';
import { SearchBar, PackagesTabs } from 'app/modules/search';
import Content from './components/Content';
import Footer from './components/Footer';
import GlobalStyles from 'app/shared/styles/global';

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
        <ThemeProvider theme={{ mode: rootStore.uiStore.mode }}>
          <React.Fragment>
            <GlobalStyles />

            <PageWrapper>
              <TopBar />
              <ProfileStatusContainer />
              <PackagesTabs />
              <SearchBar />
              <Content />
              <AllDialogsContainer />
              <Footer />
            </PageWrapper>

          </React.Fragment>
        </ThemeProvider>
      </MobxProvider>
    );
  }
}

export default observer(App);
