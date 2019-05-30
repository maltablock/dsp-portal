// mimicks EOS C++ smart contract asset and symbol class
export type Symbol = {
    symbolCode: string;
    precision: number;
};

export type Asset = {
    amount: number;
    symbol: Symbol;
};

/**
 * Example:
 * { amount: 1230000, symbol: { symbolCode: 'DAPP', precision: 4 }} => '123.0000 DAPP'
 */
export function formatAsset({ amount, symbol }: Asset): string {
    const { precision, symbolCode } = symbol;
    let s = String(amount);
    while (s.length < precision + 1) {
        s = `0${s}`;
    }

    const pre = s.slice(0, -precision);
    const end = s.slice(-precision);

    return `${pre}.${end} ${symbolCode}`;
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
            `Invalid asset passed to decomposeAsset: ${JSON.stringify(assetString)}. ${
                error.message
            }`,
        );
    }
}
