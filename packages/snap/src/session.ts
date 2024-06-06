import { Session } from '@wharfkit/session';
import { WalletPluginPrivateKey } from '@wharfkit/wallet-plugin-privatekey';

import { chainID, chainURL } from './constants';

const args = {
  chain: {
    id: chainID,
    url: chainURL,
  },
  actor: 'abcdefghi.gm',
  permission: 'active',
  walletPlugin: new WalletPluginPrivateKey(
    'PVT_K1_FZ9WQLBW8MxpesPhaSfYk6Jazo8VHXRHzqNRpvvbGfuamfBha',
  ),
};

const opts = {};

export const session = new Session(args, opts);
