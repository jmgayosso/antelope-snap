<script lang="ts">
	import { checkIsFlask, getSnapsProvider } from '$lib/metamask';
	import { onMount } from 'svelte';
	import { snapProvider, isFlask, isMetaMaskReady, snapsDetected, installedSnap } from '$store';
	import type { MetaMaskInpageProvider } from '@metamask/providers';
	import { setSnap, requestSnap, invokeSnap } from '$lib/snap';
	import flask_fox from '../assets/flask_fox.svg';
	import { accountName } from '$lib/account';

	let provider: MetaMaskInpageProvider;

	$: isSnapInstalled = $installedSnap !== null;

	onMount(async () => {
		snapProvider.set(await getSnapsProvider());

		if ($snapProvider !== null) {
			provider = $snapProvider; // gotta be a better way of narrowing this type
			isFlask.set(await checkIsFlask(provider));
			setSnap();
		}
	});

	async function connectAccount() {
		const result = await invokeSnap({ method: 'eos_connectAccount' });
		console.log('accountName', result);
		accountName.set(result);
	}

	let account = { name: '', publicKey: '' };

	type AccountData = {
		accountName: string;
		activeKey: string;
		ownerKey: string;
		chainID: string;
	};

	async function handleFormSubmit(event: Event) {
		const formData = new FormData(event.target as HTMLFormElement);

		const accountData: AccountData = {
			accountName: formData.get('account') as string,
			activeKey: formData.get('publicKey') as string,
			ownerKey: formData.get('publicKey') as string,
			chainID: '73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d'
		};

		const name = await createAccount(accountData, 'https://jungle4.greymass.com');

		if (typeof name !== 'undefined') {
			console.log(`Account ${name} created`);
			connectAccount();
		}
	}

	async function createAccount(accountData: AccountData, chainUrl: string) {
		const data = {
			accountName: accountData.accountName,
			activeKey: accountData.activeKey,
			ownerKey: accountData.ownerKey,
			network: accountData.chainID
		};

		try {
			const response = await fetch(`${chainUrl}/account/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			console.log(response);

			if (response.status === 201) {
				console.log('success:', JSON.stringify(await response.text(), null, 2));
				return accountData.accountName;
			}

			console.log('failure:', JSON.stringify(await response.text(), null, 2));
		} catch (error) {
			console.error('error getting response', error);
		}
	}
</script>

<h1>
	Welcome to SvelteKit
	{#if $accountName}
		{$accountName}
	{/if}
</h1>
<p>Snaps detected: {$snapsDetected}</p>
<p>Is flask: {$isFlask}</p>
<p>Is metamask ready: {$isMetaMaskReady}</p>
<p>Is snap installed: {isSnapInstalled}</p>

<button on:click={() => requestSnap()} disabled={!$isMetaMaskReady}>
	<img src={flask_fox} alt="Flask Fox" width="20" height="20" />
	Install Snap
</button>
<p>The snap will need to be re-installed after any changes to the code.</p>

<button on:click={connectAccount} disabled={!$isMetaMaskReady}> Connect EOS Account </button>

<h2>Create Jungle4 Account</h2>
<form on:submit|preventDefault={handleFormSubmit}>
	<div>
		<label for="account">Name:</label>
		<input type="text" id="account" name="account" bind:value={account.name} />
	</div>
	<div>
		<label for="account">PublicKey:</label>
		<input type="text" id="account" name="publicKey" bind:value={account.publicKey} />
	</div>
	<button type="submit">Submit</button>
</form>
