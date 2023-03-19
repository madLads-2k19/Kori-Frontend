<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Table from '$lib/components/Table.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import DropdownInput from '$lib/components/DropdownInput.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Select from '$lib/components/Select.svelte';

	import { HttpMethod, defaultHttpRequest } from '$lib/request';
	import type { StoreProduct, Customer, CreatedCustomerBill } from './models';
	import { authData } from '$lib/store';
	import { onMount } from 'svelte';

	let columnNames: string[] = ['S.no', 'Item', 'Price', 'Quantity', 'Amount'];

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
	let productTotal = 0;
	// let netTotal = (0.0).toFixed(2);

	let billOptions = {
		payment_method: 'cash',
		discount_price: 0.0,
		delivery_charge: 0.0,
		delivery_address: ''
	};

	let billDetails = {
		home_delivery: false,
		phoneNumber: ''
	};

	let productMap = new Map();

	let storeProductNames: string[] = [];
	let selectedProduct = '';
	let selectedProductQty = 1.0;

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
		let updatedProductTotal = 0;
		let updatedNetTotal = 0;
		Array.from(productMap.values())
			.filter((product) => product.selected)
			.forEach((product, index) => {
				const rowTotal = product.price * product.selected_qty;
				rowValues.push([
					index + 1,
					product.name,
					product.price.toFixed(2),
					product.selected_qty,
					rowTotal.toFixed(2)
				]);
				updatedProductTotal += rowTotal;
			});
		rowValues = rowValues;
		productTotal = updatedProductTotal;
	}

	function addItem() {
		console.log(selectedProduct);
		if (selectedProduct.length == 0) {
			window.alert('Please select a product to be billed');
			return;
		}
		const selectedProductObject = productMap.get(selectedProduct);

		if (selectedProductObject.selected) {
			window.alert('The selected product is already in the bill');
			return;
		}
		if (selectedProductQty <= 0) {
			window.alert('Product quantity canont be non-negative');
			return;
		}
		if (selectedProductObject.stock_available < selectedProductQty) {
			window.alert('Product quantity cannot exceed available stock');
			return;
		}

		selectedProductObject.selected = true;
		selectedProductObject.selected_qty = selectedProductQty;

		console.log(selectedProductObject);

		renderTable();
		selectedProduct = '';
	}

	function deleteItem() {
		if (selectedProduct.length == 0) {
			window.alert('Please select a product to be removed');
			selectedProduct = '';
			return;
		}

		const selectedProductObject = productMap.get(selectedProduct);
		if (!selectedProductObject.selected) {
			window.alert('The selected product is not in the bill');
			selectedProduct = '';
			return;
		}

		selectedProductObject.selected = false;
		selectedProductObject.selected_qty = 0;

		renderTable();
		selectedProduct = '';
	}

	function getProductRequestObject(product) {
		return {
			product_id: product.product_id,
			product_quantity: product.selected_qty
		};
	}

	async function getBillingRequestBody() {
		if (
			!billDetails.phoneNumber.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
		) {
			window.alert('Invalid phone number');
			return null;
		}

		const customerUrl = URL + `/customer/v1/number/${billDetails.phoneNumber}`;

		let customerObject = null;

		try {
			customerObject = await defaultHttpRequest<Customer>(HttpMethod.GET, customerUrl);
		} catch (error) {
			window.alert('Customer with provided phone number not found');
			return null;
		}

		const products_billed = Array.from(productMap.values())
			.filter((product) => product.selected)
			.map(getProductRequestObject);

		console.log(products_billed);
		if (products_billed.length == 0) {
			window.alert('No products billed');
			return null;
		}

		let billingRequestBody = {
			org_id,
			store_id,
			user_id,
			customer_id: customerObject.id,
			products_billed,
			payment_method: billOptions.payment_method
		};

		if (billOptions.discount_price < 0) {
			window.alert('Discount price cannot be negative');
			return null;
		}

		if (billOptions.discount_price > parseFloat(productTotal)) {
			window.alert('Discount price cannot be greater than product total');
			return null;
		}

		if (billOptions.discount_price > 0) {
			billingRequestBody.discount_price = billOptions.discount_price;
		}

		if (billDetails.home_delivery) {
			if (billOptions.delivery_address.length == 0) {
				window.alert('Invalid devliery address');
				return null;
			}
			if (billOptions.delivery_charge < 0) {
				window.alert('Delivery charge cannot be negative');
				return null;
			}

			billingRequestBody.delivery_address = billOptions.delivery_address;
			billingRequestBody.delivery_charge = billOptions.delivery_charge;
		}

		return billingRequestBody;
	}

	async function submit() {
		console.log(productMap);
		console.log(billOptions);

		const billingUrl = URL + `/customer_bill/v1/${org_id}`;

		const requestBody = await getBillingRequestBody();

		if (!requestBody) return;
		console.log(requestBody);

		try {
			const createdBill = await defaultHttpRequest<CreatedCustomerBill>(
				HttpMethod.POST,
				billingUrl,
				requestBody
			);
		} catch (error) {
			window.alert('Error while creating bill');
			console.log(error);
		}
		window.alert('Bill Created');
	}
</script>

<div class=" h-screen flex ...">
	<div class="my-auto ...">
		<Table {rowValues} {columnNames} />

		<div class="mx-auto w-3/5 mt-4 ...">
			<div class="float-right mb-5">
				<label>Total: {productTotal.toFixed(2)}</label>
			</div>
			<div class="clear-both ..." />

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
					type="number"
				/>
			</div>
			<div class="clear-both ..." />
			<div class="float-left mt-8 ...">
				<TextInput
					placeholder="Discount"
					label="Discount Amount"
					bind:value={billOptions.discount_price}
					type="number"
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

			<div class="float-right mb-5">
				<label
					>Net Total: {(
						productTotal -
						billOptions.discount_price +
						(billDetails.home_delivery ? billOptions.delivery_charge : 0)
					).toFixed(2)}</label
				>
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
