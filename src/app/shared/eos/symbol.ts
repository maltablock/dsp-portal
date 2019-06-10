import { AssetSymbol } from '../typings';

function toHexString(byteArray: number[]) {
  return Array.from(byteArray, byte => ('0' + (byte & 0xff).toString(16)).slice(-2)).join('');
}

const encodeSymbol = (symbol: AssetSymbol, littleEndian = true, padToBytes = 8) => {
  const textEncoder = new TextEncoder();
  let a = [symbol.precision & 0xff];
  a.push(...Array.from(textEncoder.encode(symbol.symbolCode)));
  while (a.length < padToBytes) {
    a.push(0);
  }

  if (littleEndian) a = a.reverse();

  return toHexString(a);
};

export {
  encodeSymbol
}