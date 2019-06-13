import { AssetSymbol } from 'app/shared/typings';

export const DAPPSERVICES_CONTRACT = `dappservices`;
export const DAPPHODL_CONTRACT = `dappairhodl1`;
export type DappContractTypes = `dappservices` | `dappairhodl1`
export const DAPPPRICE_CONTRACT = `instanttrack`;
export const DAPP_TOKENS_PER_CYCLE = 563063; // https://www.liquidapps.io/auction
export const DAPP_SYMBOL: AssetSymbol = {
  symbolCode: `DAPP`,
  precision: 4,
};
export const DAPPHODL_SYMBOL: AssetSymbol = {
  symbolCode: `DAPPHDL`,
  precision: 4,
};
export const QUOTA_SYMBOL: AssetSymbol = {
  symbolCode: `QUOTA`,
  precision: 4,
};

// LocalStorage key
export const EOS_NETWORK_LS_KEY = 'eos_network';

export enum WALLETS {
  scatter = 'scatter',
  ledger = 'ledger',
  lynx = 'lynx',
  meetone = 'meetone',
  tokenpocket = 'tokenpocket',
}

export const walletIdByName = {
  scatter: 'scatter',
  ledger: 'ledger',
  lynx: 'EOS Lynx',
  meetone: 'meetone_provider',
  tokenpocket: 'TokenPocket'
}
