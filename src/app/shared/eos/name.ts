// Originally from https://raw.githubusercontent.com/EOSIO/eosjs/v16.0.9/src/format.js
// eosjs2 does not have this function
import Long from 'long';

function isName(str: string) {
  try {
    encodeName(str);
    return true;
  } catch (error) {
    return false;
  }
}

const charmap = '.12345abcdefghijklmnopqrstuvwxyz';
const charidx = ch => {
  const idx = charmap.indexOf(ch);
  if (idx === -1) throw new TypeError(`Invalid character: '${ch}'`);

  return idx;
};

function nameToValue(name: string) {
  if (typeof name !== 'string') throw new TypeError('name parameter is a required string');

  if (name.length > 12) throw new TypeError('A name can be up to 12 characters long');

  let bitstr = '';
  for (let i = 0; i <= 12; i++) {
    // process all 64 bits (even if name is short)
    const c = i < name.length ? charidx(name[i]) : 0;
    const bitlen = i < 12 ? 5 : 4;
    let bits = Number(c).toString(2);
    if (bits.length > bitlen) {
      throw new TypeError('Invalid name ' + name);
    }
    bits = '0'.repeat(bitlen - bits.length) + bits;
    bitstr += bits;
  }

  return Long.fromString(bitstr, true, 2);
}

function bytesToHex(bytes) {
  let leHex = '';
  for (const b of bytes) {
    const n = Number(b).toString(16);
    leHex += (n.length === 1 ? '0' : '') + n;
  }
  return leHex;
}

/** Original Name encode and decode logic is in github.com/eosio/eos  native.hpp */

/**
  Encode a name (a base32 string) to a number.
  For performance reasons, the blockchain uses the numerical encoding of strings
  for very common types like account names.
  @see types.hpp string_to_name
  @arg {string} name - A string to encode, up to 12 characters long.
  @arg {string} [littleEndian = true] - Little or Bigendian encoding
  @return {string<uint64>} - compressed string (from name arg).  A string is
    always used because a number could exceed JavaScript's 52 bit limit.
*/
function encodeNameToUint64(name: string, littleEndian = true) {
  const value = nameToValue(name);

  // convert to LITTLE_ENDIAN
  const bytes = littleEndian ? value.toBytesLE() : value.toBytesBE();
  let leHex = bytesToHex(bytes);

  const ulName = Long.fromString(leHex, true, 16);
  return ulName;
}

function encodeName(name: string, littleEndian = true): string {
  return encodeNameToUint64(name, littleEndian).toString();
}

function getTableBoundsForNameAsValue(name: string) {
  const nameValue = nameToValue(name);
  const nameValueP1 = nameValue.add(1);

  return {
    lower_bound: nameValue.toString(),
    upper_bound: nameValueP1.toString()
  };
}

function getTableBoundsForName(name: string) {
  const nameValue = nameToValue(name);
  const nameValueP1 = nameValue.add(1);

  const lowerBound = bytesToHex(nameValue.toBytesLE());
  const upperBound = bytesToHex(nameValueP1.toBytesLE());
  return {
    lower_bound: lowerBound as string,
    upper_bound: upperBound as string,
  };
}

export {
  isName,
  encodeName, // encode human readable name to uint64 (number string)
  getTableBoundsForName,
  getTableBoundsForNameAsValue,
};
