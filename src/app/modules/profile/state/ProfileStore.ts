import { observable, action, computed } from 'mobx';
import { wallet, fetchRows, decomposeAsset } from 'app/shared/eos';
import {
  DAPPSERVICES_CONTRACT,
  DAPPHODL_CONTRACT,
  DAPPPRICE_CONTRACT,
  DAPP_TOKENS_PER_CYCLE,
  EOS_NETWORK_LS_KEY,
} from 'app/shared/eos/constants';

import RootStore from 'app/root/RootStore';
import { refreshTransaction, withdrawTransaction } from 'app/modules/transactions/logic/transactions';
import demoData from '../demo-data.json';

// AccountInfo from eos-transit/lib has the wrong types
type AccountInfoFixed = {
  account_name: string;
};

type DappHdlInfo = {
  balance: number;
  allocation: number;
  staked: number;
  claimed: boolean;
};

type DappInfo = {
  unstakedBalance: number;
};

type AccountBalanceRow = {
  balance: string;
};
type AccountHodlRow = {
  balance: string;
  allocation: string;
  staked: string;
  claimed: number;
};
type CycleRow = {
  total_payins: string;
  number: number;
};

const LOGGED_IN_LS_KEY = 'app__is_logged_in';

class ProfileStore {
  rootStore: RootStore;
  eosNetwork = localStorage.getItem(EOS_NETWORK_LS_KEY) || 'mainnet';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  /*
   * Login logic and account info
   */

  @observable isLoggingIn = false;
  @observable accountInfo?: AccountInfoFixed | null;

  @computed get isLoggedIn() {
    return !!this.accountInfo;
  }

  getLoginStatusFromStorage = () => {
    return localStorage.getItem(LOGGED_IN_LS_KEY);
  }

  setLoginStatusToStorage = (isLoggedIn = 'false') => {
    localStorage.setItem(LOGGED_IN_LS_KEY, isLoggedIn);
  }

  @action login = async () => {
    if (this.isLoggingIn) return;

    this.isLoggingIn = true;

    try {
      await wallet.connect();
      const accountInfo = (await wallet.login()) as unknown;
      this.accountInfo = accountInfo as AccountInfoFixed;
      // reset all observables to not have stale data from previous account
      this.dappHdlInfo = this.dappInfo = undefined;
      this.fetchInfo();
      this.setLoginStatusToStorage('true');
    } catch (err) {
      console.error(err.message);
      this.setLoginStatusToStorage('false');
    }

    this.isLoggingIn = false;
  };

  @action logout = async () => {
    this.setLoginStatusToStorage('false');

    try {
      await wallet.logout();
      this.accountInfo = null;
    } catch (err) {
      console.error(err);
    }
  };


  @action init = () => {
    if (this.getLoginStatusFromStorage() === 'true') {
      this.login();
    }
    this.fetchDappPrice();
  };


  /*
   * EOS network menu
   */

  @action setEosNetwork = network => {
    localStorage.setItem(EOS_NETWORK_LS_KEY, network);
    window.location.reload();
  }

  /*
   * Converting DAPP to USD
   */

  @observable usdPerDapp = 0;

  @action fetchDappPrice = async () => {
    try {
      const [dappPriceResult, eosPriceResult] = await Promise.all([
        fetchRows<CycleRow>({
          code: DAPPPRICE_CONTRACT,
          scope: DAPPPRICE_CONTRACT,
          table: `cycle`,
          limit: 1,
          reverse: true,
        }),
        fetch(`https://min-api.cryptocompare.com/data/price?fsym=EOS&tsyms=USD`).then(response =>
          response.json(),
        ),
      ]);

      if (dappPriceResult[0] && eosPriceResult.USD) {
        const eosInCurrentCycle = decomposeAsset(dappPriceResult[0].total_payins).amount / 1e4;
        const usdInCurrentCycle = eosInCurrentCycle * eosPriceResult.USD;
        this.usdPerDapp = usdInCurrentCycle / DAPP_TOKENS_PER_CYCLE;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  /*
   * Showing staked DAPPs cards logic (used only for mobile view)
   */

  @observable isCardsExpanded = false;

  @action toggleCardsExpanded = () => {
    this.isCardsExpanded = !this.isCardsExpanded;
  };

  /*
   * Stakes logic
   */

  @observable dappHdlInfo?: DappHdlInfo;
  @observable dappInfo?: DappInfo;

  @action fetchInfo = async () => {
    if (!this.accountInfo) return;

    if (process.env.REACT_APP_USE_DEMO_DATA) {
      this.dappInfo = demoData.dappInfo;
      this.dappHdlInfo = demoData.dappHdlInfo;
      return;
    }

    try {
      const dappInfoResult = await fetchRows<AccountBalanceRow>({
        code: DAPPSERVICES_CONTRACT,
        scope: this.accountInfo.account_name,
        table: `accounts`,
      });
      if (dappInfoResult[0]) {
        this.dappInfo = {
          unstakedBalance: decomposeAsset(dappInfoResult[0].balance).amount,
        };
      }

      await this.rootStore.packageStore.fetchStakedPackages();

      const dappHodlResult = await fetchRows<AccountHodlRow>({
        code: DAPPHODL_CONTRACT,
        scope: this.accountInfo.account_name,
        table: `accounts`,
      });
      // some accounts will not have received the airHODL
      if (dappHodlResult[0]) {
        this.dappHdlInfo = {
          balance: decomposeAsset(dappHodlResult[0].balance).amount,
          allocation: decomposeAsset(dappHodlResult[0].allocation).amount,
          staked: decomposeAsset(dappHodlResult[0].staked).amount,
          claimed: Boolean(dappHodlResult[0].claimed),
        };
      }
    } catch (error) {
      console.error(error.message);
    }
  };


  @action handleWithdraw = async ({ contentSuccess, contentPending }) => {
    this.rootStore.dialogStore.openTransactionDialog({
      contentSuccess,
      contentPending,
      performTransaction: async () => {
        const result = await withdrawTransaction()
        // TODO: @cmichel21 split fetchInfo into several parallel fetches and only refetch dappHodl part
        await this.fetchInfo();
        return result;
      },
    })
  }

  @action handleRefresh = async ({ contentSuccess, contentPending }) => {
    this.rootStore.dialogStore.openTransactionDialog({
      contentSuccess,
      contentPending,
      performTransaction: async () => {
        const result = await refreshTransaction()
        // TODO: @cmichel21 split fetchInfo into several parallel fetches and only refetch dappHodl part
        await this.fetchInfo();
        return result;
      },
    })
  }

  get vestingEndDate() {
    return "2021-02-26T16:00:00.000";
  }

  @computed get unstakedBalance() {
    return this.dappInfo ? this.dappInfo.unstakedBalance : 0;
  }

  @computed get totalStakedDappAmount() {
    return this.rootStore.packageStore.stakedPackages.reduce(
      (sum, stake) => sum + stake.data.balance, 0
    );
  }

  @computed get totalDappAmount() {
    return this.totalStakedDappAmount + this.unstakedBalance;
  }

  @computed get dappHdlAmount() {
    return this.dappHdlInfo ? this.dappHdlInfo.staked : 0;
  }

  @computed get dappHdlBalance() {
    return this.dappHdlInfo ? this.dappHdlInfo.balance : 0;
  }

  @computed get dappHdlClaimed() {
    return this.dappHdlInfo ? this.dappHdlInfo.claimed : null;
  }
}

export default ProfileStore;
