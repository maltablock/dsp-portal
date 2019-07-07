import { observable, action, computed } from 'mobx';
import flatten from 'lodash/flatten';
import { getWallet, fetchRows, decomposeAsset, selectWalletProvider } from 'app/shared/eos';
import {
  DAPPSERVICES_CONTRACT,
  DAPPHODL_CONTRACT,
  DAPPPRICE_CONTRACT,
  DAPP_TOKENS_PER_CYCLE,
  EOS_NETWORK_LS_KEY,
  WALLETS,
} from 'app/shared/eos/constants';

import RootStore from 'app/root/RootStore';
import {
  withdrawTransaction,
  refreshAndCleanupTransaction,
} from 'app/modules/transactions/logic/transactions';
import demoData from '../demo-data.json';
import { DialogTypes } from 'app/modules/dialogs';
import { RpcError } from 'eosjs';

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
const WALLET_LS_KEY = 'app__wallet';
const LOGIN_PARAMS_LS_KEY = 'app__login_params';

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
  };

  setLoginStatusToStorage = (isLoggedIn = 'false') => {
    localStorage.setItem(LOGGED_IN_LS_KEY, isLoggedIn);
  };

  getWalletFromStorage = () => {
    return localStorage.getItem(WALLET_LS_KEY);
  };

  setWalletToStorage = (walletName: WALLETS) => {
    localStorage.setItem(WALLET_LS_KEY, walletName);
  };

  getLoginParamsFromStorage = () => {
    return JSON.parse(localStorage.getItem(LOGIN_PARAMS_LS_KEY) || 'null');
  }

  setLoginParamsToStorage = loginParams => {
    localStorage.setItem(LOGIN_PARAMS_LS_KEY, JSON.stringify(loginParams));
  }

  @action login = async (walletName: WALLETS) => {
    if (this.isLoggingIn) return;

    this.isLoggingIn = true;

    try {
      selectWalletProvider(walletName);
      await getWallet().connect();

      let loginParams: string[] = [];

      if (walletName === WALLETS.ledger) {
        const loginParamsCache = this.getLoginParamsFromStorage();

        if (loginParamsCache) {
          loginParams = loginParamsCache;
        } else {
          const {
            data: { account, authorization },
          } = await this.rootStore.dialogStore.openDialog(DialogTypes.LEDGER_ACCOUNT);
          loginParams = [account, authorization];
          this.setLoginParamsToStorage(loginParams);
        }
      }

      const accountInfo = (await getWallet().login(...loginParams)) as unknown;
      this.accountInfo = accountInfo as AccountInfoFixed;
      // reset all observables to not have stale data from previous account
      this.dappHdlInfo = this.dappInfo = undefined;
      this.fetchInfo();
      this.setLoginStatusToStorage('true');
      this.setWalletToStorage(walletName);

      if(this.rootStore.uiStore.mainNavigation === `LiquidAirdrops`) {
        this.rootStore.airdropStore.init()
      }
    } catch (err) {
      console.error(err);
      this.setLoginStatusToStorage('false');
      this.setLoginParamsToStorage(null);

      if(err instanceof RpcError && /unknown key/.test(err.message)) {
        // fix a bug when changing networks with Scatter without logging out
        // then forgetIdentity() is never called on login, but needs to be
        // https://github.com/eosnewyork/eos-transit/blob/6430187a0e86080d8410e9f5cde3a6f39184db5b/packages/eos-transit-scatter-provider/src/index.ts#L48
        // bug is triggered by eostransit get_account failing to fetch the user
        try {
          await getWallet().logout()
          this.isLoggingIn = false;
          return this.login(walletName)
        } catch {}
      }
    }

    this.isLoggingIn = false;
  };

  @action logout = async () => {
    this.setLoginStatusToStorage('false');
    this.setLoginParamsToStorage(null);

    try {
      await getWallet().logout();
      this.accountInfo = null;
    } catch (err) {
      console.error(err);
    }
  };

  @action init = () => {
    const wasLoggedIn = this.getLoginStatusFromStorage() === 'true';
    const walletName = this.getWalletFromStorage() as WALLETS;

    if (wasLoggedIn && walletName) this.login(walletName);
    this.fetchDappPrice();
  };

  /*
   * EOS network menu
   */

  @action setEosNetwork = network => {
    localStorage.setItem(EOS_NETWORK_LS_KEY, network);
    window.location.reload();
  };

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
      await Promise.all([
        fetchRows<AccountBalanceRow>({
          code: DAPPSERVICES_CONTRACT,
          scope: this.accountInfo.account_name,
          table: `accounts`,
        }).then(dappInfoResult => {
          if (dappInfoResult[0]) {
            this.dappInfo = {
              unstakedBalance: decomposeAsset(dappInfoResult[0].balance).amount,
            };
          }
        }),

        this.rootStore.packageStore.fetchStakedPackages(),

        fetchRows<AccountHodlRow>({
          code: DAPPHODL_CONTRACT,
          scope: this.accountInfo.account_name,
          table: `accounts`,
        }).then(dappHodlResult => {
          // some accounts will not have received the airHODL
          if (dappHodlResult[0]) {
            this.dappHdlInfo = {
              balance: decomposeAsset(dappHodlResult[0].balance).amount,
              allocation: decomposeAsset(dappHodlResult[0].allocation).amount,
              staked: decomposeAsset(dappHodlResult[0].staked).amount,
              claimed: Boolean(dappHodlResult[0].claimed),
            };
          }
        }),
      ]);
    } catch (error) {
      console.error(error.message);
    }
  };

  @action handleWithdraw = async ({ contentSuccess, contentPending }) => {
    const { canceled } = await this.rootStore.dialogStore.openDialog(DialogTypes.WITHDRAW_WARNING, {
      balance: this.totalDappHdlAmount,
      isWithdrawDisabled: !this.totalDappHdlAmount,
    });

    if (canceled) return;

    this.rootStore.dialogStore.openTransactionDialog({
      contentSuccess,
      contentPending,
      performTransaction: async () => {
        const result = await withdrawTransaction();
        await this.fetchInfo();
        return result;
      },
    });
  };

  @action handleRefresh = async ({ contentSuccess, contentPending }) => {
    this.rootStore.dialogStore.openTransactionDialog({
      contentSuccess,
      contentPending,
      performTransaction: async () => {
        const hasDappHdl = Boolean(this.dappHdlInfo)
        // perform a refund of any "stuck" unstakes
        const refundPayloads = flatten(
          this.rootStore.packageStore.stakedPackages.map(p => p.availableRefundsPayloads),
        );
        const result = await refreshAndCleanupTransaction(hasDappHdl, refundPayloads);
        await this.fetchInfo();
        return result;
      },
    });
  };

  get vestingEndDate() {
    return '2021-02-26T16:00:00.000';
  }

  @computed get unstakedDappAmount() {
    return this.dappInfo ? this.dappInfo.unstakedBalance : 0;
  }

  @computed get stakedDappAmount() {
    // includes DAPP and DAPPHDL
    return this.rootStore.packageStore.stakedPackages.reduce(
      (sum, stake) => sum + stake.stakingBalanceFromSelf,
      0,
    );
  }

  @computed get refundingDappAmount() {
    return this.rootStore.packageStore.stakedPackages.reduce(
      (sum, stake) => sum + stake.refundFromSelfAmount,
      0,
    );
  }

  @computed get totalDappAmount() {
    return this.stakedDappAmount + this.unstakedDappAmount + this.refundingDappAmount;
  }

  @computed get unstakedDappHdlAmount() {
    return this.dappHdlInfo ? this.dappHdlInfo.balance : 0;
  }

  @computed get stakedDappHdlAmount() {
    return this.dappHdlInfo ? this.dappHdlInfo.staked : 0;
  }

  @computed get allocatedDappHdlAmount() {
    return this.dappHdlInfo ? this.dappHdlInfo.allocation : 0;
  }

  @computed get totalDappHdlAmount() {
    return this.unstakedDappHdlAmount + this.stakedDappHdlAmount;
  }

  @computed get dappHdlClaimed() {
    return this.dappHdlInfo ? this.dappHdlInfo.claimed : null;
  }
}

export default ProfileStore;
