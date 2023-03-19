import { persisted } from 'svelte-local-storage-store';

export interface AuthData {
	name?: string;
	email?: string;
	permission_level?: string;
	default_store_id?: string;
	org_id?: string;
	user_id?: string;
	token?: string;
}

export const authData = persisted('authData', <AuthData>{
	name: undefined,
	email: undefined,
	permission_level: undefined,
	default_store_id: undefined,
	org_id: undefined,
	user_id: undefined,
	token: undefined
});
