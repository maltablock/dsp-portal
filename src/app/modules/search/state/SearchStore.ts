import { observable, action, computed } from "mobx";

class SearchStore {
  /**
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
    return (
      'Sort by ' +
      (this.sortBy === 'default' ? '' : this.sortOptions.find(o => o.value === this.sortBy)!.text)
    );
  }

  @action handleSortByChange = value => {
    this.sortBy = value;
  }

  /*
   * Packages/Staked tabs
   */

  @observable selectedTab = 'Packages';

  @action handleSelectTab = tabName => {
    this.selectedTab = tabName;
  }
}

export default SearchStore;
