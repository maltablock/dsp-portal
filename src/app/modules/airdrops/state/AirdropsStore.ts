import { observable, action } from "mobx";

const THEME_MODE_LS_KEY = 'app__theme_mode';

export type MainNavigation = 'DSP Services' | 'vAirdrops'

class AirdropsStore {
  @observable mode = localStorage.getItem(THEME_MODE_LS_KEY) || 'dark';
  @observable mainNavigation: MainNavigation = 'DSP Services';

  @action toggleTheme = () => {
    this.mode = this.mode === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_MODE_LS_KEY, this.mode);
  }

  @action changeMainNavigation(navigation: MainNavigation) {
    this.mainNavigation = navigation
  }
}

export default AirdropsStore;
