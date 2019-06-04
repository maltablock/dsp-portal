import { observable, computed, action } from "mobx";

import DappPackageStore from "./DappPackageStore";
import { IStakedPackageData, IDappPackageData } from "app/shared/typings";

class PackageBase<T extends IStakedPackageData | IDappPackageData> {
  dappPackageStore: DappPackageStore;
  @observable data: T;

  constructor(data: T, dappPackageStore: DappPackageStore) {
    this.data = data;
    this.dappPackageStore = dappPackageStore;
  }

  @computed get providerLowercased() {
    return this.data.provider.toLowerCase();
  }

  @computed get isSelected() {
    return this.dappPackageStore.selectedPackageId === this.data.id;
  }

  @computed get isHidden() {
    return this.dappPackageStore.selectedPackageId !== null && !this.isSelected;
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
}

export default PackageBase;
