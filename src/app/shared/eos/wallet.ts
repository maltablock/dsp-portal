import { initAccessContext } from 'eos-transit';
import scatter from 'eos-transit-scatter-provider';
import { getNetwork } from './networks';

const network = getNetwork();

const accessContext = initAccessContext({
  appName: 'DAPP Portal Malta Block',
  network,
  walletProviders: [scatter()],
});

const walletProviders = accessContext.getWalletProviders();

// we only have scatter for now, so select it instead of asking for user
const selectedProvider = walletProviders[0];

const wallet = accessContext.initWallet(selectedProvider);

export { wallet };
