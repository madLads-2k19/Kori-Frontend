<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { authData } from '$lib/store/store';

	let name: string = '';
	let email: string = '';
	let password: string = '';
	let orgId: string = '';
	let triedLogin: boolean = false;
	let loginStatus: boolean = true;

	function register() {
		fetch(`https://kori-backend.azurewebsites.net/user/v1/${orgId}/signup`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
				name,
				email,
				password,
				permission_level: 'user'
			})
		})
			.then((response) => {
				triedLogin = true;
				if (!response.ok) {
					loginStatus = false;
					throw new Error('Signup Failed');
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
			<p class="text-center mb-2">Register to use Kori</p>
			<div class="mb-4">
				<p class="text-gray-500">Name</p>
				<TextInput bind:value={name} placeholder="Enter your name" />
			</div>
			<div class="mb-4">
				<p class="text-gray-500">Email</p>
				<TextInput bind:value={email} type="email" placeholder="Enter your email" />
			</div>
			<div class="mb-4">
				<p class="text-gray-500">Password</p>
				<TextInput bind:value={password} type="password" placeholder="Enter your password" />
			</div>
			<div class="mb-8">
				<p class="text-gray-500">Organisation ID</p>
				<TextInput bind:value={orgId} placeholder="Enter your Organisation ID" />
			</div>
			<div class="text-center mb-4">
				<Button buttonText="register" onClick={register} />
			</div>
			{#if triedLogin && !loginStatus}
				<p class="text-red-800 text-center mb-2">Registration failed!</p>
			{:else if triedLogin && loginStatus}
				<p class="text-green-800 text-center mb-2">Registration success!</p>
			{/if}
			<p class="text-center">
				Already a user? <a class="text-teal-900 font-semibold underline" href="login">Login</a>
			</p>
		</div>
	</div>
</div>
