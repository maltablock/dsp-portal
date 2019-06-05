import React from 'react';
import { inject, observer } from 'mobx-react';
import DialogStore from '../state/DialogStore';
import TransactionDialog from './TransactionDialog';

type Props = {
  dialogStore?: DialogStore;
}

const AllDialogs = ({ dialogStore }: Props) => {
  return (
    <div>
      {
        dialogStore!.transactionDialogs.map(dialog =>
          <TransactionDialog dialog={dialog} key={dialog.title} />
        )
      }
    </div>
  )
}

export default inject('dialogStore')(observer(AllDialogs));
