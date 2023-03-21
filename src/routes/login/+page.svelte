<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import type { AuthData } from '$lib/store';
	import { authData } from '$lib/store';
	import { HttpMethod, defaultHttpRequest } from '$lib/request';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { notifications } from '$lib/components/notification';

	let email: string = '';
	let password: string = '';
	let loginStatus: boolean | undefined = undefined;

	onMount(async () => {
		const userData = $authData;
		if (userData.token) {
			goto('/login');
		}
	});

	interface UserInput {
		email: string;
		password: string;
	}

	function validate(userDetails: UserInput) {
		console.log(userDetails);
		if (
			!userDetails.email.match(
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
		) {
			notifications.danger('Email is not valid');
			return false;
		}
		if (
			!userDetails.password ||
			(userDetails.password && userDetails.password.trim().length == 0)
		) {
			notifications.danger('Password cannot be empty');
			return false;
		}

		return true;
	}

	function login() {
		const payload = {
			email,
			password
		};

		if (!validate(payload)) return;

		defaultHttpRequest<AuthData>(
			HttpMethod.POST,
			`https://kori-backend.azurewebsites.net/user/v1/login`,
			payload
		)
			.then((data) => {
				loginStatus = true;
				authData.set(data);
				goto('/app/billing');
			})
			.catch((error) => {
				loginStatus = false;
				authData.set({});
				console.error(error);
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
			{#if loginStatus == false}
				<p class="text-red-800 text-center mb-2">Incorrect email or password!</p>
			{:else if loginStatus == true}
				<p class="text-green-800 text-center mb-2">Login success!</p>
			{/if}
			<p class="text-center">
				Not a user? <a class="text-teal-900 font-semibold underline" href="register">Register</a>
			</p>
		</div>
	</div>
</div>
