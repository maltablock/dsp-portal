import { PackageStore } from 'app/modules/packages';
import { SearchStore } from 'app/modules/search';
import { ProfileStore } from 'app/modules/profile';
import { DialogStore } from 'app/modules/dialogs';
import { DspStore } from 'app/modules/dsp';
import UiStore from './state/UiStore';
import { AirdropStore } from 'app/modules/airdrops';

class RootStore {
  packageStore = new PackageStore(this);
  searchStore = new SearchStore(this);
  profileStore = new ProfileStore(this);
  dialogStore = new DialogStore(this);
  dspStore = new DspStore(this);
  uiStore = new UiStore();
  airdropStore = new AirdropStore(this);

  init() {
    this.packageStore.fetchDappPackages();
    this.profileStore.init();
  }
}

export default RootStore;
