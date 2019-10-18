import { computed, observable, action } from 'mobx';
import { fetchRows, getTableBoundsForNameAsValue } from 'app/shared/eos';
import { AIRDROPS_ACCOUNT } from 'app/shared/eos/constants';
import axios from 'axios';
import emanateSrc from 'app/shared/assets/emanate.svg'
import liquidAppsSrc from 'app/shared/icons/liquidapps_logo.svg';

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
  @observable tokenContract: string;
  @observable balance: number | undefined = undefined;
  @observable claimed: boolean = false;

  constructor(tokenContract, data: AirdropItemData) {
    this.tokenContract = tokenContract
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

    return Promise.all([
      fetchRows<GrabsTableRow>({
        code: AIRDROPS_ACCOUNT,
        table: `grabs`,
        scope: this.tokenContract,
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
          // AWS S3 responds with 403 Forbidden error when account entry does not exist
          // which means account was never included in the snapshot or had a balance of 0
          if(error.response && error.response.status === 403) {
            this.balance = 0;
            return;
          }

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

  @computed get endDate() {
    return `TBD`;
  }

  @computed get bytesRequired() {
    return 241;
  }

  @computed get tokenLogoSrc() {
    switch(this.tokenContract) {
      case `emanateoneos`:
        return emanateSrc
      default:
        return liquidAppsSrc
    }
  }
}
