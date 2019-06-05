import axios from 'axios';
import { observable, action, computed } from 'mobx';

import demoData from '../demo-data.json';
import DappPackage from './DappPackage';
import RootStore from 'app/root/RootStore.js';
import { IDappPackageData } from 'app/shared/typings';
import { fetchAllRows, getTableBoundsForName, fetchRows, decomposeAsset } from 'app/shared/eos';
import { DAPPSERVICES_CONTRACT } from 'app/shared/eos/constants';
import StakedPackage from './StakedPackage';

class PackageStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  /**
   * Selecting packages
   */

  @observable selectedPackageId: number | null = null;

  @computed get selectedDappPackage() {
    return this.dappPackages.find(p => p.isSelected);
  }

  @computed get selectedStakedPackage() {
    return this.stakedPackages.find(p => p.isSelected);
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

  @action handleStakeValueChange = e => {
    this.stakeValue = e.target.value;
    this.stakeValueValid = /\d+\.\d{4}/.test(this.stakeValue)
  };


  /**
   * DAPP packages
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
      data.rows = await fetchAllRows<IDappPackageData>(options);
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

  /** Staked packages */

  @observable stakedPackages: StakedPackage[] = [];

  @action fetchStakedPackages = async () => {
    const { accountInfo } = this.rootStore.profileStore;
    if (!accountInfo) return;

    // by_account_service consists of 128 bit: 64 bit encoded name, 64 bit encoded service. ALL LITTLE ENDIAN (!)
    // https://github.com/liquidapps-io/zeus-dapp-network/blob/9f0fd5d8cff78d7f429a6284aedeb23f45f21263/dapp-services/contracts/eos/dappservices/dappservices.cpp#L116
    const nameBounds = getTableBoundsForName(accountInfo.account_name);
    const servicePart = `0`.repeat(16);
    nameBounds.lower_bound = `0x${servicePart}${nameBounds.lower_bound}`;
    nameBounds.upper_bound = `0x${servicePart}${nameBounds.upper_bound}`;
    const stakesResult = await fetchRows<any>({
      code: DAPPSERVICES_CONTRACT,
      scope: `DAPP`,
      table: `accountext`,
      index_position: `3`, // &accountext::by_account_service
      key_type: `i128`,
      lower_bound: `${nameBounds.lower_bound}`,
      upper_bound: `${nameBounds.upper_bound}`,
    });
    this.stakedPackages = stakesResult.map(stake => {
      const { amount: balance, symbol } = decomposeAsset(stake.balance);
      const { amount: quota } = decomposeAsset(stake.quota);
      const data = {
        ...stake,
        balance,
        symbol,
        quota,
        icon: '',
      };
      return new StakedPackage(data, this);
    });
  }
}

export default PackageStore;
