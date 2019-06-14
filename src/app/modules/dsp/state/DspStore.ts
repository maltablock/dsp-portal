import groupBy from 'lodash/groupBy';
import { observable, action, computed } from 'mobx';
import RootStore from 'app/root/RootStore';
import { fetchAllRows, fetchRows, decomposeAsset } from 'app/shared/eos';
import { AccountExtRow, StatExtRow, StatRow } from 'app/shared/typings';
import Dsp from './Dsp';

class DspStore {
  rootStore: RootStore;
  @observable protected dsps: Dsp[] = [];
  @observable protected statExt?: StatExtRow;
  @observable protected stat?: StatRow;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action async fetchDsps() {
    const [accountExtRows, statExtRows, statRows] = await Promise.all([fetchAllRows<AccountExtRow>({
      code: `dappservices`,
      scope: `DAPP`,
      table: `accountext`,
    }), fetchRows<StatExtRow>({
      code: `dappservices`,
      scope: `DAPP`,
      table: `statext`,
    }), fetchRows<StatRow>({
      code: `dappservices`,
      scope: `DAPP`,
      table: `stat`,
    })]);

    if(statExtRows.length > 0) {
      this.statExt = statExtRows[0]
    }

    if(statRows.length > 0) {
      this.stat = statRows[0]
    }

    const groupedAccountExt = groupBy(accountExtRows, row => row.provider);
    this.dsps = Object.keys(groupedAccountExt).map(provider => {
      return new Dsp({ accountExtRows: groupedAccountExt[provider] }, this);
    });
  }

  @computed get sortedDsps() {
    return this.dsps.sort((dsp1, dsp2) => dsp2.totalStaked.minus(dsp1.totalStaked).toNumber())
  }


  @computed get circulatingSupply() {
    // TODO: decomposeAsset should return a BigNumber here
    return this.stat ? decomposeAsset(this.stat.supply).amount : 0
  }

  @computed get totalStaked() {
    // TODO: decomposeAsset should return a BigNumber here
    return this.statExt ? decomposeAsset(this.statExt.staked).amount : 0
  }

  @computed get inflationPerBlock() {
    return this.statExt ? this.statExt.inflation_per_block : `0`
  }
}

export default DspStore;
