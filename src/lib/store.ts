import { persisted } from 'svelte-local-storage-store';

export interface AuthData {
	org_id?: string;
	user_id?: string;
	permission_level?: string;
	token?: string;
}

export const authData = persisted('authData', <AuthData>{
	org_id: undefined,
	user_id: undefined,
	permission_level: undefined,
	token: undefined
});
