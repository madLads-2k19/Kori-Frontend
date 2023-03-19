<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { authData } from '$lib/store';
	import type { AuthData } from '$lib/store';
	import { HttpMethod, defaultHttpRequest } from '$lib/request';

	let name: string = '';
	let email: string = '';
	let password: string = '';
	let orgId: string = '';
	let loginStatus: boolean | undefined = undefined;

	function register() {
		const payload = {
			name,
			email,
			password,
			permission_level: 'user'
		};
		defaultHttpRequest<AuthData>(
			HttpMethod.POST,
			`https://kori-backend.azurewebsites.net/user/v1/${orgId}/signup`,
			payload,
			undefined
		)
			.then((data) => {
				loginStatus = true;
				authData.set(data);
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
			{#if loginStatus == false}
				<p class="text-red-800 text-center mb-2">Registration failed!</p>
			{:else if loginStatus == true}
				<p class="text-green-800 text-center mb-2">Registration success!</p>
			{/if}
			<p class="text-center">
				Already a user? <a class="text-teal-900 font-semibold underline" href="login">Login</a>
			</p>
		</div>
	</div>
</div>
