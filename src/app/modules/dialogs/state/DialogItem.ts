import { observable } from "mobx";
import DialogStore from "./DialogStore";
import { DialogTypes } from "../constants";

class DialogItem {
  dialogStore: DialogStore
  type: DialogTypes
  @observable data: any;
  resolvePromise: (...any) => any;

  constructor(
    dialogStore: DialogStore,
    dialogType: DialogTypes,
    dialogData: any,
    resolvePromise: (...any) => any,
  ) {
    this.dialogStore = dialogStore;
    this.type = dialogType;
    this.data = dialogData;
    this.resolvePromise = resolvePromise;
  }

  cancel = () => {
    this.resolvePromise({ canceled: true });
    this.dialogStore.dialogs.remove(this);
  }

  submit = (data) => {
    this.resolvePromise({ canceled: false, data });
    this.dialogStore.dialogs.remove(this);
  }
}

export default DialogItem;
