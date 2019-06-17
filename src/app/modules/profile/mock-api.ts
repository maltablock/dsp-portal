import { DiscoveryData } from "eos-transit/lib";

const sleep = time => new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, time);
})

export const fetchAccountsForKeyMock = async (idx: number): Promise<DiscoveryData> => {
  await sleep(1000);
  return {
    keyToAccountMap: [
      {
        index: idx,
        key: `key-id-${idx}`,
        accounts: new Array(10).fill(0).map((_, i) => ({
          account: `Account ${i} for ${idx}`,
          authorization: `Autorization ${i} for ${idx}`
        }))
      }
    ]
  };
}
