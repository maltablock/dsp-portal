import { observable, action, computed } from 'mobx';
import RootStore from 'app/root/RootStore';
import AirdropItem, { AirdropItemData } from './AirdropItem';
import { fetchAllScopes, fetchRows } from 'app/shared/eos';
import { AIRDROPS_ACCOUNT } from 'app/shared/eos/constants';

class AirdropStore {
  rootStore: RootStore;
  @observable protected _airdrops: AirdropItem[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action async fetchAirdrops() {
    const scopes = await fetchAllScopes(AIRDROPS_ACCOUNT, `airdrops`);
    const airdropsData = await Promise.all(
      scopes.map(scope =>
        fetchRows<AirdropItemData>({ code: AIRDROPS_ACCOUNT, table: `airdrops`, scope, limit: 1 }).then(res => res.length > 0 ? res[0] : null),
      ),
    );

    this._airdrops = airdropsData.filter(Boolean).map(data => new AirdropItem(data!));
  }

  @computed get airdrops() {
    return this._airdrops;
  }
}

export default AirdropStore;
