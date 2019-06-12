import { getWallet } from 'app/shared/eos/wallet';
import {
  DAPPSERVICES_CONTRACT,
  DAPP_SYMBOL,
  DAPPHODL_SYMBOL,
  DAPPHODL_CONTRACT,
} from 'app/shared/eos/constants';
import { Action } from 'eosjs/dist/eosjs-serialize';
import { decomposeAsset, formatAsset } from 'app/shared/eos';

export type TransactionResult = {
  transaction_id: string;
};

const transactionOptions = {
  broadcast: true,
  blocksBehind: 3,
  expireSeconds: 60,
};

const createAction = (action: any): Action => {
  return Object.assign(
    {
      account: DAPPSERVICES_CONTRACT,
      authorization: [
        {
          actor: getWallet().auth!.accountName,
          permission: getWallet().auth!.permission,
        },
      ],
      data: {},
    },
    action,
  );
};

export type StakePayload = {
  provider: string;
  service: string;
  package: string;
  quantity: string;
  unstakedDappHdlAmount: number;
  unstakedDappAmount: number;
};
export const stakeTransaction = async (stake: StakePayload): Promise<TransactionResult> => {
  const stakeAmount = decomposeAsset(`${stake.quantity} ${DAPP_SYMBOL}`).amount;

  if (stake.unstakedDappAmount + stake.unstakedDappHdlAmount < stakeAmount) {
    throw new Error(
      `You don't have enough funds to stake ${formatAsset({
        amount: stakeAmount,
        symbol: DAPP_SYMBOL,
      })}.\nAvailable: ${formatAsset({
        amount: stake.unstakedDappAmount,
        symbol: DAPP_SYMBOL,
      })}, ${formatAsset({ amount: stake.unstakedDappHdlAmount, symbol: DAPPHODL_SYMBOL })}`,
    );
  }

  // always stake normal dapp first
  let stakeActions: Action[] = [];

  if (stake.unstakedDappAmount > 0) {
    stakeActions.push(
      createAction({
        name: 'stake',
        data: {
          from: getWallet().auth!.accountName,
          provider: stake.provider,
          service: stake.service,
          quantity: formatAsset({
            amount: Math.min(stakeAmount, stake.unstakedDappAmount),
            symbol: DAPP_SYMBOL,
          }),
        },
      }),
    );
  }

  // stake DAPPHDL if necessary
  const leftOverAmount = stakeAmount - stake.unstakedDappAmount;
  if (leftOverAmount > 0) {
    stakeActions.push(
      createAction({
        account: DAPPHODL_CONTRACT,
        name: 'stake',
        data: {
          owner: getWallet().auth!.accountName,
          provider: stake.provider,
          service: stake.service,
          quantity: formatAsset({ amount: leftOverAmount, symbol: DAPPHODL_SYMBOL }),
        },
      }),
    );
  }

  return await getWallet().eosApi.transact(
    {
      actions: [
        createAction({
          name: 'selectpkg',
          data: {
            owner: getWallet().auth!.accountName,
            provider: stake.provider,
            service: stake.service,
            package: stake.package,
          },
        }),
        ...stakeActions,
      ],
    },
    transactionOptions,
  );
};

export type UnstakePayload = {
  provider: string;
  service: string;
  quantity: string;
  stakingBalanceFromSelf: number;
  stakingBalanceFromSelfDappHdl: number;
};
export const unstakeTransaction = async (stake: UnstakePayload): Promise<TransactionResult> => {
  const stakeAmount = decomposeAsset(`${stake.quantity} ${DAPP_SYMBOL}`).amount;

  if (stake.stakingBalanceFromSelf + stake.stakingBalanceFromSelfDappHdl < stakeAmount) {
    throw new Error(
      `You do not have enough funds staked to unstake ${formatAsset({
        amount: stakeAmount,
        symbol: DAPP_SYMBOL,
      })}.\nAvailable: ${formatAsset({
        amount: stake.stakingBalanceFromSelf,
        symbol: DAPP_SYMBOL,
      })}, ${formatAsset({ amount: stake.stakingBalanceFromSelfDappHdl, symbol: DAPP_SYMBOL })}`,
    );
  }

  // always unstake DAPPHDL first
  let stakeActions: Action[] = [];

  if (stake.stakingBalanceFromSelfDappHdl > 0) {
    stakeActions.push(
      createAction({
        account: DAPPHODL_CONTRACT,
        name: 'unstake',
        data: {
          owner: getWallet().auth!.accountName,
          provider: stake.provider,
          service: stake.service,
          quantity: formatAsset({
            amount: Math.min(stakeAmount, stake.stakingBalanceFromSelfDappHdl),
            symbol: DAPPHODL_SYMBOL,
          }),
        },
      }),
    );
  }

  // unstake DAPP if necessary
  const leftOverAmount = stakeAmount - stake.stakingBalanceFromSelfDappHdl;
  if (leftOverAmount > 0) {
    stakeActions.push(
      createAction({
        name: 'unstake',
        data: {
          to: getWallet().auth!.accountName,
          provider: stake.provider,
          service: stake.service,
          quantity: formatAsset({ amount: leftOverAmount, symbol: DAPP_SYMBOL }),
        },
      }),
    );
  }

  return await getWallet().eosApi.transact(
    {
      actions: stakeActions,
    },
    transactionOptions,
  );
};

export const refreshTransaction = async (): Promise<TransactionResult> => {
  return await getWallet().eosApi.transact(
    {
      actions: [
        createAction({
          account: DAPPHODL_CONTRACT,
          name: 'refresh',
          data: {
            owner: getWallet().auth!.accountName,
          },
        }),
      ],
    },
    transactionOptions,
  );
};

export const withdrawTransaction = async (): Promise<TransactionResult> => {
  return await getWallet().eosApi.transact(
    {
      actions: [
        createAction({
          account: DAPPHODL_CONTRACT,
          name: 'withdraw',
          data: {
            owner: getWallet().auth!.accountName,
          },
        }),
      ],
    },
    transactionOptions,
  );
};
