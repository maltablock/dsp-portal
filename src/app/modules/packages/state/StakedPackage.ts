import { computed } from "mobx";

import { IStakedPackageData } from "app/shared/typings";
import PackageStore from "./PackageStore";
import PackageBase from "./PackageBase";

class StakedPackage extends PackageBase<IStakedPackageData> {
  constructor(data: IStakedPackageData, packageStore: PackageStore) {
    super(data, packageStore);
  }

  @computed get quotaNumber() {
    return this.data.quota;
  }

  @computed get minStakeNumber() {
    // TODO: can we fetch min_stake_period for staked packages?
    return 0;
  }

  @computed get packageId() {
    // TODO: staked package doesn't have `package_id` property. Can we fetch it?
    // (expamples of `package_id`: "package1", "community" or "gold")
    return this.data.service;
  }
}

export default StakedPackage;
