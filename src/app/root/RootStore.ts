import { PackageStore } from 'app/modules/packages';
import { SearchStore } from 'app/modules/search';
import { ProfileStore } from 'app/modules/profile';
import { DialogStore } from 'app/modules/dialogs';

class RootStore {
  packageStore = new PackageStore(this);
  searchStore = new SearchStore(this);
  profileStore = new ProfileStore(this);
  dialogStore = new DialogStore();

  init() {
    this.packageStore.fetchDappPackages();
    this.profileStore.init();
  }
}

export default RootStore;
