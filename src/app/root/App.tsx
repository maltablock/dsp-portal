import React from 'react';
import { Provider as MobxProvider, observer } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import { Router } from 'react-router';

import browserHistory from './browserHistory';
import RootStore from './RootStore';
import PageWrapper from './components/PageWrapper';
import { AllDialogsContainer } from 'app/modules/dialogs';
import { TopBar } from 'app/modules/profile';
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
        <Router history={browserHistory}>
          <ThemeProvider theme={{ mode: rootStore.uiStore.mode }}>
            <React.Fragment>
              <GlobalStyles />

              <PageWrapper>
                <TopBar />
                <Content />
                <AllDialogsContainer />
                <Footer />
              </PageWrapper>

            </React.Fragment>
          </ThemeProvider>
        </Router>
      </MobxProvider>
    );
  }
}

export default observer(App);
