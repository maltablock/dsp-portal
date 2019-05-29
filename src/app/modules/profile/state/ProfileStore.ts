import { observable, action } from "mobx";
import { wallet } from 'app/shared/eos';

class ProfileStore {
  @observable accountInfo;

  @action handleLogin = async () => {
    try {
      await wallet.connect();
      // last Scatter login is saved, need to remove to be able to login again
      if(wallet.accountInfo) {
        await wallet.logout();
      }
      const accountInfo = await wallet.login();
      this.accountInfo = accountInfo;
    } catch (error) {
      console.error(error.message)
    }
  }
}

export default ProfileStore;
