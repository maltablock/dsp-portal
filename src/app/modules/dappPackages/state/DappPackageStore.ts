import axios from 'axios';
import { observable, action, computed } from 'mobx';

import demoData from '../demo-data.json';
import DappPackage from './DappPackage';
import RootStore from 'app/root/RootStore.js';
import { IDappPackageData } from 'app/shared/typings';
import { fetchAllRows, wallet, formatAsset } from 'app/shared/eos';
import { DAPPSERVICES_CONTRACT, DAPP_SYMBOL } from 'app/shared/eos/constants';

export enum TransactionStatus {
  Pending= 0,
  Success,
  Failure
}

class DappPackageStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  /**
   * Stake Dialog
   */
  @observable transactionId?: string;
  @observable transactionError?: string;
  @observable transactionStatus: TransactionStatus = TransactionStatus.Pending;

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
  @observable stakeValueValid = false;
  @observable isStakedDialogVisible = false;

  @action handleStakeValueChange = e => {
    this.stakeValue = e.target.value;
    this.stakeValueValid = /\d+\.\d{4}/.test(this.stakeValue)
  };

  @action handleStakeButtonClick = async () => {
    this.transactionStatus = TransactionStatus.Pending;
    this.transactionError = undefined;
    this.transactionId = undefined;
    this.isStakedDialogVisible = true;

    try {
      if(!this.rootStore.profileStore.isLoggedIn) {
        await this.rootStore.profileStore.login()
      }

      const selectedPackage = this.selectedPackage
      if(!selectedPackage) throw new Error(`Selected package not found.`)

      const result = await wallet.eosApi
      .transact({
        actions: [
          {
            account: DAPPSERVICES_CONTRACT,
            name: 'selectpkg',
            authorization: [
              {
                actor: wallet.auth!.accountName,
                permission: wallet.auth!.permission
              }
            ],
            data: {
              owner: wallet.auth!.accountName,
              provider: selectedPackage.data.provider,
              service: selectedPackage.data.service,
              package: selectedPackage.data.package_id
            }
          },
          {
            account: DAPPSERVICES_CONTRACT,
            name: 'stake',
            authorization: [
              {
                actor: wallet.auth!.accountName,
                permission: wallet.auth!.permission
              }
            ],
            data: {
              from: wallet.auth!.accountName,
              provider: selectedPackage.data.provider,
              service: selectedPackage.data.service,
              quantity: `${this.stakeValue} ${DAPP_SYMBOL.symbolCode}`
            }
          }
        ]
      },
      {
        broadcast: true,
        blocksBehind: 3,
        expireSeconds: 60
      }
    )

    this.transactionId = result.transaction_id
    this.transactionStatus = TransactionStatus.Success
    await this.rootStore.profileStore.fetchInfo()
    } catch (err) {
      this.transactionStatus = TransactionStatus.Failure
      this.transactionError = err.message
      console.error(err.message);
    }
  };

  @action closeStakeDialog = () => {
    this.isStakedDialogVisible = false;
    this.transactionId = ''
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
