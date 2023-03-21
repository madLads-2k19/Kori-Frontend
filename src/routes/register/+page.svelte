<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { authData } from '$lib/store';
	import type { AuthData } from '$lib/store';
	import { HttpMethod, defaultHttpRequest } from '$lib/request';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { notifications } from '$lib/components/notification';

	let name: string = '';
	let email: string = '';
	let password: string = '';
	let orgId: string = '';
	let loginStatus: boolean | undefined = undefined;

	interface UserInput {
		name: string;
		email: string;
		password: string;
		orgId: string;
	}

	function validate(userDetails: UserInput) {
		console.log(userDetails);
		if (!userDetails.name || (userDetails.name && userDetails.name.trim().length == 0)) {
			notifications.danger('Name cannot be empty');
			return false;
		}
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
		if (
			!userDetails.orgId.match(
				/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
			)
		) {
			notifications.danger('Organisation ID is not a valid UUID');
			return false;
		}

		return true;
	}

	onMount(async () => {
		const userData = $authData;
		if (userData.token) {
			goto('/login');
		}
	});

	function register() {
		const payload = {
			name,
			email,
			password,
			permission_level: 'user'
		};

		const validatePayload = {
			name,
			email,
			password,
			orgId
		};

		if (!validate(validatePayload)) return;

		defaultHttpRequest<AuthData>(
			HttpMethod.POST,
			`https://kori-backend.azurewebsites.net/user/v1/${orgId}/signup`,
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
				<Button buttonText="Register" onClick={register} />
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
