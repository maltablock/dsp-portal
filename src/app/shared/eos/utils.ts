import { rpc } from './networks';

const MAX_PAGINATION_FETCHES = 5;

// https://github.com/EOSIO/eosjs-api/blob/master/docs/api.md#eos.getTableRows
type GetTableRowsOptions = {
  json?: boolean;
  code?: string;
  scope?: string;
  table?: string;
  lower_bound?: number;
  upper_bound?: number;
  limit?: number;
  key_type?: string;
  index_position?: string;
};

// work around the limit bug in nodes due to max timeout
// https://github.com/EOSIO/eos/issues/3965
export async function fetchAllRows(options: GetTableRowsOptions, indexName = `id`) {
  const mergedOptions = {
    json: true,
    lower_bound: 0,
    upper_bound: -1,
    limit: 9999,
    ...options,
  };

  let rows = [];
  let lowerBound = mergedOptions.lower_bound;

  for (let i = 0; i < MAX_PAGINATION_FETCHES; i++) {
    const result = await rpc.get_table_rows({
      ...mergedOptions,
      lower_bound: lowerBound,
    });
    rows = rows.concat(result.rows);

    if (!result.more || result.rows.length === 0) break;

    lowerBound = result.rows[result.rows.length - 1][indexName] + 1;
  }

  return rows;
}
