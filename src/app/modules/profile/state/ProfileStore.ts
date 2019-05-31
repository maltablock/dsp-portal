import { observable, action, computed } from 'mobx';
import { wallet, fetchRows, decomposeAsset, Symbol } from 'app/shared/eos';
import { DAPPSERVICES_CONTRACT, DAPPHODL_CONTRACT } from 'app/shared/eos/constants';
import { getTableBoundsForName } from 'app/shared/eos/name';
import demoData from '../demo-data.json';

// AccountInfo from eeos-transit/lib has the wrong types
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

class ProfileStore {
    @observable accountInfo?: AccountInfoFixed;
    @observable stakes?: StakeInfo[];
    @observable dappHdlInfo?: DappHdlInfo;
    @observable dappInfo?: DappInfo;

    @action handleLogin = async () => {
        try {
            await wallet.connect();
            // last Scatter login is saved, need to remove to be able to login again
            try {
                await wallet.logout();
            } catch {}
            const accountInfo = (await wallet.login()) as unknown;
            this.accountInfo = accountInfo as AccountInfoFixed;
            // reset all observables to not have stale data from previous account
            this.stakes = this.dappHdlInfo = this.dappInfo = undefined;
            this.fetchInfo();
        } catch (error) {
            console.error(error.message);
        }
    };

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

    get vestingEndDate() {
        return new Date(`2021-02-26T16:00:00.000`);
    }

    @computed get totalStakedDappAmount() {
        return (this.stakes || []).reduce((sum, stake) => sum + stake.balance, 0)
    }

    @computed get totalDappAmount() {
        return this.totalStakedDappAmount + (this.dappInfo ? this.dappInfo.unstakedBalance : 0)
    }
}

export default ProfileStore;
