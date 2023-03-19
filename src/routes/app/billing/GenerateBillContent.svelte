<script lang="ts">
	import { HttpMethod, defaultHttpRequest } from '$lib/request';
	import { authData } from '$lib/store';
	import { onMount } from 'svelte';
	import Table from '$lib/components/Table.svelte';
	import type { CustomerBill } from './models';

	const billTableColumns: string[] = ['S.no', 'Item', 'Price', 'Quantity', 'Amount'];
	const billTableEntries: (string | number)[][] = [];
	let customerBill: CustomerBill;
	let paymentMethod: string;
	let discountPrice: number;
	let deliveryAddress: string;
	let deliveryCharge: number;
	let productsTotal: number;
	let netPrice: number;
	let billTime: string;

	export let customerBillId = '';

	onMount(async () => {
		const userData = $authData;
		await defaultHttpRequest<CustomerBill>(
			HttpMethod.GET,
			`https://kori-backend.azurewebsites.net/customer_bill/v1/${userData.org_id}/${customerBillId}`,
			undefined,
			undefined
		)
			.then((customerBillPayload) => {
				customerBill = customerBillPayload;
				paymentMethod = customerBill.payment_method;
				discountPrice = customerBill.discount_price;
				deliveryAddress = customerBill.delivery_address;
				deliveryCharge = customerBill.delivery_charge;
				productsTotal = customerBill.products_total;
				netPrice = customerBill.net_price;
				billTime = customerBill.billed_at;

				billTableEntries.length = 0;
				for (const billProduct of customerBillPayload.products_billed) {
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
			.catch((error) => {
				console.log(error);
			});
	});
</script>

<div class="p-4">
	<p class="text-2xl mb-4 text-teal-800">Bill</p>
	<Table rowValues={billTableEntries} columnNames={billTableColumns} />
	<div class="clear-both ..." />
	<div class="float-left mt-5">
		<label>Payment Method: {paymentMethod}</label>
	</div>
	<div class="clear-both ..." />
	<div class="float-left mt-5">
		<label>Discount Price: {discountPrice}</label>
	</div>
	<div class="clear-both ..." />
	{#if deliveryAddress}
		<div class="float-left mt-5">
			<label>Delivery Address: {deliveryAddress}</label>
		</div>
		<div class="clear-both ..." />
	{/if}
	{#if deliveryCharge}
		<div class="float-left mt-5">
			<label>Delivery Charge: {deliveryCharge}</label>
		</div>
		<div class="clear-both ..." />
	{/if}
	<div class="float-left mt-5">
		<label>Products Total: {productsTotal}</label>
	</div>
	<div class="clear-both ..." />
	<div class="float-left mt-5">
		<label>Net Price: {netPrice}</label>
	</div>
	<div class="clear-both ..." />
	<div class="float-left mt-5">
		<label>Bill Time: {billTime}</label>
	</div>
	<div class="clear-both ..." />
</div>
