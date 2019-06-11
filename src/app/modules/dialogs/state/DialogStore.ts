import { observable, action } from 'mobx';
import RootStore from 'app/root/RootStore';

import { TransactionDialogItem, TransactionDialogData } from './TransactionDialogItem';
import DialogItem from './DialogItem';
import { DialogTypes } from '../constants';

export default class DialogStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable dialogs = observable.array<DialogItem>([]);
  @observable transactionDialogs = observable.array<TransactionDialogItem>([]);

  @action openDialog = async (type: DialogTypes, dialogData: any): Promise<any> => {
    return new Promise(resolve => {
      this.dialogs.push(new DialogItem(this, type, dialogData, resolve));
    });
  };

  @action openTransactionDialog = async (dialogData: TransactionDialogData): Promise<any> => {
    return new Promise(resolve => {
      const dialog = new TransactionDialogItem(this, dialogData, resolve);
      this.transactionDialogs.push(dialog);
    });
  };
}
