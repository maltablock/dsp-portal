export interface IDappPackageData {
  id                 : number // 1,
  api_endpoint       : string // "https://dspapi.eosinfra.io",
  package_json_uri   : string // "https://eosinfra.io/dsp-package.json",
  package_id         : string // "package1",
  service            : string // "ipfsservice1",
  provider           : string // "eosinfradsp1",
  quota              : string // "0.1000 QUOTA",
  package_period     : number // 3600,
  min_stake_quantity : string // "1.0000 DAPP",
  min_unstake_period : number // 3600,
  enabled            : number // 1
  icon?              : string // URL
}
