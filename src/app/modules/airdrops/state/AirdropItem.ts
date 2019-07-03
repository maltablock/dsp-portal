import { computed, observable, action } from 'mobx';
import { fetchRows, getTableBoundsForNameAsValue } from 'app/shared/eos';
import { AIRDROPS_ACCOUNT } from 'app/shared/eos/constants';
import axios from 'axios';

export type AirdropItemData = {
  issuer: string;
  memo: string;
  token: string;
  url_prefix: string;
};

type GrabsTableRow = {
  owner: string;
}

export default class AirdropItem {
  @observable data: AirdropItemData;
  @observable balance: number = 0;
  @observable claimed: boolean = false;

  constructor(data: AirdropItemData) {
    this.data = data;
  }

  @action resetBalance() {
    this.balance = 0;
    this.claimed = false;
  }

  @action async fetchBalance(account: string) {
    this.resetBalance();

    this.balance = 0;
    this.claimed = false;
    const bounds = getTableBoundsForNameAsValue(account)

    const grabsRows = await fetchRows<GrabsTableRow>({
      code: AIRDROPS_ACCOUNT,
      table: `grabs`,
      scope: this.data.issuer,
      lower_bound: `${bounds.lower_bound}`,
      upper_bound: `${bounds.upper_bound}`,
      limit: 1,
      key_type: `uint64`
    });
    this.claimed = grabsRows.length > 0 && grabsRows[0].owner === account

    const balanceResult = await axios.get(`${this.data.url_prefix}${account}`).catch(error => console.error(error.message));
    this.balance = 1 /* TODO when cors issues are fixed */
  }

  @computed get tokenSymbol() {
    const [precision, name] = this.data.token.split(`,`);

    return {
      symbolCode: name,
      precision: Number.parseInt(precision),
    };
  }

  @computed get tokenName() {
    return this.data.token.split(`,`)[1];
  }

  @computed get tokenContract() {
    return this.data.issuer;
  }

  @computed get endDate() {
    return `TBD`;
  }

  @computed get bytesRequired() {
    return 241;
  }
}
