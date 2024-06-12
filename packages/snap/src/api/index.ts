import { APIClient, Name, PermissionLevel, PublicKey, SignedTransaction, TransactionHeader, UInt32, Weight } from '@wharfkit/antelope';
import { Account } from '../models';

type NetworkAccount = {
  account_name: Name;
  permission_name: Name;
  authorizing_key: PublicKey;
  authorizing_account: PermissionLevel;
  weight: Weight;
  threshold: UInt32;
}

interface APIGateway {
  fetchAccounts(publicKey: PublicKey): Promise<Account[]>;
  fetchAccountByKey(publicKey: PublicKey): Promise<Account | null>;
  getTransactionHeader(secondsAhead?: number): Promise<TransactionHeader>;
  pushTransaction(signedTransaction: SignedTransaction): Promise<string>;
}

export class Client implements APIGateway {
  client: APIClient
  chainUrl: string

  constructor(chainUrl: string) {
    this.client = new APIClient({url: chainUrl});
    this.chainUrl = chainUrl;
  }

  private dataToAccount(data: NetworkAccount): Account {
    return new Account(
      String(data.account_name),
      String(data.permission_name),
      String(data.authorizing_key)
    );
  }

  public async fetchAccounts(publicKey: PublicKey) {
    const { accounts } = await this.client.v1.chain.get_accounts_by_authorizers({keys: [publicKey.toString()]});
    return accounts.map(this.dataToAccount);
  }

  public async fetchAccountByKey(publicKey: PublicKey) {
    const { accounts } = await this.client.v1.chain.get_accounts_by_authorizers({keys: [publicKey.toString()]});
    if (!accounts[0]) return null;
    const [account] = accounts;
    return this.dataToAccount(account);
  }

  public async getTransactionHeader(secondsAhead = 90) {
    return this.client.v1.chain.get_info().then(info => info.getTransactionHeader(secondsAhead));
  }

  public async pushTransaction(signedTransaction: SignedTransaction) {
    const result = await this.client.v1.chain.push_transaction(signedTransaction);
    return String(result.processed);
  }

}
