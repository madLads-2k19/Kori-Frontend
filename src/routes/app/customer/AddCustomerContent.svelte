<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Select from '$lib/components/Select.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { HttpMethod, defaultHttpRequest } from '$lib/request';
	import type { Customer } from '../billing/models';
	import { authData, type AuthData } from '$lib/store';
	import { onMount } from 'svelte';
	import { notifications } from '$lib/components/notification';
	import { invalidate } from '$app/navigation';

	let memberCheck: boolean;
	let paymentOptions = [
		{
			name: 'cash',
			value: 'Cash'
		},
		{
			name: 'card',
			value: 'Card'
		}
	];

	let email: string;
	let is_member: boolean;
	let membership_points: number = 0;
	let address: string;
	let preferred_payment_method = paymentOptions[0].name;
	let name: string;
	let phone_number: string;

	let disableSubmit: boolean = false;
	let customerCreationSuccess: boolean = false;

	let retry: boolean = false;
	let userData: AuthData;

	onMount(async () => {
		userData = $authData;
	});

	// For typing
	interface Customer {
		email: string;
		is_member: boolean;
		membership_points: number;
		address: string;
		preferred_payment_method: string;
		name: string;
		phone_number: string;
	}

	function resetMemberShipPoints() {
		membership_points = 0;
	}

	function validate(customerDetails: Customer) {
		console.log(customerDetails);
		if (
			!customerDetails.name ||
			(customerDetails.name && customerDetails.name.trim().length == 0)
		) {
			notifications.danger('Customer name cannot be empty');
			return false;
		}
		if (customerDetails.membership_points < 0) {
			notifications.danger('Membership points must be a positive value');
			return false;
		}
		if (
			!customerDetails.phone_number.match(
				/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
			)
		) {
			notifications.danger('Customer phone number is not valid');
			return false;
		}
		if (
			!customerDetails.email.match(
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
		) {
			notifications.danger('Customer email is not valid');
			return false;
		}
		if (
			!customerDetails.address ||
			(customerDetails.address && customerDetails.address.trim().length == 0)
		) {
			notifications.danger('Customer address cannot be empty');
			return false;
		}
		return true;
	}

	async function addCustomer() {
		disableSubmit = true;

		const payload = {
			email,
			name,
			is_member,
			phone_number,
			address,
			preferred_payment_method,
			membership_points
		};

		if (!validate(payload)) {
			disableSubmit = false;
			return;
		}

		await defaultHttpRequest<Customer>(
			HttpMethod.POST,
			`https://kori-backend.azurewebsites.net/customer/v1/${userData.org_id}`,
			payload,
			undefined
		)
			.then((newCustomer) => {
				customerCreationSuccess = true;
				retry = false;
				disableSubmit = true;
			})
			.catch((error) => {
				retry = true;
				disableSubmit = false;
			});
	}
</script>

<div class="p-4">
	<p class="text-2xl mb-4 text-teal-800">New Customer</p>
	<div class="grid grid-cols-2 gap-x-12 gap-y-8 justify-between mb-8">
		<TextInput bind:value={name} label="Name" placeholder="Enter Customer Name" />
		<TextInput bind:value={email} label="Email" placeholder="Enter Email ID" />
		<div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div on:click={resetMemberShipPoints} class="mt-7">
				<Checkbox bind:checked={memberCheck} label="Register as a member" />
			</div>
		</div>
		<TextInput
			bind:value={membership_points}
			disabled={!memberCheck}
			label="Membership points"
			placeholder="Enter Membership points"
		/>
		<Select
			options={paymentOptions}
			bind:selectedOption={preferred_payment_method}
			label="Preferred Payment Method"
		/>
		<TextInput bind:value={phone_number} label="Phone Number" placeholder="Enter Phone Number" />
	</div>
	<div class="mb-4">
		<TextArea label="Address" bind:value={address} placeholder="Enter Address" />
	</div>

	{#if !disableSubmit}
		<div class="w-24 text-center">
			<Button onClick={addCustomer} buttonText="Create" />
		</div>
	{/if}
	{#if disableSubmit}
		{#if customerCreationSuccess}
			<p class="text-green-900">Customer Creation Success, close the popup to continue...</p>
		{/if}
	{/if}
	{#if retry}
		<p class="text-red-800">Customer Creation Failed, retry again</p>
	{/if}
</div>
