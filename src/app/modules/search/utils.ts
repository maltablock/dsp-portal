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

export const sortFn = <P extends Package>(packages: P[], sortBy: string): P[] => {
  switch (sortBy) {
    case 'quota':
      return packages.sort((a, b) => a.quotaNumber - b.quotaNumber);
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
    default:
      return packages;
  }
}
