import { computed, observable } from 'mobx';
import BigNumber from 'bignumber.js';

import { IDspData } from 'app/shared/typings';
import DspStore from './DspStore';
import { decomposeAsset } from 'app/shared/eos';

export default class Dsp {
  @observable data: IDspData;
  dspStore: DspStore;

  constructor(data: IDspData, dspStore: DspStore) {
    this.data = data;
    this.dspStore = dspStore;
  }

  @computed get service() {
    return this.data.accountExtRows[0].service;
  }

  @computed get totalStaked() {
    const sum = new BigNumber(0);
    return this.data.accountExtRows.reduce(
      (acc, row) => acc.plus(decomposeAsset(row.balance).amount),
      sum,
    );
  }

  @computed get percentageStaked() {
    return this.totalStaked.div(this.dspStore.totalStaked).toNumber();
  }

  @computed get users() {
    return this.data.accountExtRows.length;
  }
}
