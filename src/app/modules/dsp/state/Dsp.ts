import { computed, observable } from 'mobx';
import BigNumber from 'bignumber.js';

import { IDspData } from 'app/shared/typings';
import DspStore from './DspStore';
import { decomposeAsset } from 'app/shared/eos';

const BLOCKS_PER_DAY = 2 * 60 * 60 * 24;

export default class Dsp {
  @observable data: IDspData;
  dspStore: DspStore;

  constructor(data: IDspData, dspStore: DspStore) {
    this.data = data;
    this.dspStore = dspStore;
  }

  @computed get provider() {
    return this.data.accountExtRows[0].provider;
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

  @computed get dailyReward() {
    // https://github.com/liquidapps-io/zeus-sdk/blob/master/boxes/groups/dapp-network/dapp-services/contracts/eos/dappservices/dappservices.cpp#L1003
    const inflation = Number.parseFloat(this.dspStore.inflationPerBlock);
    const totalStakeFactor = new BigNumber(this.dspStore.circulatingSupply).div(
      new BigNumber(this.dspStore.totalStaked),
    );

    // cannot use BigNumber.pow for performance reasons
    return new BigNumber(Math.pow(1.0 + inflation, BLOCKS_PER_DAY) - 1.0)
      .times(this.totalStaked.times(totalStakeFactor));
  }
}
