import DappPackage from "../packages/state/DappPackage";
import StakedPackage from "../packages/state/StakedPackage";

type Package = DappPackage | StakedPackage;

export const searchFn = <P extends Package>(packages: P[], searchText: string): P[] => {
  if (!searchText) return packages;
  return packages.filter(
    p => (
      p.data.service.toLowerCase().includes(searchText) ||
      p.data.provider.toLowerCase().includes(searchText) ||
      p.packageId.toLowerCase().includes(searchText)
    )
  );
}

export const filterFn = <P extends Package>(packages: P[], filterBy: string): P[] => {
  if (filterBy === 'all') return packages;
  return packages.filter(p => p.data.service === filterBy);
}

const MALTABLOCK = 'airdropsdac1';

export const sortFn = <P extends Package>(_packages: P[], sortBy: string): P[] => {
  /*
   * Array.sort() method doesn't return a new array and mobx assumes it didn't change.
   * So for making it work with mobx.computed we have to create a shallow copy of this array.
   * https://github.com/mobxjs/mobx/issues/883
   */

  const packages = _packages.slice();

  switch (sortBy) {
    case 'quota':
      return packages.sort((a, b) => a.quotaAsTransactionsPerSecond - b.quotaAsTransactionsPerSecond);
    case 'min_stake_quantity':
      return packages.sort((a, b) => a.minStakeNumber - b.minStakeNumber);
    case 'min_unstake_period':
      return packages.sort((a, b) => a.minUnstakePeriod - b.minUnstakePeriod);
    case 'provider':
      return packages.sort((a, b) => {
        const aVal = a.providerLowercased;
        const bVal = b.providerLowercased;
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      });
    case 'default':
      return packages.sort((a, b) => (
        // By default, MaltaBlock packages go first
        a.providerLowercased === MALTABLOCK && b.providerLowercased !== MALTABLOCK
        ? -1
        : a.providerLowercased.localeCompare(b.providerLowercased)
      ));
    default:
      return packages;
  }
}
