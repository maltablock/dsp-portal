import { observable, action, computed } from "mobx";
import RootStore from "app/root/RootStore";
import { searchFn, filterFn, sortFn } from "../utils";

class SearchStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  /*
   * Search
   */

  @observable searchText = '';

  @computed get isClearSearchVisible() {
    return !!this.searchText;
  }

  @action handleSearchTextChange = e => {
    this.searchText = e.target.value;
  }

  @action clearSearchText = () => {
    this.searchText = '';
  }

  /**
   * Filter
   */

  @observable filterBy = 'all';

  filterOptions = [
    { text: 'All', value: 'all' },
    { text: 'IPFS Services', value: 'ipfsservice1' },
    { text: 'Cron Services', value: 'cronservices' },
    { text: 'Oracle Services', value: 'oracleservic' },
    { text: 'Stake Services', value: 'stakeservice' },
  ]

  @computed get filterByText() {
    return (
      'Filter by ' +
      (this.filterBy === 'all' ? '' : this.filterOptions.find(o => o.value === this.filterBy)!.text)
    );
  }

  @action handleFilterByChange = value => {
    this.filterBy = value;
  }

  /**
   * Sort
   */

  @observable sortBy = 'default';

  sortOptions = [
    { text: 'Default', value: 'default' },
    { text: 'Quota', value: 'quota' },
    { text: 'Min Stake', value: 'min_stake_quantity' },
    { text: 'Unstake Time', value: 'min_unstake_period' },
    { text: 'Provider', value: 'provider' },
  ]

  @computed get sortByText() {
    return 'Sort by ' + this.sortOptions.find(o => o.value === this.sortBy)!.text;
  }

  @action handleSortByChange = value => {
    this.sortBy = value;
  }

  /*
   * Packages/Staked tabs
   */

  @observable selectedTab = 'Packages';

  @action handleSelectTab = tabName => {
    this.rootStore.packageStore.selectPackage(null);
    this.selectedTab = tabName;
  }

  /**
   * sortedDappPackages will be showed the UI (based on search/filter/sort params)
   */

  @computed get foundDappPackages() {
    return searchFn(this.rootStore.packageStore.activePackages, this.searchText);
  }

  @computed get filteredDappPackages() {
    return filterFn(this.foundDappPackages, this.filterBy);
  }

  @computed get sortedDappPackages() {
    return sortFn(this.filteredDappPackages, this.sortBy);
  }

  /**
   * sortedStakedPackages will be showed the UI (based on search/filter/sort params)
   */

  @computed get foundStakedPackages() {
    return searchFn(this.rootStore.packageStore.stakedPackages, this.searchText);
  }

  @computed get filteredStakedPackages() {
    return filterFn(this.foundStakedPackages, this.filterBy);
  }

  @computed get sortedStakedPackages() {
    return sortFn(this.filteredStakedPackages, this.sortBy);
  }
}

export default SearchStore;
