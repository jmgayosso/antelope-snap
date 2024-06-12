import {
  panel,
  text,
  heading,
  row,
  assert,
} from '@metamask/snaps-sdk';
import { Transaction } from '@wharfkit/antelope';

export async function userConfirmedTransaction(details: Record<string, string>) {

  const detailsRows = Object.entries(details).map(([key, value]) => row(key, text(value)));

  return await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading(`Transaction`),
        text('Confirm transaction details:'),
        panel([
          ...detailsRows,
        ])
      ]),
    },
  });
}

