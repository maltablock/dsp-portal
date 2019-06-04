import { observable, action, computed } from 'mobx';
import { wallet, fetchRows, decomposeAsset, Symbol } from 'app/shared/eos';
import {
  DAPPSERVICES_CONTRACT,
  DAPPHODL_CONTRACT,
  DAPPPRICE_CONTRACT,
  DAPP_TOKENS_PER_CYCLE,
} from 'app/shared/eos/constants';
import { getTableBoundsForName } from 'app/shared/eos/name';
import demoData from '../demo-data.json';

// AccountInfo from eos-transit/lib has the wrong types
type AccountInfoFixed = {
  account_name: string;
};

type StakeInfo = {
  account: string;
  balance: number;
  symbol: Symbol;
  id: number;
  last_reward: string;
  last_usage: string;
  package: string;
  package_end: string;
  package_started: string;
  pending_package: string;
  provider: string;
  quota: number;
  service: string;
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
  /*
   * Login logic and account info
   */

  @observable isLoggingIn = false;
  @observable accountInfo?: AccountInfoFixed | null;

  @computed get isLoggedIn() {
    return !!this.accountInfo;
  }

  @action login = async () => {
    if (this.isLoggingIn) return;

    this.isLoggingIn = true;

    try {
      await wallet.connect();
      const accountInfo = (await wallet.login()) as unknown;
      this.accountInfo = accountInfo as AccountInfoFixed;
      // reset all observables to not have stale data from previous account
      this.stakes = this.dappHdlInfo = this.dappInfo = undefined;
      this.fetchInfo();
    } catch (err) {
      console.error(err.message);
    }

    localStorage.setItem(LOGGED_IN_LS_KEY, 'true');
    this.isLoggingIn = false;
  };

  @action logout = async () => {
    try {
      await wallet.logout();
      this.accountInfo = null;
      localStorage.removeItem(LOGGED_IN_LS_KEY);
    } catch (err) {
      console.error(err);
    }
  };

  @action init = () => {
    if (localStorage.getItem(LOGGED_IN_LS_KEY) === 'true') {
      this.login();
    }
    this.fetchDappPrice();
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

  @observable stakes?: StakeInfo[];
  @observable dappHdlInfo?: DappHdlInfo;
  @observable dappInfo?: DappInfo;

  @action fetchInfo = async () => {
    if (!this.accountInfo) return;

    if (process.env.REACT_APP_USE_DEMO_DATA) {
      this.dappInfo = demoData.dappInfo;
      this.dappHdlInfo = demoData.dappHdlInfo;
      this.stakes = demoData.stakes;

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

      // by_account_service consists of 128 bit: 64 bit encoded name, 64 bit encoded service. ALL LITTLE ENDIAN (!)
      // https://github.com/liquidapps-io/zeus-dapp-network/blob/9f0fd5d8cff78d7f429a6284aedeb23f45f21263/dapp-services/contracts/eos/dappservices/dappservices.cpp#L116
      const nameBounds = getTableBoundsForName(this.accountInfo.account_name);
      const servicePart = `0`.repeat(16);
      nameBounds.lower_bound = `0x${servicePart}${nameBounds.lower_bound}`;
      nameBounds.upper_bound = `0x${servicePart}${nameBounds.upper_bound}`;
      const stakesResult = await fetchRows<any>({
        code: DAPPSERVICES_CONTRACT,
        scope: `DAPP`,
        table: `accountext`,
        index_position: `3`, // &accountext::by_account_service
        key_type: `i128`,
        lower_bound: `${nameBounds.lower_bound}`,
        upper_bound: `${nameBounds.upper_bound}`,
      });
      this.stakes = stakesResult.map(stake => {
        const { amount: balance, symbol } = decomposeAsset(stake.balance);
        const { amount: quota } = decomposeAsset(stake.quota);
        return {
          ...stake,
          balance,
          symbol,
          quota,
        };
      });

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


  @action handleUnstake = () => {} // TODO
  @action handleWithdraw = () => {} // TODO

  get vestingEndDate() {
    return "2021-02-26T16:00:00.000";
  }

  @computed get unstakedBalance() {
    return this.dappInfo ? this.dappInfo.unstakedBalance : 0;
  }

  @computed get totalStakedDappAmount() {
    return (this.stakes || []).reduce((sum, stake) => sum + stake.balance, 0);
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
}

export default ProfileStore;
