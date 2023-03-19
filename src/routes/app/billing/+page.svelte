<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Table from '$lib/components/Table.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import DropdownInput from '$lib/components/DropdownInput.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Select from '$lib/components/Select.svelte';

	import { get } from 'svelte/store';

	import { HttpMethod, defaultHttpRequest } from '$lib/request';
	import type { StoreProduct, Customer, CreatedCustomerBill } from './models';
	import { authData } from '$lib/store';
	import { onMount } from 'svelte';

	let columnNames: string[] = ['S.no', 'Item', 'Price', 'Quantity', 'Amount'];

	let productSearchQuery = '';

	const URL = 'https://kori-backend.azurewebsites.net';

	let org_id: string = '';
	let user_id: string = '';
	const store_id = 'cae271b6-da6e-411f-8822-940dbab486de';

	const paymentOptions = [
		{
			name: 'cash',
			value: 'Cash'
		},
		{
			name: 'card',
			value: 'Card'
		}
	];

	let rowValues: (string | number)[][] = [];

	let billOptions = {
		payment_method: 'cash',
		discount_price: '',
		delivery_charge: '',
		delivery_address: ''
	};

	let billDetails = {
		home_delivery: false,
		phoneNumber: ''
	};

	let productMap = new Map();

	let storeProductNames: string[] = [];
	let selectedProduct = '';
	let selectedProductQty = 1;

	function fetchStoreProducts() {
		const reqUrl = URL + `/store_product/v1/${org_id}/store/${store_id}`;
		defaultHttpRequest<StoreProduct[]>(HttpMethod.GET, reqUrl).then((data: StoreProduct[]) => {
			data.forEach((product) => {
				storeProductNames.push(product.product.name);
				productMap.set(product.product.name, {
					...product.product,
					product_id: product.product_id,
					stock_available: product.stock_available,
					selected: false,
					selected_qty: 0
				});
			});
			console.log(productMap);
			storeProductNames = storeProductNames;
		});
	}

	onMount(async () => {
		const userAuthData = $authData;
		org_id = userAuthData.org_id;
		user_id = userAuthData.user_id;
		fetchStoreProducts();
	});

	function renderTable() {
		rowValues.length = 0;
		Array.from(productMap.values())
			.filter((product) => product.selected)
			.forEach((product, index) => {
				rowValues.push([
					index + 1,
					product.name,
					product.price,
					product.selected_qty,
					product.price * product.selected_qty
				]);
			});
		rowValues = rowValues;
	}

	function addItem() {
		console.log(selectedProduct);
		if (selectedProduct.length == 0) {
			// throw error
			console.log('Nothing selected');
			return;
		}
		const selectedProductObject = productMap.get(selectedProduct);

		if (selectedProductObject.selected) {
			return;
		}
		if (selectedProductObject.stock_available < selectedProductQty || selectedProductQty < 1) {
			// throw error invalid selected qty
			return;
		}

		selectedProductObject.selected = true;
		selectedProductObject.selected_qty = selectedProductQty;

		console.log(selectedProductObject);

		renderTable();
	}

	function deleteItem() {
		const selectedProductObject = productMap.get(selectedProduct);
		if (!selectedProductObject.selected) {
			return;
		}

		selectedProductObject.selected = false;
		selectedProductObject.selected_qty = 0;

		renderTable();
	}

	function getProductRequestObject(product) {
		return {
			product_id: product.product_id,
			product_quantity: product.selected_qty
		};
	}

	function getNonEmpty(obj) {
		let nonEmptyObj = {};
		for (const [key, value] of Object.entries(obj)) {
			if (value) {
				nonEmptyObj[key] = value;
			}
		}
		return nonEmptyObj;
	}

	async function getBillingRequestBody() {
		if (!billDetails.phoneNumber) {
			console.log('Phone number not entered');
			// throw error
			return;
		}
		const customerUrl = URL + `/customer/v1/number/${billDetails.phoneNumber}`;

		const customerObject: Customer = await defaultHttpRequest<Customer>(
			HttpMethod.GET,
			customerUrl
		);

		const products_billed = Array.from(productMap.values())
			.filter((product) => product.selected)
			.map(getProductRequestObject);

		console.log(products_billed);
		if (products_billed.length == 0) {
			console.log('No products billed');
			// throw error
			return;
		}

		return {
			org_id,
			store_id,
			user_id,
			customer_id: customerObject.id,
			...getNonEmpty(billOptions),
			products_billed
		};
	}

	async function submit() {
		console.log(productMap);
		console.log(billOptions);

		const billingUrl = URL + `/customer_bill/v1/${org_id}`;

		const requestBody = await getBillingRequestBody();
		console.log(requestBody);

		const createdBill = await defaultHttpRequest<CreatedCustomerBill>(
			HttpMethod.POST,
			billingUrl,
			requestBody
		);
	}
</script>

<div class=" h-screen flex ...">
	<div class="my-auto ...">
		<Table {rowValues} {columnNames} />

		<div class="mx-auto w-3/5 mt-4 ...">
			<div class="float-left mb-5">
				<DropdownInput
					label="Select Product"
					options={storeProductNames}
					bind:value={selectedProduct}
				/>
			</div>
			<div class="float-right mb-5">
				<Button buttonText="Add Item" onClick={addItem} />
			</div>

			<div class="clear-both ..." />

			<div class="float-left mb-10">
				<TextInput
					label="Product Quantity"
					bind:value={selectedProductQty}
					type="number"
					placeholder=""
				/>
			</div>

			<div class="float-right mb-10">
				<Button buttonText="Delete Item" onClick={deleteItem} />
			</div>

			<div class="clear-both ..." />

			<div class="float-left mr-24 ...">
				<TextInput
					placeholder="10 digit number"
					label="Customer Ph Number"
					bind:value={billDetails.phoneNumber}
				/>
			</div>
			<div class="float-left mr-24 ...">
				<Checkbox label="Home Delivery" bind:checked={billDetails.home_delivery} />
			</div>
			<div class="float-left ...">
				<TextInput
					placeholder="Amount"
					label="Delivery Charges"
					disabled={!billDetails.home_delivery}
					bind:value={billOptions.delivery_charge}
				/>
			</div>
			<div class="clear-both ..." />
			<div class="float-left mt-8 ...">
				<TextInput
					placeholder="Discount"
					label="Discount Price"
					bind:value={billOptions.discount_price}
				/>
			</div>
			<div class="clear-both ..." />
			<div class="float-left mt-8 ...">
				<Select
					options={paymentOptions}
					bind:selectedOption={billOptions.payment_method}
					label="Payment Method"
				/>
			</div>
			<div class="float-right mt-8 ...">
				<TextArea
					label="Delivery Address"
					disabled={!billDetails.home_delivery}
					placeholder=""
					bind:value={billOptions.delivery_address}
				/>
			</div>

			<div class="clear-both ..." />

			<div class="float-right mt-5">
				<Button buttonText="Collect Payment" onClick={submit} />
			</div>
			<div class="float-left mt-5">
				<Button buttonText="Register Member/Deduct Points" />
			</div>

			<div class="clear-both" />
		</div>
	</div>
</div>
