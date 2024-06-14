import { accountName } from './account';
import { invokeSnap } from './snap';

export async function connectAccount() {
	const result = await invokeSnap({ method: 'eos_connectAccount' });
	console.log('accountName', result);
	accountName.set(result);
}

export async function getConnectedAccount() {
	const account = await invokeSnap({ method: 'eos_getConnectedAccount' });
	console.log('account', account);
	accountName.set(account);
	// accountPublicKey.set(account.publicKey);
	// accountPermission.set(account.permission);
}

export async function testTransaction() {
	const result = await invokeSnap({ method: 'eos_signTransaction' });
	console.log('result', result);
}
