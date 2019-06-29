import { computed, observable } from 'mobx';
import { decomposeAsset } from 'app/shared/eos';

export type AirdropItemData = {
  issuer: string;
  memo: string;
  token: string;
  url_prefix: string;
};

export default class AirdropItem {
  @observable data: AirdropItemData;

  constructor(data: AirdropItemData) {
    this.data = data;
  }

  @computed get tokenName() {
    return this.data.token.split(`,`)[1];
  }

  @computed get tokenContract() {
    return this.data.issuer;
  }
}
