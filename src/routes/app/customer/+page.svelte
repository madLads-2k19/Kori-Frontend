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
	import { userData } from '$lib/localStore';
	import { notifications } from '$lib/components/notification';
	import EditCustomer from './EditCustomer.svelte';

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
	let selectedCustomer: Customer;

	async function handleRowSelect(row) {
		const phoneNumber = row[1];
		await defaultHttpRequest<Customer>(
			HttpMethod.GET,
			`https://kori-backend.azurewebsites.net/customer/v1/number/${phoneNumber}`
		)
			.then((customerObject) => {
				selectedCustomer = customerObject;
			})
			.catch((error) => {
				notifications.danger('Failed to fetch customer');
			});
	}

	async function loadCustomers() {
		const orgId: string = userData.org_id;
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
			customerTableEntries.push(customerEntry);
		}
		console.log(customerTableEntries);
	}

	onMount(async () => loadCustomers());
</script>

<div class=" flex pt-5 ...">
	<div class="my-auto mx-auto w-3/4 ...">
		<div class=" mb-2 ...">
			<div class="float-left m-2 ...">
				<TextInput bind:this={searchTextField} placeholder="Search Customers" />
			</div>

			<div class="float-left m-1.5 ...">
				<Button buttonText="Search" onClick={loadCustomers} />
			</div>
			{#if selectedCustomer}
				<div class="float-right ...">
					<Modal>
						<EditCustomer customer={selectedCustomer} />
					</Modal>
				</div>
			{/if}
			<div class="float-right mr-2 ...">
				<Modal>
					<AddCustomer />
				</Modal>
			</div>
			<div class="clear-both" />
		</div>
		<Table {handleRowSelect} rowValues={customerTableEntries} columnNames={customerTableColNames} />
	</div>
</div>
