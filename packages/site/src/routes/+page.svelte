<script lang="ts">
	import { checkIsFlask, getSnapsProvider } from '$lib/metamask';
	import { onMount } from 'svelte';
	import { snapProvider, isFlask, isMetaMaskReady, snapsDetected, installedSnap } from '$store';
	import type { MetaMaskInpageProvider } from '@metamask/providers';
	import { setSnap, requestSnap, invokeSnap } from '$lib/snap';

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
</script>

<h1>Welcome to SvelteKit</h1>
<p>Snaps detected: {$snapsDetected}</p>
<p>Is flask: {$isFlask}</p>
<p>Is metamask ready: {$isMetaMaskReady}</p>
<p>Is snap installed: {isSnapInstalled}</p>

<button on:click={() => requestSnap()} disabled={!$isMetaMaskReady}> Install Snap </button>

<br />

<button on:click={() => invokeSnap({ method: 'eos_connectAccount' })} disabled={!$isMetaMaskReady}>
	Connect EOS Account
</button>
