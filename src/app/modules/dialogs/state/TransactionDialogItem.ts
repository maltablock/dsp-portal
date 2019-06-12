import { observable, action, computed } from 'mobx';
import { TransactionResult } from 'app/modules/transactions/logic/transactions';
import { DialogStore } from '..';

export enum TransactionStatus {
  Pending = 0,
  Success,
  Failure,
}

export class TransactionDialogItem {
  dialogStore: DialogStore;

  contentSuccess: any;
  contentPending: any;
  performTransaction: () => TransactionResult;
  onClose: () => void;

  @observable transactionId?: string;
  @observable transactionError?: string;
  @observable transactionStatus: TransactionStatus = TransactionStatus.Pending;

  resolvePromise: (any) => void;

  @computed get title() {
    switch (this.transactionStatus) {
      case TransactionStatus.Pending: {
        return `Sending transaction ...`;
      }
      case TransactionStatus.Success: {
        return `Transactions Successful`;
      }
      case TransactionStatus.Failure: {
        return `Transaction failed`;
      }
    }
  }

  @action close = () => {
    this.resolvePromise({ canceled: true });
    this.dialogStore.transactionDialogs.remove(this);
    if (typeof this.onClose === `function`) this.onClose();
  };

  @action startTransaction = async () => {
    try {
      if(!this.dialogStore.rootStore.profileStore.isLoggedIn) {
        // await this.dialogStore.rootStore.profileStore.login();
        // TODO: show dialog asking to login
        return;
      }
      const result = await this.performTransaction();
      this.transactionId = result.transaction_id;
      this.transactionStatus = TransactionStatus.Success;
    } catch (err) {
      this.transactionStatus = TransactionStatus.Failure;
      this.transactionError = err.message;
      console.error(err.message);
    }
  };

  constructor(dialogStore, dialogData, resolvePromise) {
    this.dialogStore = dialogStore;
    this.resolvePromise = resolvePromise;

    const { contentSuccess, contentPending, performTransaction, onClose } = dialogData;
    this.performTransaction = performTransaction;
    this.contentSuccess = contentSuccess;
    this.contentPending = contentPending;
    this.onClose = onClose;

    this.transactionStatus = TransactionStatus.Pending;
    this.transactionId = ``;
    this.transactionError = undefined;

    this.startTransaction();
  }
}

export type TransactionDialogData = {
  contentPending: any;
  contentSuccess: any;
  performTransaction: () => Promise<any>;
  onClose?: () => void;
};
