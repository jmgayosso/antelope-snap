import { assert } from '@metamask/snaps-sdk';
import { Chains } from '@wharfkit/common';
import { Session, SignedTransaction } from '@wharfkit/session';
import { WalletPluginPrivateKey } from '@wharfkit/wallet-plugin-privatekey';
import { Client } from './api';
import { derivePrivateKey, derivePublicKey } from './lib/keyDeriver';
import { makeMockTransaction } from './lib/mockTransfer';
import { userConfirmedAccount, alertNoAccountFound, userConfirmedTransaction } from './ui';

// There's something that can be done here with the chain and chain ID
// For example, we might want to use the chain ID to determine the chain URL
// and we need to associate that to the coin type for the derivation path

export async function connectAccount() {
  const publicKey = await derivePublicKey();
  const chain = {
    id: Chains.Jungle4.id,
    url: Chains.Jungle4.url,
  }
  const api = new Client(chain.url);
  const account = await api.fetchAccountByKey(publicKey);

  if (account) {
    const confirmed = await userConfirmedAccount(account.name);
    if (!confirmed) return null;
    return account.name;
  } else {
    await alertNoAccountFound(publicKey.toString());
    return null;
  }
}



export async function signTransaction() { // TODO: will need params
  const publicKey = await derivePublicKey();
  const chain = {
    id: Chains.Jungle4.id,
    url: Chains.Jungle4.url,
  }
  const api = new Client(chain.url);
  const account = await api.fetchAccountByKey(publicKey);
  assert(account, 'Account not found')
  const header = await api.getTransactionHeader();

  // Will be replaced with actual transaction data from params
  const memo = 'test'
  const transferObject = {
    from: account.name.toString(),
    to: 'teamgreymass',
    quantity: '0.1337 EOS',
    memo: memo || 'wharfkit is the best <3',
  }

  const transaction = makeMockTransaction(account, header, transferObject) // TODO: will need params

  const confirmed = await userConfirmedTransaction(transferObject)

  if (confirmed) {
    const privateKey = await derivePrivateKey();
    assert(privateKey, 'Private key not found')
    // const signature = privateKey.signDigest(transaction.signingDigest(chain.id))
    // const signedTransaction = SignedTransaction.from({
    //   ...transaction,
    //   signatures: [signature],
    // })
    // const result = await api.pushTransaction(signedTransaction)
    const sessionArgs = {
      chain,
      actor: account.name,
      permission: account.permission,
      walletPlugin: new WalletPluginPrivateKey(privateKey)
    }
    const session = new Session(sessionArgs)
    const result = await session.transact(transaction)
    console.log(JSON.stringify(result))
    return String(result)

  }

  return null

}
