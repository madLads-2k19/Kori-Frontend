import { authData } from '$lib/store';
import { get } from 'svelte/store';

export const userData = get(authData);
