import { authData } from '$lib/store';
import { get } from 'svelte/store';

class LocalStore {
	get name() {
		return get(authData).name;
	}
	get email() {
		return get(authData).email;
	}
	get permission_level() {
		return get(authData).permission_level;
	}
	get default_store_id() {
		return get(authData).default_store_id;
	}
	get org_id() {
		return get(authData).org_id;
	}
	get user_id() {
		return get(authData).user_id;
	}
	get_token() {
		return get(authData).token;
	}
}

export const userData = new LocalStore();
