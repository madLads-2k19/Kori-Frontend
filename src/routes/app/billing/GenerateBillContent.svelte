<script lang="ts">
	import { HttpMethod, defaultHttpRequest } from '$lib/request';
	import { authData } from '$lib/store';
	import { onMount } from 'svelte';
	import Table from '$lib/components/Table.svelte';
	import type { CustomerBill } from './models';

	const billTableColumns: string[] = ['S.no', 'Item', 'Price', 'Quantity', 'Amount'];
	const billTableEntries: (string | number)[][] = [];

	export let customerBillId = '';

	onMount(() => {
		const userData = $authData;
		defaultHttpRequest<CustomerBill>(
			HttpMethod.GET,
			`https://kori-backend.azurewebsites.net/customer_bill/v1/${userData.org_id}/${customerBillId}`,
			undefined,
			undefined
		)
			.then((customerBill) => {
				billTableEntries.length = 0;
				for (const billProduct of customerBill.products_billed) {
					const billEntry = [
						billTableEntries.length + 1,
						billProduct.name,
						billProduct.price,
						billProduct.product_quantity,
						billProduct.total_cost
					];
					billTableEntries.push(billEntry);
				}
			})
            .catch(error => {
				console.log(error);
			});
	});
</script>

<div class="p-4">
    <p class="text-2xl mb-4 text-teal-800">Bill</p>
    <Table rowValues={billTableEntries} columnNames={billTableColumns} />
</div>
