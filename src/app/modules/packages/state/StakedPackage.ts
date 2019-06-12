import { computed } from "mobx";

import { IStakedPackageData } from "app/shared/typings";
import PackageStore from "./PackageStore";
import PackageBase from "./PackageBase";

class StakedPackage extends PackageBase<IStakedPackageData> {
  constructor(data: IStakedPackageData, packageStore: PackageStore) {
    super(data, packageStore);
  }

  @computed get packageId() {
    // `selectpkg` action sets pending_package
    // if enough staked through `stake` action, package is set to pending_package
    // so package field is the current active package, pending the selected one
    return this.data.package || this.data.pending_package;
  }

  @computed get isStakedToByUser() {
    // if this package exists, it means it is staked to by the user
    return true;
  }

  @computed get dappPackage() {
    const dappPackage = this.packageStore.dappPackages.find(dappPackage => {
      return this.isEqual(dappPackage)
    })
    return dappPackage
  }

  @computed get quotaNumber() {
    return this.data.quota;
  }

  @computed get minStakeNumber() {
    if(!this.dappPackage) return 0
    return this.dappPackage.minStakeNumber
  }

  @computed get minUnstakePeriod() {
    if(!this.dappPackage) return 0
    return this.dappPackage.minUnstakePeriod
  }

  @computed get stakingBalanceFromSelf() {
    return this.data.stakingBalanceFromSelf
  }

  @computed get stakingBalanceFromSelfDappHdl() {
    return this.data.stakingBalanceFromSelfDappHdl
  }

  @computed get refundFromSelf() {
    return this.data.refundFromSelf
  }

  @computed get refundFromSelfAmount() {
    return this.data.refundFromSelf ? this.data.refundFromSelf.amount : 0
  }

  @computed get refundFromSelfDappHdl() {
    return this.data.refundFromSelfDappHdl
  }
  
  @computed get refundFromSelfDappHdlAmount() {
    return this.data.refundFromSelfDappHdl ? this.data.refundFromSelfDappHdl.amount : 0
  }

  @computed get isDeprecated() {
    if(!this.dappPackage) return false

    return !this.dappPackage.data.enabled
  }
}


export default StakedPackage;
