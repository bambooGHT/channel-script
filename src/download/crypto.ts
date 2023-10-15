import type { lib } from "crypto-js";

export const decrypt = (m3u8Data: ArrayBuffer, key: ArrayBuffer) => {
  const { lib, mode, pad, AES } = CryptoJS;
  const encryptedData = new Uint8Array(m3u8Data);
  const ciphertext = lib.WordArray.create(encryptedData as any);
  const Key = lib.WordArray.create(key as any);
  const ops = {
    iv: lib.WordArray.create(16 as any),
    mode: mode.CBC,
    padding: pad.Pkcs7
  };
  const decrypted = AES.decrypt({ ciphertext } as any, Key, ops);

  return wordArrayToUint8Array(decrypted);
};

function wordArrayToUint8Array(wordArray: lib.WordArray) {
  const len = wordArray.sigBytes;
  const words = wordArray.words;
  const uint8Array = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    uint8Array[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }

  return uint8Array;
}