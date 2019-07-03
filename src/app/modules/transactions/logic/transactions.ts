import { getWallet } from 'app/shared/eos/wallet';
import {
  DAPPSERVICES_CONTRACT,
  DAPP_SYMBOL,
  DAPPHODL_SYMBOL,
  DAPPHODL_CONTRACT,
  DappContractTypes,
  AIRDROPS_ACCOUNT,
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
  quantityDapp: string;
  quantityDappHdl: string;
  unstakedDappHdlAmount: number;
  unstakedDappAmount: number;
};
export const stakeTransaction = async (stake: StakePayload): Promise<TransactionResult> => {
  const stakeAmountDappFormatted = `${stake.quantityDapp || `0.0000`} ${DAPP_SYMBOL.symbolCode}`
  const stakeAmountDapp = decomposeAsset(stakeAmountDappFormatted).amount;
  const stakeAmountDappHdlFormatted = `${stake.quantityDappHdl || `0.0000`} ${DAPPHODL_SYMBOL.symbolCode}`
  const stakeAmountDappHdl = decomposeAsset(stakeAmountDappHdlFormatted).amount;

  if (stakeAmountDapp > stake.unstakedDappAmount || stakeAmountDappHdl > stake.unstakedDappHdlAmount) {
    throw new Error(
      `You don't have enough funds to stake ${stakeAmountDappFormatted} and ${stakeAmountDappHdlFormatted}.\nAvailable: ${formatAsset({
        amount: stake.unstakedDappAmount,
        symbol: DAPP_SYMBOL,
      })}, ${formatAsset({ amount: stake.unstakedDappHdlAmount, symbol: DAPPHODL_SYMBOL })}`,
    );
  }

  // always stake normal dapp first
  let stakeActions: Action[] = [];

  if (stakeAmountDapp > 0) {
    stakeActions.push(
      createAction({
        name: 'stake',
        data: {
          from: getWallet().auth!.accountName,
          provider: stake.provider,
          service: stake.service,
          quantity: stakeAmountDappFormatted
        },
      }),
    );
  }

  if (stakeAmountDappHdl > 0) {
    stakeActions.push(
      createAction({
        account: DAPPHODL_CONTRACT,
        name: 'stake',
        data: {
          owner: getWallet().auth!.accountName,
          provider: stake.provider,
          service: stake.service,
          quantity: stakeAmountDappHdlFormatted,
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
  quantityDapp: string;
  quantityDappHdl: string;
  stakingBalanceFromSelf: number;
  stakingBalanceFromSelfDappHdl: number;
};
export const unstakeTransaction = async (stake: UnstakePayload): Promise<TransactionResult> => {
  const stakeAmountDappFormatted = `${stake.quantityDapp || `0.0000`} ${DAPP_SYMBOL.symbolCode}`
  const stakeAmountDapp = decomposeAsset(stakeAmountDappFormatted).amount;
  const stakeAmountDappHdlFormatted = `${stake.quantityDappHdl || `0.0000`} ${DAPPHODL_SYMBOL.symbolCode}`
  const stakeAmountDappHdl = decomposeAsset(stakeAmountDappHdlFormatted).amount;

  if (stakeAmountDapp > stake.stakingBalanceFromSelf || stakeAmountDappHdl > stake.stakingBalanceFromSelfDappHdl) {
    throw new Error(
      `You don't have enough funds staked to this package to unstake ${stakeAmountDappFormatted} and ${stakeAmountDappHdlFormatted}.\nAvailable: ${formatAsset({
        amount: stake.stakingBalanceFromSelf,
        symbol: DAPP_SYMBOL,
      })}, ${formatAsset({ amount: stake.stakingBalanceFromSelfDappHdl, symbol: DAPPHODL_SYMBOL })}`,
    );
  }

  let stakeActions: Action[] = [];

  if (stakeAmountDapp > 0) {
    stakeActions.push(
      createAction({
        name: 'unstake',
        data: {
          to: getWallet().auth!.accountName,
          provider: stake.provider,
          service: stake.service,
          quantity: stakeAmountDappFormatted
        },
      }),
    );
  }

  if (stakeAmountDappHdl > 0) {
    stakeActions.push(
      createAction({
        account: DAPPHODL_CONTRACT,
        name: 'unstake',
        data: {
          owner: getWallet().auth!.accountName,
          provider: stake.provider,
          service: stake.service,
          quantity: stakeAmountDappHdlFormatted
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

export type RefundPayload = {
  toContract: DappContractTypes;
  provider: string;
  service: string;
};
export const refreshAndCleanupTransaction = async (
  hasDappHdl,
  refundsPayloads: RefundPayload[],
): Promise<TransactionResult> => {
  let actions: Action[] = [];

  if (hasDappHdl) {
    actions.push(
      createAction({
        account: DAPPHODL_CONTRACT,
        name: 'refresh',
        data: {
          owner: getWallet().auth!.accountName,
        },
      }),
    );
  }

  actions.push(
    ...refundsPayloads.map(refund => {
      switch (refund.toContract) {
        case DAPPHODL_CONTRACT:
          return createAction({
            account: DAPPHODL_CONTRACT,
            name: 'refund',
            data: {
              owner: getWallet().auth!.accountName,
              provider: refund.provider,
              service: refund.service,
            },
          });
        case DAPPSERVICES_CONTRACT:
          return createAction({
            name: 'refund',
            data: {
              to: getWallet().auth!.accountName,
              provider: refund.provider,
              service: refund.service,
              symcode: DAPP_SYMBOL.symbolCode,
            },
          });
        default:
          throw new Error(
            `Invalid contract account in refreshAndCleanupTransaction: "${refund.toContract}"`,
          );
      }
    }),
  );

  if (actions.length === 0) {
    throw new Error(`You do not own any DAPPHDL tokens and there is no expired refund.`);
  }

  return await getWallet().eosApi.transact(
    {
      actions,
    },
    transactionOptions,
  );
};


export type VClaimPayload = {
  tokenContract: string;
  symbol: string;
};
export const vClaim = async (payload: VClaimPayload): Promise<TransactionResult> => {
  return await getWallet().eosApi.transact(
  {
      actions: [
        createAction({
          account: payload.tokenContract,
          name: 'open',
          data: {
            owner: getWallet().auth!.accountName,
            symbol: payload.symbol,
            ram_payer: getWallet().auth!.accountName,
          },
        }),
        createAction({
          account: AIRDROPS_ACCOUNT,
          name: 'grab',
          data: {
            owner: getWallet().auth!.accountName,
            token_contract: payload.tokenContract,
          }
        })
      ],
    },
    transactionOptions,
  );
};