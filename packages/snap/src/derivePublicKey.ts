import { PublicKey } from '@wharfkit/antelope';

import { getKeyDeriver } from './keyDeriver';

/**
 * Derive an Antelope public key from the key tree at the given address index.
 *
 * @param addressIndex - The index of the address to derive.
 * @returns The public key.
 * @throws If the key tree is not initialized.
 */
export async function derivePublicKey(addressIndex = 0) {
  const keyDeriver = await getKeyDeriver();
  const { compressedPublicKeyBytes } = await keyDeriver(addressIndex);

  return PublicKey.from({
    type: 'K1',
    compressed: compressedPublicKeyBytes,
  });
}
