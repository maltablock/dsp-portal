import { DappPackageStore } from 'app/modules/dappPackages';
import { SearchStore } from 'app/modules/search';

class RootStore {
  dappPackageStore = new DappPackageStore(this);
  searchStore = new SearchStore();

  init() {
    this.dappPackageStore.fetchDappPackages();
  }
}

export default RootStore;
