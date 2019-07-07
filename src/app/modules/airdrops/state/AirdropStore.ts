import { observable, action, computed } from 'mobx';
import RootStore from 'app/root/RootStore';
import AirdropItem, { AirdropItemData } from './AirdropItem';
import { fetchAllScopes, fetchRows } from 'app/shared/eos';
import { AIRDROPS_ACCOUNT } from 'app/shared/eos/constants';

class AirdropStore {
  rootStore: RootStore;
  @observable protected _airdrops: AirdropItem[] = [];
  @observable displayAccount: string = '';
  @observable loadingBalances: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action async init() {
    await this.fetchAirdrops();
    if (this.rootStore.profileStore.isLoggedIn) {
      this.displayAccount = this.rootStore.profileStore.accountInfo!.account_name;
      await this.fetchBalances();
    }
  }

  @action async fetchAirdrops() {
    const scopes = await fetchAllScopes(AIRDROPS_ACCOUNT, `airdrops`);
    let airdropsData = await Promise.all(
      scopes.map(scope =>
        fetchRows<AirdropItemData>({
          code: AIRDROPS_ACCOUNT,
          table: `airdrops`,
          scope,
          limit: 1,
        }).then(res => (res.length > 0 ? res[0] : null)),
      ),
    );

    this._airdrops = airdropsData
      .filter(Boolean)
      .map((data, index) => new AirdropItem(scopes[index], data!));
  }

  @action async changeDisplayAccount(account: string) {
    this.displayAccount = account;
  }

  @action async fetchBalances() {
    if (!this.displayAccount) return;

    this.loadingBalances = true;
    try {
      await Promise.all(
        this._airdrops.map(airdrop =>
          airdrop.fetchBalance(this.displayAccount).catch(err => {
            console.error(`fetchBalances failed: `, err.message);
          }),
        ),
      );
    } catch (err) {
      console.error(err.message);
    }

    this.loadingBalances = false;
  }

  @computed get airdrops() {
    return this._airdrops;
  }
}

export default AirdropStore;
