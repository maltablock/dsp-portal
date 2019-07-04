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
};

export default class AirdropItem {
  @observable data: AirdropItemData;
  @observable balance: number | undefined = undefined;
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

    this.balance = undefined;
    this.claimed = false;
    const bounds = getTableBoundsForNameAsValue(account);

    await Promise.all([
      fetchRows<GrabsTableRow>({
        code: AIRDROPS_ACCOUNT,
        table: `grabs`,
        scope: this.data.issuer,
        lower_bound: `${bounds.lower_bound}`,
        upper_bound: `${bounds.upper_bound}`,
        limit: 1,
        key_type: `uint64`,
      })
        .then(grabsRows => {
          this.claimed = grabsRows.length > 0 && grabsRows[0].owner === account;
        })
        .catch(error => {
          console.error(error.message);
        }),
      axios
        .get(`${this.data.url_prefix}${account}`, {
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        })
        .then(response => {
          this.balance = Number.parseInt(response.data);
        })
        .catch(error => {
          console.error(error.message);
        }),
    ]);
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
