import { APIClient, Name, PermissionLevel, PublicKey, UInt32, Weight } from '@wharfkit/antelope';

type AccountResponse = {
    account_name: Name;
    permission_name: Name;
    authorizing_key: PublicKey;
    authorizing_account: PermissionLevel;
    weight: Weight;
    threshold: UInt32;
}

type AccountsResponse = {
  accounts: AccountResponse[];
};

interface APIGateway {
  fetchAccounts(publicKey: PublicKey): Promise<AccountsResponse>;
}

export class AccountGateway implements APIGateway {
  client: APIClient
  chainUrl: string

  constructor(chainUrl: string) {
    this.client = new APIClient({url: chainUrl});
    this.chainUrl = chainUrl;
  }

  public async fetchAccounts(publicKey: PublicKey) {
    console.log('fetching accounts', publicKey.toString());
    return this.client.v1.chain.get_accounts_by_authorizers({keys: [publicKey.toString()]});
  }
}
