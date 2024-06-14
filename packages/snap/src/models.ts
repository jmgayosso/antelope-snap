import { Checksum256 } from '@wharfkit/antelope';

export class Account {
  constructor(
    public name: string,
    public permission: string,
    public publicKey: string,
  ) {}
}

export class Chain {
  id: Checksum256;
  url: string;
  coinType: number;

  constructor({
    id,
    url,
    coinType,
  }: {
    id: string;
    url: string;
    coinType: string;
  }) {
    this.id = Checksum256.from(id);
    this.url = url;
    this.coinType = parseInt(coinType, 10);
  }

  static from(json: string): Chain {
    console.log(json);
    const parsed = JSON.parse(json);
    console.log(parsed);
    return new Chain({
      id: parsed.id,
      url: parsed.url,
      coinType: parsed.coinType,
    });
  }
}
