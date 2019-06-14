import { observable, action, computed } from 'mobx';

import RootStore from 'app/root/RootStore';
import { IDappPackageData } from 'app/shared/typings';
import { fetchAllRows, getTableBoundsForName, fetchRows } from 'app/shared/eos';
import { DAPPSERVICES_CONTRACT, DAPPHODL_CONTRACT } from 'app/shared/eos/constants';
import { RefundsTableRow, StakingTableRow, AccountExtRow } from 'app/shared/typings';
import StakedPackage from './StakedPackage';
import { aggregateStackedPackagesData } from '../utils';
import IconStore from './IconStore';
import demoData from '../demo-data.json';
import DappPackage from './DappPackage';

const stakeValueRegex = /^(\d+\.\d{4}){0,1}$/;

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
    this.stakeValueDapp = '';
    this.stakeValueDappHdl = '';
    this.selectedPackageId = id;
  }

  /**
   * Stacking packages
   */

  @observable stakeValueDapp = '';
  @observable stakeValueDappHdl = '';
  @observable stakeValuesValid = false;

  @action handleStakeValueChange = e => {
    if (e.target.name === `dapp`) {
      this.stakeValueDapp = e.target.value;
    } else {
      this.stakeValueDappHdl = e.target.value;
    }

    // one of them can be empty but not both
    this.stakeValuesValid =
      Boolean(this.stakeValueDapp || this.stakeValueDappHdl) &&
      stakeValueRegex.test(this.stakeValueDapp) &&
      stakeValueRegex.test(this.stakeValueDappHdl);
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

  @computed get activePackages() {
    return this.dappPackages.filter(
      p => p.data.enabled && p.data.api_endpoint && p.data.api_endpoint !== `null`,
    );
  }

  /** Staked packages */

  @observable stakedPackages: StakedPackage[] = [];

  @action fetchStakedPackages = async () => {
    const { accountInfo } = this.rootStore.profileStore;
    if (!accountInfo) return;

    const nameBounds = getTableBoundsForName(accountInfo.account_name);

    // by_account_service consists of 128 bit: 64 bit encoded name, 64 bit encoded service. ALL LITTLE ENDIAN (!)
    // https://github.com/liquidapps-io/zeus-dapp-network/blob/9f0fd5d8cff78d7f429a6284aedeb23f45f21263/dapp-services/contracts/eos/dappservices/dappservices.cpp#L116
    const accountExtBounds = {
      lower_bound: `0x${`0`.repeat(16)}${nameBounds.lower_bound}`,
      upper_bound: `0x${`0`.repeat(16)}${nameBounds.upper_bound}`,
    };

    // bounds for checksum256 are split into two 16 bytes little-endians
    // https://eosio.stackexchange.com/a/4344/118
    const stakesDappHodlBounds = {
      lower_bound: `${nameBounds.lower_bound}${`0`.repeat(16)}${`0`.repeat(32)}`,
      upper_bound: `${nameBounds.upper_bound}${`0`.repeat(16)}${`F`.repeat(32)}`,
    };

    // bounds for checksum256 are split into two 16 bytes little-endians
    // https://eosio.stackexchange.com/a/4344/118
    const refundsDappHodlBounds = {
      lower_bound: `${nameBounds.lower_bound}${`0`.repeat(48)}`,
      upper_bound: `${nameBounds.upper_bound}${`F`.repeat(48)}`,
    };

    const [
      accountExtResults,
      stakesAccountResults,
      stakesDappHodlResults,
      refundsAccountResults,
      refundsDappHodlResults,
    ] = await Promise.all<any>(
      [
        fetchRows<AccountExtRow>({
          code: DAPPSERVICES_CONTRACT,
          scope: `DAPP`,
          table: `accountext`,
          index_position: `3`, // &accountext::by_account_service
          key_type: `i128`,
          lower_bound: `${accountExtBounds.lower_bound}`,
          upper_bound: `${accountExtBounds.upper_bound}`,
        }),

        // staked to logged in account through account itself
        fetchRows<StakingTableRow>({
          code: DAPPSERVICES_CONTRACT,
          scope: accountInfo.account_name,
          table: `staking`,
        }),

        // staked to logged in account through DAPPHDL contract
        fetchRows<StakingTableRow>({
          code: DAPPSERVICES_CONTRACT,
          scope: DAPPHODL_CONTRACT,
          table: `staking`,
          index_position: `2`, // &staking::_by_account_service_provider
          key_type: `sha256`,
          lower_bound: `${stakesDappHodlBounds.lower_bound}`,
          upper_bound: `${stakesDappHodlBounds.upper_bound}`,
        }),

        // refunds to logged in account through account itself
        fetchRows<RefundsTableRow>({
          code: DAPPSERVICES_CONTRACT,
          scope: accountInfo.account_name,
          table: `refunds`,
        }),

        // refunds to logged in account through DAPPHDL contract
        fetchRows<RefundsTableRow>({
          code: DAPPSERVICES_CONTRACT,
          scope: DAPPHODL_CONTRACT,
          table: `refunds`,
          index_position: `2`, // &refundreq::by_symbol_service_provider
          key_type: `sha256`,
          lower_bound: `${refundsDappHodlBounds.lower_bound}`,
          upper_bound: `${refundsDappHodlBounds.upper_bound}`,
        }),
      ].map(p =>
        p.catch(err => {
          console.error(`fetchStakedPackages`, err.message);
          return [];
        }),
      ),
    );

    this.stakedPackages = aggregateStackedPackagesData({
      accountExtResults,
      stakesDappHodlResults,
      stakesAccountResults,
      refundsDappHodlResults,
      refundsAccountResults,
    }).map(data => new StakedPackage(data, this));
  };
}

export default PackageStore;
