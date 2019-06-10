import { AssetSymbol } from 'app/shared/typings';

export const DAPPSERVICES_CONTRACT = `dappservices`;
export const DAPPPRICE_CONTRACT = `instanttrack`;
export const DAPP_TOKENS_PER_CYCLE = 563063; // https://www.liquidapps.io/auction
export const DAPPHODL_CONTRACT = `dappairhodl1`;
export const DAPP_SYMBOL: AssetSymbol = {
  symbolCode: `DAPP`,
  precision: 4,
};
export const DAPPHODL_SYMBOL: AssetSymbol = {
  symbolCode: `DAPPHDL`,
  precision: 4,
};

// LocalStorage key
export const EOS_NETWORK_LS_KEY = 'eos_network';
