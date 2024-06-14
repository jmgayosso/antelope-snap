import { assert, type Json } from '@metamask/snaps-sdk';

export class StateManager {
  public async get() {
    const state = await snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    });
    return state;
  }

  public async getValue(key: string) {
    const state = await this.get();
    assert(state, 'State not found');
    assert(state[key], `Key ${key} not found in state`);
    return state[key];
  }

  public async set(obj: Record<string, Json>) {
    const state = await this.get();
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: 'update',
        newState: { ...state, ...obj },
      },
    });
  }

  public async clear() {
    await snap.request({
      method: 'snap_manageState',
      params: { operation: 'clear' },
    });
  }
}
