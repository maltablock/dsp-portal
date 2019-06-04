import { computed } from 'mobx';
import distanceInWordsStrict from 'date-fns/distance_in_words_strict'

import { IDappPackageData } from 'app/shared/typings';
import DappPackageStore from './DappPackageStore';
import PackageBase from './PackageBase';

const stringToNumber = str => Number(str.replace(/[^\d^\.]+/ig, ''));

class DappPackage extends PackageBase<IDappPackageData> {
  constructor(data: IDappPackageData, dappPackageStore: DappPackageStore) {
    super(data, dappPackageStore);
  }

  @computed get quotaNumber() {
    return stringToNumber(this.data.quota);
  }

  @computed get minStakeNumber() {
    return stringToNumber(this.data.min_stake_quantity);
  }

  @computed get unstakeTimeText() {
    return this.data.min_unstake_period
      ? distanceInWordsStrict(0, this.data.min_unstake_period * 1000)
      : 'Automatic';
  }
}

export default DappPackage;
