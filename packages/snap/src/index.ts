import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import {
  OnHomePageHandler,
  OnRpcRequestHandler,
  OnUserInputHandler,
  UserInputEventType,
} from '@metamask/snaps-sdk';
import { button, panel, text, heading } from '@metamask/snaps-sdk';
import { Bytes, KeyType, PrivateKey, PublicKey } from '@wharfkit/antelope';
import { Session } from '@wharfkit/session';
import { WalletPluginPrivateKey } from '@wharfkit/wallet-plugin-privatekey';

import { chainID, chainURL } from './constants';

async function derivePublicKey() {
  const eosNode = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 194,
    },
  });

  const deriveEosAddress = await getBIP44AddressKeyDeriver(eosNode);
  const secondAccount = await deriveEosAddress(1); // why second account?

  const publicKey = PublicKey.from({
    type: 'K1',
    compressed: secondAccount.compressedPublicKeyBytes,
  });

  return publicKey;
}

async function derivePrivateKey() {
  const eosNode = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 194,
    },
  });

  const deriveEosAddress = await getBIP44AddressKeyDeriver(eosNode);
  const secondAccount = await deriveEosAddress(1); // why second account?

  if (secondAccount.privateKeyBytes === undefined) {
    return null;
  }

  const bytes = Bytes.from(secondAccount.privateKeyBytes);
  const privateKey = new PrivateKey(KeyType.K1, bytes);
  const privateKeyString = String(privateKey);
  console.log(privateKeyString);
  // return privateKeyString;
  return true;
}

function generateRandomAccountName() {
  // Generate a random 12-character account name using the allowed characters for Antelope accounts
  const characters = 'abcdefghijklmnopqrstuvwxyz12345';
  let result = '';
  for (let i = 0; i < 9; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `${result}.gm`;
}

async function createAccount() {
  const publicKey = await derivePublicKey();
  const publicKeyString = String(publicKey);
  const accountName = generateRandomAccountName();

  const data = {
    accountName,
    activeKey: publicKeyString,
    ownerKey: publicKeyString,
    network: chainID,
  };

  // console.log(data);

  try {
    const response = await fetch(`${chainURL}/account/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 201) {
      return accountName;
    }

    console.log('failure:', JSON.stringify(await response.text(), null, 2));
  } catch (error) {
    console.error('error getting response', error);
  }
  return null;
}

async function newSession() {
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

  const session = new Session(args, opts);
  console.log(session.actor.toString());
  return true;
  return s;
}

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  _origin,
  request,
}) => {
  switch (request.method) {
    case 'test':
      return await createAccount();

    case 'import':
      return await newSession();

    case 'hello':
      return await interactiveInterface();
    default:
      throw new Error('Method not found.');
  }
};

export const onUserInput: OnUserInputHandler = async ({
  id,
  event,
  context,
}) => {
  if (event.type === UserInputEventType.ButtonClickEvent) {
    switch (event.name) {
      case 'interactive-button':
        await snap.request({
          method: 'snap_updateInterface',
          params: {
            id,
            ui: panel([
              heading('Interactive interface'),
              text('You clicked the button!'),
            ]),
          },
        });
        break;

      default:
        break;
    }
  }
};

async function interactiveInterface() {
  const interfaceId = await snap.request({
    method: 'snap_createInterface',
    params: {
      ui: panel([
        heading('Interactive interface'),
        button({
          value: 'Click me',
          name: 'interactive-button',
        }),
      ]),
    },
  });

  return await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      id: interfaceId,
    },
  });
}

export const onHomePage: OnHomePageHandler = async () => {
  return {
    content: panel([
      heading('Hello world!'),
      text('Welcome to my Snap home page!'),
      button({ value: 'Create Account', name: 'interactive-button' }),
    ]),
  };
};
