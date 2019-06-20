import { observable, action } from "mobx";

const THEME_MODE_LS_KEY = 'app__theme_mode';

class UiStore {
  @observable mode = localStorage.getItem(THEME_MODE_LS_KEY) || 'dark';

  @action toggleTheme = () => {
    this.mode = this.mode === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_MODE_LS_KEY, this.mode);
  }
}

export default UiStore;
