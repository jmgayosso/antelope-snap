import { writable } from 'svelte/store';

export const accountName = writable<string | null>(null);

export const accountPermission = writable<string | null>(null);

export const accountPublicKey = writable<string | null>(null);
