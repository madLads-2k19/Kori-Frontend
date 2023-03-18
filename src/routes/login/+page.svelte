<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { authData } from '$lib/store/store';

	let email: string = '';
	let password: string = '';
	let triedLogin: boolean = false;
	let loginStatus: boolean = true;

	function login() {
		fetch('https://kori-backend.azurewebsites.net/user/v1/login', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
				email,
				password
			})
		})
			.then((response) => {
				triedLogin = true;
				if (!response.ok) {
					loginStatus = false;
					throw new Error('Login Failed');
				}
				loginStatus = true;
				return response.json();
			})
			.then((data) => {
				authData.set({ orgId: data['org_id'], userId: data['user_id'], token: data['token'] });
			})
			.catch((error) => {
				loginStatus = false;
				console.log(error);
			});
	}
</script>

<div class="h-screen flex bg-teal-800 ...">
	<div class="my-auto border border-slate-200 mx-auto bg-white rounded-md ...">
		<div class="p-8">
			<p class="text-5xl text-center mb-4 text-teal-900 ...">Kori</p>
			<p class="text-xl text-center mb-4 ...">Welcome</p>
			<p class="text-center mb-2">Login to use Kori</p>
			<div class="mb-4">
				<p class="text-gray-500">Email</p>
				<TextInput bind:value={email} type="email" placeholder="Enter your email" />
			</div>
			<div class="mb-8">
				<p class="text-gray-500">Password</p>
				<TextInput bind:value={password} type="password" placeholder="Enter your password" />
			</div>
			<div class="text-center mb-4">
				<Button buttonText="Login" onClick={login} />
			</div>
			{#if triedLogin && !loginStatus}
				<p class="text-red-800 text-center mb-2">Incorrect email or password!</p>
			{:else if triedLogin && loginStatus}
				<p class="text-green-800 text-center mb-2">Login success!</p>
			{/if}
			<p class="text-center">
				Not a user? <a class="text-teal-900 font-semibold underline" href="register">Register</a>
			</p>
		</div>
	</div>
</div>
