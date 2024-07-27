<script lang="ts">
	import { getPublicKey } from '$lib/rpc-methods';
	import { onMount } from 'svelte';
	import { isLowerCase, isNineChars, isSupportedChars, isValidFirstChar } from '$lib/validations';

	let account = { name: '', publicKey: '' };
	let errors: string[] = [];
	let created = false;

	async function handleFormSubmit(event: Event) {
		const chainId = '73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d'; // Jungle4
		const chainUrl = 'https://jungle4.greymass.com';
		const formData = new FormData(event.target as HTMLFormElement);

		const accountName = formData.get('name') as string;
		const publicKey = formData.get('publicKey') as string;

		errors = []; // reset errors

		if (!isValidFirstChar(accountName)) {
			errors = [...errors, 'Account name must start with a-z'];
		}
		if (!isNineChars(accountName)) {
			errors = [...errors, 'Account name must be 9 characters'];
		}
		if (!isLowerCase(accountName)) {
			errors = [...errors, 'Account name must be lowercase'];
		}
		if (!isSupportedChars(accountName)) {
			errors = [...errors, 'Account name must contain only a-z and 1-5'];
		}

		if (errors.length > 0) return;

		const accountData = {
			accountName: accountName + '.gm',
			activeKey: publicKey,
			ownerKey: publicKey,
			network: chainId
		};

		try {
			const response = await fetch(`${chainUrl}/account/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(accountData)
			});

			if (response.status !== 201) {
				// Server error
				throw new Error(await response.text());
			}

			let result;

			try {
				// Parse response from text since successful response is empty
				const text = await response.text();
				result = text ? JSON.parse(text) : {};
			} catch (e) {
				throw new Error('Error parsing response');
			}

			if (result.message) {
				// Some issue creating account
				throw new Error(result.message);
			} else {
				// Account successfully created
				account.name = accountData.accountName;
				created = true;
			}
		} catch (e) {
			if (e instanceof Error) {
				errors = [...errors, e.message];
				console.error('Network Error:', e);
			}
		}
	}

	onMount(async () => {
		const publicKey = await getPublicKey();
		account.publicKey = publicKey;
	});
</script>

{#if !created}
	<h2>Create Jungle4 Account</h2>
	<form on:submit|preventDefault={handleFormSubmit}>
		<div id="name-field">
			<label for="name">Account Name:</label>
			<input
				type="text"
				id="name"
				name="name"
				maxlength="9"
				size="9"
				required
				autocorrect="off"
				autocapitalize="none"
				spellcheck="false"
				autocomplete="off"
			/>
		</div>
		<div id="publicKey-field">
			<label for="publicKey">PublicKey from Metamask:</label>
			<input
				readonly
				type="text"
				id="publicKey"
				name="publicKey"
				size={account.publicKey.length}
				bind:value={account.publicKey}
			/>
		</div>
		<button type="submit">Submit</button>
		{#if errors.length > 0}
			<ul>
				{#each errors as error}
					<li>{error}</li>
				{/each}
			</ul>
		{/if}
	</form>
{:else}
	<h2>Account {account.name} created</h2>
	<div>
		<label for="name">Account Name:</label>
		<input type="text" id="name" name="name" readonly bind:value={account.name} />
	</div>
	<div>
		<label for="publicKey">PublicKey:</label>
		<input
			readonly
			type="text"
			id="publicKey"
			name="publicKey"
			size={account.publicKey.length}
			bind:value={account.publicKey}
		/>
	</div>
{/if}

<style>
	#name-field {
		position: relative;
	}
	#name-field::after {
		content: '.gm';
		position: absolute;
		display: inline;
		bottom: 0;
	}
	ul {
		color: red;
	}
</style>
