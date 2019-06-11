import { getNetworkName } from "app/shared/eos";

export const getBlockExplorerUrl = tx => {
  const networkName = getNetworkName()

  switch(networkName) {
    case `kylin`:
      return `https://kylin.eosq.app/tx/${tx}`
      default:
        return `https://eosq.app/tx/${tx}`
  }
}