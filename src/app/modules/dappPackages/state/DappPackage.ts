import { observable, action, computed } from 'mobx';
import distanceInWordsStrict from 'date-fns/distance_in_words_strict'

import { IDappPackageData } from 'app/shared/typings';
import DappPackageStore from './DappPackageStore';

const stringToNumber = str => Number(str.replace(/[^\d^\.]+/ig, ''));

class DappPackage {
  dappPackageStore: DappPackageStore
  @observable data: IDappPackageData;

  constructor(dappPackageData: IDappPackageData, dappPackageStore: DappPackageStore) {
    this.data = dappPackageData;
    this.dappPackageStore = dappPackageStore;
  }

  @computed get quotaNumber() {
    return stringToNumber(this.data.quota);
  }

  @computed get minStakeNumber() {
    return stringToNumber(this.data.min_stake_quantity);
  }

  @computed get providerLowercased() {
    return this.data.provider.toLowerCase();
  }

  @action handleSelect = () => {
    if (!this.isSelected) this.dappPackageStore.selectPackage(this.data.id);
  }

  @action handleDeselect = evt => {
    if (this.isSelected) {
      evt.stopPropagation();
      this.dappPackageStore.selectPackage(null);
    }
  }

  @computed get isSelected() {
    return this.dappPackageStore.selectedPackageId === this.data.id;
  }

  @computed get isHidden() {
    return this.dappPackageStore.selectedPackageId !== null && !this.isSelected;
  }

  @computed get unstakeTimeText() {
    return this.data.min_unstake_period
      ? distanceInWordsStrict(0, this.data.min_unstake_period * 1000)
      : 'Automatic';
  }
}

export default DappPackage;
