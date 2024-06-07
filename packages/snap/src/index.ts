import {
  OnHomePageHandler,
  OnRpcRequestHandler,
  OnUserInputHandler,
  UserInputEventType,
} from '@metamask/snaps-sdk';
import {
  spinner,
  button,
  panel,
  text,
  heading,
  copyable,
} from '@metamask/snaps-sdk';
import { PublicKey } from '@wharfkit/antelope';

import { derivePublicKey } from './derivePublicKey';

const mockAccount = {
  accountName: 'abcdefghi.gm',
  publicKey:
    'EOS6X9g8X6Vt8k3h5Z7v1t1X2Y3Z4X5Y6Z7X8Y9Z0X1Y2Z3X4Y5Z6X7Y8Z9X0Y1Z2',
};

type InterfaceID = string;

async function lookupAccountByKey(publicKey: PublicKey, id: InterfaceID) {
  // delay to simulate network request
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // random false or true to simulate account found or not
  const account = Math.random() < 0.5 ? null : mockAccount;

  if (account) {
    return await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: panel([
          heading(`Account found: ${account.accountName}`),
          text('Import this account'),
          button({ value: 'Import Account', name: 'import-account' }),
        ]),
      },
    });
  }

  return await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: panel([
        heading('No EOS account found'),
        text(
          'Please create an account using the following public key then try connecting again',
        ),
        copyable(String(publicKey)),
      ]),
    },
  });
}

async function connectAccount() {
  const publicKey = await derivePublicKey();

  const id = await snap.request({
    method: 'snap_createInterface',
    params: {
      ui: panel([
        heading('Checking'),
        text('Please wait while we check for your account'),
        spinner(),
      ]),
    },
  });

  lookupAccountByKey(publicKey, id)
    .then((result) => {
      return result;
    })
    .catch(console.error);

  return await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      id,
    },
  });
}

// async function importAccount({ id }: { id: InterfaceID }) {
//   const privateKey = await derivePrivateKey();
//
//   if (!privateKey) {
//     return await snap.request({
//       method: 'snap_dialog',
//       params: {
//         type: 'alert',
//         id,
//         title: 'Error',
//         message: 'Private key could not be derived',
//       },
//     });
//   }
//
//   return await snap.request({
//     method: 'snap_dialog',
//     params: {
//       type: 'alert',
//       id,
//       title: 'Success',
//       message: 'Account imported successfully',
//     },
//   });
// }

// async function newSession() {
//   const args = {
//     chain: {
//       id: chainID,
//       url: chainURL,
//     },
//     actor: 'abcdefghi.gm',
//     permission: 'active',
//     walletPlugin: new WalletPluginPrivateKey(
//       'PVT_K1_FZ9WQLBW8MxpesPhaSfYk6Jazo8VHXRHzqNRpvvbGfuamfBha',
//     ),
//   };
//
//   const opts = {};
//
//   const session = new Session(args, opts);
//   console.log(session.actor.toString());
//   return true;
// }

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
  origin,
  request,
}) => {
  switch (request.method) {
    case 'eos_connectAccount':
      await connectAccount();
      return;

    default:
      throw new Error('Method not found.');
  }
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  if (event.type === UserInputEventType.ButtonClickEvent) {
    switch (event.name) {
      case 'import-account':
        // await importAccount({ id });
        break;

      default:
        break;
    }
  }
};

export const onHomePage: OnHomePageHandler = async () => {
  return {
    content: panel([
      heading('Hello world!'),
      text('Welcome to my Snap home page!'),
      button({ value: 'Create Account', name: 'interactive-button' }),
    ]),
  };
};

// const data = {
//   accountName,
//   activeKey: publicKeyString,
//   ownerKey: publicKeyString,
//   network: chainID,
// };
//
// console.log(data);

// try {
//   const response = await fetch(`${chainURL}/account/create`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
//
//   if (response.status === 201) {
//     return accountName;
//   }
//
//   console.log('failure:', JSON.stringify(await response.text(), null, 2));
// } catch (error) {
//   console.error('error getting response', error);
// };
