import axios from 'axios';
import { observable, action, computed } from 'mobx';

import demoData from '../demo-data.json';
import DappPackage from './DappPackage';
import RootStore from 'app/root/RootStore.js';
import { IDappPackageData } from 'app/shared/typings.js';
import { fetchAllRows } from 'app/shared/eos';

class DappPackageStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  /**
   * Selecting packages
   */

  @observable selectedPackageId: number | null = null;

  @computed get selectedPackage() {
    return this.dappPackages.find(p => p.data.id === this.selectedPackageId);
  }

  @action selectPackage(id: number | null) {
    this.stakeValue = '';
    this.selectedPackageId = id;
  }

  /**
   * Stacking packages
   */

  @observable stakeValue = '';
  @observable isStakedDialogVisible = false;

  @action handleStakeValueChange = e => {
    this.stakeValue = e.target.value;
  };

  @action handleStakeButtonClick = () => {
    this.isStakedDialogVisible = true;
  };

  @action closeStakeDialog = () => {
    this.isStakedDialogVisible = false;
    this.selectPackage(null);
  };

  /**
   * Listing packages in the UI (based on search/filter/sort params)
   */

  @computed get foundPackages() {
    const searchText = this.rootStore.searchStore.searchText.toLowerCase();
    if (!searchText) return this.dappPackages;
    return this.dappPackages.filter(
      p =>
        p.data.service.toLowerCase().includes(searchText) ||
        p.data.provider.toLowerCase().includes(searchText) ||
        p.data.package_id.toLowerCase().includes(searchText),
    );
  }

  @computed get filteredPackages() {
    const filterBy = this.rootStore.searchStore.filterBy;
    if (filterBy === 'all') return this.foundPackages;
    return this.foundPackages.filter(p => p.data.service === filterBy);
  }

  @computed get sortedPackages() {
    const sortBy = this.rootStore.searchStore.sortBy;

    switch (sortBy) {
      case 'quota':
      case 'min_stake_quantity':
      case 'min_unstake_period':
        const field = {
          quota: 'quotaNumber',
          min_stake_quantity: 'minStakeNumber',
          min_unstake_period: 'min_unstake_period',
        }[sortBy];
        return this.filteredPackages.sort((a, b) => a[field] - b[field]);
      case 'provider':
        return this.filteredPackages.sort((a, b) => {
          const aVal = a.providerLowercased;
          const bVal = b.providerLowercased;
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        });
      default:
        return this.filteredPackages;
    }
  }

  /**
   * Fetching packages
   */

  @observable dappPackages: DappPackage[] = [];

  @action async fetchDappPackages() {
    let data: { rows: IDappPackageData[] } = { rows: [] };
    if (process.env.REACT_APP_USE_DEMO_DATA) data = demoData;
    else {
      const options = {
        code: `dappservices`,
        scope: `dappservices`,
        table: `package`,
      };
      data.rows = await fetchAllRows(options);
    }

    const packages = data.rows.map(row => ({ ...row, icon: '' }));

    this.dappPackages = packages.map(packageData => new DappPackage(packageData, this));

    this.dappPackages.forEach(async (dsp, index) => {
      const cachedIcon = localStorage.getItem(dsp.data.package_json_uri);

      if (cachedIcon) {
        this.dappPackages[index].data.icon = cachedIcon;
      } else {
        try {
          const res = await axios.get(dsp.data.package_json_uri, {
            // @ts-ignore
            crossdomain: true,
          });
          const icon = res && res.data && res.data.logo && res.data.logo.logo_256;

          if (icon) {
            localStorage.setItem(dsp.data.package_json_uri, icon);
            this.dappPackages[index].data.icon = icon;
          }
        } catch (e) { }
      }
    });
  }
}

export default DappPackageStore;
