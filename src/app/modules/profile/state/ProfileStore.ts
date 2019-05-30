import { observable, action } from 'mobx';
import { wallet, fetchAllRows } from 'app/shared/eos';
import { decomposeAsset } from 'app/shared/eos/asset';
import { DAPPSERVICES_CONTRACT } from 'app/shared/eos/constants';
import { getTableBoundsForName, encodeName } from 'app/shared/eos/name';
import BigNumber from 'bignumber.js';

// AccountInfo from eeos-transit/lib has the wrong types
type AccountInfoFixed = {
    account_name: string;
};

type DappHdlInfo = {
    balance: number;
    vestingLeftInSeconds: number;
    claimed: boolean;
};

type DappInfo = {
    unstakedBalance: number;
};

type AccountBalanceRow = {
    balance: string;
};

class ProfileStore {
    @observable accountInfo?: AccountInfoFixed;
    @observable stakes;
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
            this.fetchInfo();
        } catch (error) {
            console.error(error.message);
        }
    };

    @action fetchInfo = async () => {
        if (!this.accountInfo) return;

        try {
            let result = await fetchAllRows<AccountBalanceRow>({
                code: DAPPSERVICES_CONTRACT,
                scope: this.accountInfo.account_name,
                table: `accounts`,
            });
            this.dappInfo = {
                unstakedBalance: decomposeAsset(result[0].balance).amount,
            };

            // by_account_service consists of 128 bit: 64 bit encoded name, 64 bit encoded service
            // https://github.com/liquidapps-io/zeus-dapp-network/blob/9f0fd5d8cff78d7f429a6284aedeb23f45f21263/dapp-services/contracts/eos/dappservices/dappservices.cpp#L116
            const nameBounds = getTableBoundsForName(this.accountInfo.account_name);
            const servicePart = `0`.repeat(16);
            nameBounds.lower_bound = `0x${servicePart}${nameBounds.lower_bound}`;
            nameBounds.upper_bound = `0x${servicePart}${nameBounds.upper_bound}`;
            result = await fetchAllRows(
                {
                    code: DAPPSERVICES_CONTRACT,
                    scope: `DAPP`,
                    table: `accountext`,
                    index_position: `3`, // &accountext::by_account_service
                    key_type: `i128`,
                    lower_bound: `${nameBounds.lower_bound}`,
                    upper_bound: `${nameBounds.upper_bound}`,
                    limit: 10,
                },
                ``,
            );
            console.log(result);
        } catch (error) {
            console.error(error.message);
        }
    };
}

export default ProfileStore;
