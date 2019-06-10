import axios from 'axios';
import { observable, action, computed } from 'mobx';

import demoData from '../demo-data.json';
import DappPackage from './DappPackage';
import RootStore from 'app/root/RootStore';
import { IDappPackageData } from 'app/shared/typings';
import { fetchAllRows, getTableBoundsForName, fetchRows } from 'app/shared/eos';
import { DAPPSERVICES_CONTRACT, DAPPHODL_CONTRACT } from 'app/shared/eos/constants';
import StakedPackage from './StakedPackage';
import { aggregateStackedPackagesData, RefundsTableRow, StakingTableRow, AccountExtRow } from '../utils';
import IconStore from './IconStore';

class PackageStore {
  rootStore: RootStore;
  iconStore = new IconStore();

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
    this.stakeValueValid = /\d+\.\d{4}/.test(this.stakeValue);
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
    this.iconStore.fetchIcons(this.dappPackages);
  }

  /** Staked packages */

  @observable stakedPackages: StakedPackage[] = [];

  @action fetchStakedPackages = async () => {
    const { accountInfo } = this.rootStore.profileStore;
    if (!accountInfo) return;

    const nameBounds = getTableBoundsForName(accountInfo.account_name);

    // by_account_service consists of 128 bit: 64 bit encoded name, 64 bit encoded service. ALL LITTLE ENDIAN (!)
    // https://github.com/liquidapps-io/zeus-dapp-network/blob/9f0fd5d8cff78d7f429a6284aedeb23f45f21263/dapp-services/contracts/eos/dappservices/dappservices.cpp#L116
    const servicePart = `0`.repeat(16);
    let apiBounds = {
      lower_bound: `0x${servicePart}${nameBounds.lower_bound}`,
      upper_bound: `0x${servicePart}${nameBounds.upper_bound}`,
    };
    const accountExtResults = await fetchRows<AccountExtRow>({
      code: DAPPSERVICES_CONTRACT,
      scope: `DAPP`,
      table: `accountext`,
      index_position: `3`, // &accountext::by_account_service
      key_type: `i128`,
      lower_bound: `${apiBounds.lower_bound}`,
      upper_bound: `${apiBounds.upper_bound}`,
    });

    // staked to logged in account through account itself
    const stakesAccountResults = await fetchRows<StakingTableRow>({
      code: DAPPSERVICES_CONTRACT,
      scope: accountInfo.account_name,
      table: `staking`,
    });

    // staked to logged in account through DAPPHDL contract
    // bounds for checksum256 are split into two 16 bytes little-endians
    // https://eosio.stackexchange.com/a/4344/118
    apiBounds = {
      lower_bound: `${nameBounds.lower_bound}${`0`.repeat(16)}${`0`.repeat(32)}`,
      upper_bound: `${nameBounds.upper_bound}${`0`.repeat(16)}${`F`.repeat(32)}`,
    };
    const stakesDappHodlResults = await fetchRows<StakingTableRow>({
      code: DAPPSERVICES_CONTRACT,
      scope: DAPPHODL_CONTRACT,
      table: `staking`,
      index_position: `2`, // &staking::_by_account_service_provider
      key_type: `sha256`,
      lower_bound: `${apiBounds.lower_bound}`,
      upper_bound: `${apiBounds.upper_bound}`,
    });

    // refunds to logged in account through account itself
    const refundsAccountResults = await fetchRows<RefundsTableRow>({
      code: DAPPSERVICES_CONTRACT,
      scope: accountInfo.account_name,
      table: `refunds`,
    });

    // refunds to logged in account through DAPPHDL contract
    // bounds for checksum256 are split into two 16 bytes little-endians
    // https://eosio.stackexchange.com/a/4344/118
    apiBounds = {
      lower_bound: `${nameBounds.lower_bound}${`0`.repeat(48)}`,
      upper_bound: `${nameBounds.upper_bound}${`F`.repeat(48)}`,
    };
    const refundsDappHodlResults = await fetchRows<RefundsTableRow>({
      code: DAPPSERVICES_CONTRACT,
      scope: DAPPHODL_CONTRACT,
      table: `refunds`,
      index_position: `2`, // &refundreq::by_symbol_service_provider
      key_type: `sha256`,
      lower_bound: `${apiBounds.lower_bound}`,
      upper_bound: `${apiBounds.upper_bound}`,
    });
    console.log({
      accountExtResults,
      stakesDappHodlResults,
      stakesAccountResults,
      refundsDappHodlResults,
      refundsAccountResults,
    });

    this.stakedPackages = aggregateStackedPackagesData({
      accountExtResults,
      stakesDappHodlResults,
      stakesAccountResults,
      refundsDappHodlResults,
      refundsAccountResults,
    }).map(data =>  new StakedPackage(data, this))
  };
}

export default PackageStore;
