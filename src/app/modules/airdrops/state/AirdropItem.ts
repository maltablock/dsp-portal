import { computed, observable, action } from 'mobx';

export type AirdropItemData = {
  issuer: string;
  memo: string;
  token: string;
  url_prefix: string;
};

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

    this.balance = Math.trunc(Math.random() * 1234);
    this.claimed = Math.random() < 0.5;
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

  @action async claim() {}
}
