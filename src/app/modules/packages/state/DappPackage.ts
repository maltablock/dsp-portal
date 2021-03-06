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

  @computed get stakedPackage() {
    const stakedPackage = this.packageStore.stakedPackages.find(stakedPackage => {
      return this.isEqual(stakedPackage)
    })
    return stakedPackage
  }

  @computed get stakingBalanceFromSelf() {
    return this.stakedPackage ? this.stakedPackage.stakingBalanceFromSelf : 0
  }
  
  @computed get stakingBalanceFromSelfDappHdl() {
    return this.stakedPackage ? this.stakedPackage.stakingBalanceFromSelfDappHdl : 0
  }

  @computed get packgePeriodInSeconds() {
    return this.data.package_period;
  }

  @computed get isDeprecated() {
    // deprecation is not implemented in the smart contract yet
    // make nothing deprecated except known deprecated airdropsdac1 packages
    return !this.data.api_endpoint || this.data.api_endpoint === `null`;

    // handle special case until enablepkg action is implemented in contract
    // return !(Boolean(this.data.enabled) && this.data.api_endpoint && this.data.api_endpoint !== `null`)
  }
}

export default DappPackage;
