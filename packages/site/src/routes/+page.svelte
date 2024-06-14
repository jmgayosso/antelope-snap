<script lang="ts">
	import { checkIsFlask, getSnapsProvider } from '$lib/metamask';
	import { onMount } from 'svelte';
	import { snapProvider, isFlask, isMetaMaskReady, snapsDetected, installedSnap } from '$store';
	import type { MetaMaskInpageProvider } from '@metamask/providers';
	import { setSnap, requestSnap, invokeSnap } from '$lib/snap';
	import flask_fox from '../assets/flask_fox.svg';
	import { accountName } from '$lib/account';
	import CreateAccount from '../components/CreateAccount.svelte';
	import { connectAccount, getConnectedAccount, testTransaction } from '$lib/rpc-methods';
	// import type {RpcMethodTypes} from '@greymass/eos-snap';

	let provider: MetaMaskInpageProvider;

	$: isSnapInstalled = $installedSnap !== null;

	onMount(async () => {
		snapProvider.set(await getSnapsProvider());

		if ($snapProvider !== null) {
			provider = $snapProvider; // gotta be a better way of narrowing this type
			isFlask.set(await checkIsFlask(provider));
			setSnap();
			getConnectedAccount();
		}
	});
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
<!-- <p>Installed snap: {JSON.stringify($installedSnap)}</p> -->

<button on:click={() => requestSnap()} disabled={!$isMetaMaskReady}>
	<img src={flask_fox} alt="Flask Fox" width="20" height="20" />
	{isSnapInstalled ? 'Re-install snap' : 'Install snap'}
</button>

<p>The snap will need to be re-installed after any changes to the code.</p>

<button on:click={connectAccount} disabled={!$isMetaMaskReady}> Connect EOS Account </button>

<p>We disable the connection button when an account is already connected.</p>

<button on:click={testTransaction} disabled={!$isMetaMaskReady}>Test Signing Transaction</button>
<hr />

<CreateAccount />
