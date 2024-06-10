import { Chains } from '@wharfkit/common';
import { AccountGateway } from './api';
import { derivePublicKey } from './lib/keyDeriver';
import { confirmAccountImport, noAccountFound } from './ui';

export async function connectAccount() {
  const publicKey = await derivePublicKey();
  const url = Chains.Jungle4.url;
  const api = new AccountGateway(url);
  const { accounts } = await api.fetchAccounts(publicKey);

  if (accounts[0]) {
    const [ account ] = accounts;
    const accountName = account.account_name.toString();
    const confirmed = await confirmAccountImport(accountName);
    if (!confirmed) return null;
    return accountName;
  } else {
    await noAccountFound(publicKey.toString());
    return null;
  }
}
