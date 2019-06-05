import { wallet } from 'app/shared/eos/wallet';
import { DAPPSERVICES_CONTRACT, DAPP_SYMBOL } from 'app/shared/eos/constants';

export type TransactionResult = {
  transaction_id: string
}

export type StakePayload = {
  provider: string
  service: string 
  package: string
  quantity: string
}
export const stakeTransaction = async (stake: StakePayload): Promise<TransactionResult> => {
  return await wallet.eosApi
      .transact({
        actions: [
          {
            account: DAPPSERVICES_CONTRACT,
            name: 'selectpkg',
            authorization: [
              {
                actor: wallet.auth!.accountName,
                permission: wallet.auth!.permission
              }
            ],
            data: {
              owner: wallet.auth!.accountName,
              provider: stake.provider,
              service: stake.service,
              package: stake.package
            }
          },
          {
            account: DAPPSERVICES_CONTRACT,
            name: 'stake',
            authorization: [
              {
                actor: wallet.auth!.accountName,
                permission: wallet.auth!.permission
              }
            ],
            data: {
              from: wallet.auth!.accountName,
              provider: stake.provider,
              service: stake.service,
              quantity: `${stake.quantity} ${DAPP_SYMBOL.symbolCode}`
            }
          }
        ]
      },
      {
        broadcast: true,
        blocksBehind: 3,
        expireSeconds: 60
      }
    )
}

export type UnstakePayload = {
  provider: string
  service: string 
  quantity: string
}
export const unstakeTransaction = async (stake: UnstakePayload): Promise<TransactionResult> => {
    return await wallet.eosApi
    .transact({
      actions: [
        {
          account: DAPPSERVICES_CONTRACT,
          name: 'unstake',
          authorization: [
            {
              actor: wallet.auth!.accountName,
              permission: wallet.auth!.permission
            }
          ],
          data: {
            to: wallet.auth!.accountName,
            provider: stake.provider,
            service: stake.service,
            quantity: `${stake.quantity} ${DAPP_SYMBOL.symbolCode}`
          }
        }
      ]
    },
    {
      broadcast: true,
      blocksBehind: 3,
      expireSeconds: 60
    }
  )
}