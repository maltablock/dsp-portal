import { observable, computed, action } from "mobx";

import PackageStore from "./PackageStore";
import { IStakedPackageData, IDappPackageData } from "app/shared/typings";

abstract class PackageBase<T extends IStakedPackageData | IDappPackageData> {
  packageStore: PackageStore;
  @observable data: T;

  constructor(data: T, packageStore: PackageStore) {
    this.data = data;
    this.packageStore = packageStore;
  }

  abstract get packageId() : string;

  @computed get providerLowercased() {
    return this.data.provider.toLowerCase();
  }

  @computed get serviceLowercased() {
    return this.data.service.toLowerCase();
  }

  @computed get iconUrl() {
    return this.packageStore.iconStore.iconUrlByProvider.get(this.data.provider);
  }

  @computed get iconBgColor() {
    // List all the providers which have transparent dark icon in array below
    return ['eosnationdsp'].includes(this.data.provider) ? '#fff' : null;
  }

  @computed get isSelected() {
    return this.packageStore.selectedPackageId === this.data.id;
  }

  @computed get isHidden() {
    return this.packageStore.selectedPackageId !== null && !this.isSelected;
  }

  @computed get isStakedToByUser() {
    if(!this.packageStore.rootStore.profileStore.isLoggedIn) return false
  
    return this.packageStore.stakedPackages.some(p => this.isEqual(p));
  }

  @action handleSelect = () => {
    if (!this.isSelected) this.packageStore.selectPackage(this.data.id);
  }

  @action handleDeselect = evt => {
    if (this.isSelected) {
      evt.stopPropagation();
      this.packageStore.selectPackage(null);
    }
  }

  isEqual(p: PackageBase<any>) {
    return this.packageId === p.packageId && this.providerLowercased === p.providerLowercased && this.serviceLowercased === p.serviceLowercased
  }

  abstract get stakingBalanceFromSelf();

  abstract get stakingBalanceFromSelfDappHdl();
}

export default PackageBase;
