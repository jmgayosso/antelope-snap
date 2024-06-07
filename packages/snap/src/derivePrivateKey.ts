import {
  Bytes,
  KeyType as AntelopeKeyType,
  PrivateKey,
} from '@wharfkit/antelope';

import { getKeyDeriver } from './keyDeriver';

/**
 * Derive an Antelope private key from the key tree at the given address index.
 *
 * @param addressIndex - The index of the address to derive.
 * @returns The private key.
 * @throws If the key tree is not initialized.
 */
export async function derivePrivateKey(addressIndex = 1) {
  const keyDeriver = await getKeyDeriver();
  const { privateKeyBytes = undefined } = await keyDeriver(addressIndex);

  if (privateKeyBytes === undefined) {
    return null;
  }

  return new PrivateKey(AntelopeKeyType.K1, Bytes.from(privateKeyBytes));
}
