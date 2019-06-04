import { computed } from "mobx";

import { IStakedPackageData } from "app/shared/typings";
import DappPackageStore from "./DappPackageStore";
import PackageBase from "./PackageBase";

class StakedPackage extends PackageBase<IStakedPackageData> {
  constructor(data: IStakedPackageData, dappPackageStore: DappPackageStore) {
    super(data, dappPackageStore);
  }

  @computed get quotaNumber() {
    return this.data.quota;
  }

  @computed get minStakeNumber() {
    // TODO: can we fetch min_stake_period for staked packages?
    return 0;
  }
}

export default StakedPackage;
