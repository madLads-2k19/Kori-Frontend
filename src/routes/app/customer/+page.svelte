<script lang="ts">
	import { onMount } from 'svelte';

	import Button from '$lib/components/Button.svelte';
	import Table from '$lib/components/Table.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { HttpMethod, defaultHttpRequest } from '$lib/request';
	import type { QueryParams } from '$lib/request';
	import Modal from 'svelte-simple-modal';
	import AddCustomer from './AddCustomer.svelte';
	import type { Customer } from '../billing/models';

	const customerTableColNames: string[] = [
		'#',
		'Mobile Number',
		'Customer Name',
		'Member',
		'Preferred Pay Method',
		'Points',
		'Email'
	];
	const customerTableEntries: (string | number)[][] = [];

	let searchTextField: TextInput;

	async function loadCustomers() {
		const orgId: string = '77b5028d-5082-4dab-bdba-3fdc3fa35509';
		const params: QueryParams = {};
		if (searchTextField.value) {
			params['customer_name'] = searchTextField.value;
		}

		const customers = await defaultHttpRequest<Customer[]>(
			HttpMethod.GET,
			`https://kori-backend.azurewebsites.net/customer/v1/org/${orgId}`,
			undefined,
			params
		);

		customerTableEntries.length = 0;
		for (const cust of customers) {
			const customerEntry = [
				customerTableEntries.length + 1,
				cust.phone_number,
				cust.name,
				cust.is_member ? 'Yes' : 'No',
				cust.preferred_payment_method,
				cust.membership_points,
				cust.email
			];
			console.log(customerEntry);
			customerTableEntries.push(customerEntry);
		}
		console.log(customerTableEntries);
	}

	onMount(async () => loadCustomers());
</script>

<div class="flex ...">
	<div class="my-auto mx-auto w-3/4 ...">
		<div class="mx-auto w-full mt-4 mb-2 ...">
			<div class="float-left mr-4 ...">
				<TextInput bind:this={searchTextField} placeholder="Search Customers" />
			</div>

			<div class="float-left ...">
				<Button buttonText="Search" onClick={loadCustomers} />
			</div>
			<div class="float-right ...">
				<Modal>
					<AddCustomer />
				</Modal>
			</div>
			<div class="clear-both" />
		</div>
		<Table rowValues={customerTableEntries} columnNames={customerTableColNames} />
	</div>
</div>
