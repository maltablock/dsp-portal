import React from 'react';
import { inject, observer } from 'mobx-react';
import DialogStore from '../state/DialogStore';
import TransactionDialog from './TransactionDialog';
import { DialogTypes } from '../constants';
import WithdrawWarningDialog from 'app/modules/profile/components/WithdrawWarningDialog';
import LedgerAccountDialog from 'app/modules/profile/components/LedgerAccountDialog';

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

      {
        dialogStore!.dialogs.map((dialog, index) => {
          switch (dialog.type) {
            case DialogTypes.WITHDRAW_WARNING:
              return <WithdrawWarningDialog key={index} dialog={dialog} />;
            case DialogTypes.LEDGER_ACCOUNT:
              return <LedgerAccountDialog key={index} dialog={dialog} />
            default:
              return null;
          }
        })
      }
    </div>
  )
}

export default inject('dialogStore')(observer(AllDialogs));
