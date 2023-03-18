import { persisted } from 'svelte-local-storage-store';

export const authData = persisted('authData', {
	orgId: null,
	userId: null,
	token: null
});
