import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import * as Antelope from '@wharfkit/antelope';
import type { Chain } from 'src/models';

/**
 * Get the key deriver for the given coin type.
 *
 * @param coinType - The SLIP-0044 registered coin type for BIP-0044.
 * @returns The key deriver.
 */
async function getKeyDeriver(coinType = 194) {
  const networkNode = await snap.request({
    method: 'snap_getBip44Entropy',
    params: { coinType },
  });

  return getBIP44AddressKeyDeriver(networkNode);
}

/**
 * Derive an Antelope public key from the key tree at the given address index.
 *
 * @param chain - The chain to derive the key for.
 * @param addressIndex - The index of the address to derive.
 * @returns The public key.
 * @throws If the key tree is not initialized.
 */
export async function derivePublicKey(chain: Chain, addressIndex = 0) {
  const privateKey = await derivePrivateKey(chain, addressIndex);
  return privateKey.toPublic();
}

/**
 * Derive an Antelope private key from the key tree at the given address index.
 *
 * @param chain - The chain to derive the key for.
 * @param addressIndex - The index of the address to derive.
 * @returns The private key.
 * @throws If the key tree is not initialized.
 */
export async function derivePrivateKey(chain: Chain, addressIndex = 0) {
  const { coinType } = chain;
  const keyDeriver = await getKeyDeriver(coinType);
  const derived = await keyDeriver(addressIndex);

  if (!derived.privateKeyBytes) {
    throw new Error('Private key not found');
  }

  return new Antelope.PrivateKey(
    Antelope.KeyType.K1,
    Antelope.Bytes.from(derived.privateKeyBytes),
  );
}
