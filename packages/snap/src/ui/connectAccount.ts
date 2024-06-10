import {
  panel,
  text,
  heading,
  copyable,
} from '@metamask/snaps-sdk';

export async function confirmAccountImport(accountName: string) {
    return await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'confirmation',
        content: panel([
          heading(`Account found: ${accountName}`),
          text('Import this account'),
        ]),
      },
    });
}

export async function noAccountFound(publicKey: string) {
    await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: panel([
          heading('No EOS account found'),
          text(
            'Please create an account using the following public key then try connecting again',
          ),
          copyable(String(publicKey)),
        ]),
      },
    });
}

