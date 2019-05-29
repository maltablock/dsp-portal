import { DappPackageStore } from 'app/modules/dappPackages';
import { SearchStore } from 'app/modules/search';
import { ProfileStore } from 'app/modules/profile';

class RootStore {
  dappPackageStore = new DappPackageStore(this);
  searchStore = new SearchStore();
  profileStore = new ProfileStore();

  init() {
    this.dappPackageStore.fetchDappPackages();
  }
}

export default RootStore;
