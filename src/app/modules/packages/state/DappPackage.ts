import { computed } from 'mobx';
import distanceInWordsStrict from 'date-fns/distance_in_words_strict'

import { IDappPackageData } from 'app/shared/typings';
import PackageStore from './PackageStore';
import PackageBase from './PackageBase';

const stringToNumber = str => Number(str.replace(/[^\d^\.]+/ig, ''));

class DappPackage extends PackageBase<IDappPackageData> {
  constructor(data: IDappPackageData, packageStore: PackageStore) {
    super(data, packageStore);
  }

  @computed get quotaNumber() {
    return stringToNumber(this.data.quota);
  }

  @computed get minStakeNumber() {
    return stringToNumber(this.data.min_stake_quantity);
  }

  @computed get minUnstakePeriod() {
    return this.data.min_unstake_period
  }

  @computed get packageId() {
    return this.data.package_id;
  }

  @computed get unstakeTimeText() {
    return this.data.min_unstake_period
      ? distanceInWordsStrict(0, this.data.min_unstake_period * 1000)
      : 'Automatic';
  }
}

export default DappPackage;
