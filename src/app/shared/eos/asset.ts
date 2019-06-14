import { Asset, AssetSymbol } from "app/shared/typings";
import BigNumber from "bignumber.js";

type FormatOptions = {
  withSymbol?: boolean;
  separateThousands?: boolean;
};


export type FormattableAsset = {
  amount: number | BigNumber;
  symbol: AssetSymbol;
};
/**
 * Example:
 * { amount: 1230000, symbol: { symbolCode: 'DAPP', precision: 4 }} => '123.0000 DAPP'
 */
export function formatAsset({ amount, symbol }: FormattableAsset, formatOptions?: FormatOptions): string {
  const options: FormatOptions = Object.assign(
    {
      withSymbol: true,
      separateThousands: false,
    },
    formatOptions || {},
  );
  const { precision, symbolCode } = symbol;
  let s = String(amount).split(`.`)[0];
  while (s.length < precision + 1) {
    s = `0${s}`;
  }

  let pre = s.slice(0, -precision);
  const decimals = s.slice(-precision);

  if (options.separateThousands) {
    // adds `,` thousand separators
    // https://stackoverflow.com/a/2901298/9843487
    pre = pre.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  let result = `${pre}.${decimals}`;
  if (options.withSymbol) result = `${result} ${symbolCode}`;
  return result;
}

/**
 * Example
 * '123.0000 DAPP' => { amount: 1230000, symbol: { symbolCode: 'DAPP', precision: 4 }}
 */
export function decomposeAsset(assetString: string): Asset {
  try {
    const [amountWithPrecision, symbolName] = assetString.split(` `);
    if (!amountWithPrecision || !symbolName) {
      throw new Error(`Invalid split`);
    }
    const amountNoPrecision = Number.parseInt(amountWithPrecision.replace(`.`, ``), 10);

    const dotIndex = amountWithPrecision.indexOf(`.`);
    if (dotIndex === -1) {
      throw new Error(`No dot found`);
    }
    const precision = amountWithPrecision.length - dotIndex - 1;

    return {
      amount: amountNoPrecision,
      symbol: {
        precision,
        symbolCode: symbolName,
      },
    };
  } catch (error) {
    throw new Error(
      `Invalid asset passed to decomposeAsset: ${JSON.stringify(assetString)}. ${error.message}`,
    );
  }
}
