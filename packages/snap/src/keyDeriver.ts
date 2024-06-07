import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';

/**
 * Get the key deriver for EOS.
 *
 * @returns The key deriver.
 */
export async function getKeyDeriver() {
  const eosNode = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 194,
    },
  });

  return getBIP44AddressKeyDeriver(eosNode);
}
