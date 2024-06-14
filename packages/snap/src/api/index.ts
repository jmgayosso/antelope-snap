import {
  APIClient as AntelopeAPIClient,
  Name,
  PermissionLevel,
  PublicKey,
  TransactionHeader,
  UInt32,
  Weight,
} from '@wharfkit/antelope';
import { Account } from '../models';

type NetworkAccount = {
  account_name: Name;
  permission_name: Name;
  authorizing_key: PublicKey;
  authorizing_account: PermissionLevel;
  weight: Weight;
  threshold: UInt32;
};

interface APIGateway {
  fetchAccounts(publicKey: PublicKey): Promise<Account[]>;
  fetchAccountByKey(publicKey: PublicKey): Promise<Account | null>;
  getTransactionHeader(secondsAhead?: number): Promise<TransactionHeader>;
}

export class ApiClient implements APIGateway {
  client: AntelopeAPIClient;

  constructor(url: string) {
    this.client = new AntelopeAPIClient({ url });
  }

  private accountDecoder(data: NetworkAccount): Account {
    return new Account(
      String(data.account_name),
      String(data.permission_name),
      String(data.authorizing_key),
    );
  }

  public async fetchAccounts(publicKey: PublicKey) {
    const { accounts } = await this.client.v1.chain.get_accounts_by_authorizers(
      { keys: [publicKey.toString()] },
    );
    return accounts.map(this.accountDecoder);
  }

  public async fetchAccountByKey(publicKey: PublicKey) {
    const { accounts } = await this.client.v1.chain.get_accounts_by_authorizers(
      { keys: [publicKey.toString()] },
    );
    if (!accounts[0]) return null;
    const [account] = accounts;
    return this.accountDecoder(account);
  }

  public async getTransactionHeader(secondsAhead = 90) {
    return this.client.v1.chain
      .get_info()
      .then((info) => info.getTransactionHeader(secondsAhead));
  }
}
