import React from 'react'
import { AmountText } from './TransactionStyles';

type Props = {
  quantityDapp: string
  quantityDappHdl: string
}
export default function AssetFormatter({ quantityDapp, quantityDappHdl}:Props) {
  const dappPart = quantityDapp ? <AmountText>{quantityDapp} DAPP</AmountText> : null
  const dappHdlPart = quantityDappHdl ? <AmountText>{quantityDappHdl} DAPPHDL</AmountText> : null

  if(dappPart && dappHdlPart) {
    return (
      <React.Fragment>
         {dappPart} and {dappHdlPart} 
      </React.Fragment>
    )
  }

  return dappPart ? dappPart : dappHdlPart
}