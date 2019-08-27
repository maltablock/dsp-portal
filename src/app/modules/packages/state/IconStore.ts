import axios from 'axios';
import { observable, action, ObservableMap } from "mobx";
import isURL from 'validator/lib/isURL';
import uniqBy from 'lodash/uniqBy';

import maltablockIcon from 'app/shared/icons/malta_block_icon.png';
import DappPackage from "./DappPackage";


const ICONS_CACHE_LS_KEY = 'provider_icons_data';

const DEFAULT_ICONS_BY_PROVIDER = {
  airdropsdac1: maltablockIcon,
  eosinfradsp1: 'https://www.eosinfra.io/static/logo-icon.png',
  eosiodetroit: 'https://pbs.twimg.com/profile_images/1003049388946673665/OzbWXSAp_400x400.jpg',
  eoshenzhenio: 'https://user-assets.sxlcdn.com/images/480719/FhqPX0NIbzcpA4be8naZ0nTvclDT.png?imageMogr2/strip/auto-orient/thumbnail/300x300%3E/quality/90!/format/png',
  boidcomdsp11: 'https://www.alohaeos.com/media/2019/03/09/x/x/y/boidcomproxy/KMEd-2.png',
  eosusadspdsp: 'https://static.wixstatic.com/media/177a7e_1c4749d75e904539a3b4b1656efac94d~mv2.png/v1/fill/w_60,h_60,al_c,q_80,usm_0.66_1.00_0.01/eosusa_256.webp',
};


class IconStore {
  @observable iconUrlByProvider: ObservableMap<string, string>;

  constructor() {
    const cacheJSON = localStorage.getItem(ICONS_CACHE_LS_KEY);
    const cachedIcons = cacheJSON ? JSON.parse(cacheJSON) : [];
    this.iconUrlByProvider = observable.map(cachedIcons);
  }

  @action async fetchIcons(dappPackages: DappPackage[]) {
    const packagesWithUniqProviders = uniqBy(dappPackages, p => p.data.provider);

    const results = await Promise.all(packagesWithUniqProviders.map(async dappPackage => {
      const { provider, package_json_uri } = dappPackage.data;
      const cachedIconUrl = this.iconUrlByProvider.get(provider);

      if (cachedIconUrl) return true;

      try {
        const res = await axios.get(package_json_uri, { timeout: 5000 });
        const iconUrl = res && res.data && res.data.logo && res.data.logo.logo_256;

        if (iconUrl && isURL(iconUrl)) {
          // avoid mixed content
          let httpsIconUrl = iconUrl.replace(`http://`, `https://`)
          this.iconUrlByProvider.set(provider, httpsIconUrl);
          return true;
        } else {
          throw new Error(`Icon URL is empty or invalid. URL: "${iconUrl}"`)
        }
      } catch (err) {
        console.warn(`Failed fetching icon for provider: "${provider}". Error:`, err);

        const defaultIconUrl = DEFAULT_ICONS_BY_PROVIDER[provider];

        if (defaultIconUrl) {
          this.iconUrlByProvider.set(provider, defaultIconUrl);
          return true;
        }
      }
    }));

    const isNewIconAddedToCache = results.filter(isNew => isNew).length;

    if (isNewIconAddedToCache) {
      const cachedIcons = Array
        .from(this.iconUrlByProvider.keys())
        .map(provider => [provider, this.iconUrlByProvider.get(provider)]);
      localStorage.setItem(ICONS_CACHE_LS_KEY, JSON.stringify(cachedIcons));
    }
  }
}

export default IconStore;
