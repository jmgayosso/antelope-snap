import { writable } from 'svelte/store';

export const accountName = writable<string | null>(null);
