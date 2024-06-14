import { Chains } from '@wharfkit/common';
import { Chain } from '../models';
import { StateManager } from './manageState';

const coinType = {
  EOS: 194,
  Jungle4: 194,
  WAX: 14001,
  Telos: 424,
};

export const supportedChains = {
  EOS: { id: Chains.EOS.id, url: Chains.EOS.url, coinType: coinType.EOS },
  Jungle4: {
    id: Chains.Jungle4.id,
    url: Chains.Jungle4.url,
    coinType: coinType.Jungle4,
  },
  WAX: { id: Chains.WAX.id, url: Chains.WAX.url, coinType: coinType.WAX },
  Telos: {
    id: Chains.Telos.id,
    url: Chains.Telos.url,
    coinType: coinType.Telos,
  },
};

export type SupportedChain = keyof typeof supportedChains;

export async function getCurrentChain() {
  const state = new StateManager();
  const savedChain = (await state.getValue('currentChain')) as string;
  return Chain.from(savedChain);
}
