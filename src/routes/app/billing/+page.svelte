<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Table from '$lib/components/Table.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import DropdownInput from '$lib/components/DropdownInput.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Select from '$lib/components/Select.svelte';
	import Modal from 'svelte-simple-modal';

	import { HttpMethod, defaultHttpRequest } from '$lib/request';
	import type { StoreProduct, Customer, CreatedCustomerBill, Product } from './models';
	import { onMount } from 'svelte';

	import GenerateBill from './GenerateBill.svelte';
	import { notifications } from '$lib/components/notification';
	import AddCustomer from '../customer/AddCustomer.svelte';
	import EditCustomer from '../customer/EditCustomer.svelte';
	import { userData } from '$lib/localStore';

	let columnNames: string[] = ['S.no', 'Item', 'Price', 'Quantity', 'Amount'];

	const DOMAIN = 'https://kori-backend.azurewebsites.net';

	let orgId: string = '';
	let userId: string = '';
	let customerBillId: string;
	let customer: Customer;
	let allowDiscount: boolean = false;
	let newCustomer: boolean;
	let membershipPoints: number;

	let selectedStoreId = userData.default_store_id;

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

	let billFetchStatus: boolean;

	async function fetchStoreProducts() {
		const reqUrl = DOMAIN + `/store_product/v1/${orgId}/store/${selectedStoreId}`;
		storeProductNames = [];
		await defaultHttpRequest<StoreProduct[]>(
			HttpMethod.GET,
			reqUrl,
			undefined,
			undefined,
			undefined
		).then((data: StoreProduct[]) => {
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

	interface Store {
		id: string;
		org_id: string;
		name: string;
	}

	let otherStoreOptions: {
		name: string;
		value: string;
	}[] = [];

	async function handleOnChange() {
		await fetchStoreProducts();
		selectedProduct = '';
	}

	async function loadStores() {
		const stores = await defaultHttpRequest<Store[]>(
			HttpMethod.GET,
			`https://kori-backend.azurewebsites.net/store/v1/${orgId}`
		);
		otherStoreOptions.length = 0;
		for (const store of stores) {
			otherStoreOptions.push({ name: store.id, value: store.name });
		}
		otherStoreOptions = otherStoreOptions;
		if (stores.length != 0) {
			selectedStoreId = userData.default_store_id || stores[0].id;
		}
	}

	onMount(async () => {
		if (userData.org_id && userData.user_id) {
			orgId = userData.org_id;
			userId = userData.user_id;
		}
		await loadStores();
		await fetchStoreProducts();
	});

	function renderTable() {
		rowValues.length = 0;
		let updatedProductTotal = 0;
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
		if (selectedProduct.length == 0) {
			notifications.danger('Select product before adding item');
			return;
		}
		const selectedProductObject = productMap.get(selectedProduct);

		if (selectedProductObject.selected) {
			notifications.danger('The selected product is already in the bill');
		}
		if (selectedProductQty <= 0) {
			notifications.danger('Product quantity must be positive');
			return;
		}
		if (selectedProductObject.stock_available < selectedProductQty) {
			notifications.danger('Product quantity cannot exceed available stock');
			return;
		}

		selectedProductObject.selected = true;
		selectedProductObject.selected_qty = selectedProductQty;
		renderTable();
		selectedProduct = '';
		selectedProductQty = 1;
	}

	function deleteItem() {
		if (selectedProduct.length == 0) {
			notifications.danger('Please select a product to be removed');
			selectedProduct = '';
			return;
		}

		const selectedProductObject = productMap.get(selectedProduct);
		if (!selectedProductObject.selected) {
			notifications.danger('The selected product is not in the bill');
			selectedProduct = '';
			return;
		}

		selectedProductObject.selected = false;
		selectedProductObject.selected_qty = 0;

		renderTable();
		selectedProduct = '';
	}

	function getProductRequestObject(product: Product) {
		return {
			product_id: product.product_id,
			product_quantity: product.selected_qty
		};
	}

	async function handleKeyDown(element) {
		if (element.key != 'Enter') return;

		if (
			!billDetails.phoneNumber.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
		) {
			notifications.danger('Invalid phone number');
			return;
		}

		const customerUrl = DOMAIN + `/customer/v1/number/${billDetails.phoneNumber}`;
		await defaultHttpRequest<Customer>(HttpMethod.GET, customerUrl)
			.then((customerObject) => {
				newCustomer = false;
				customer = customerObject;
				membershipPoints = customer.membership_points;
				allowDiscount = customer.is_member;
			})
			.catch((error) => {
				newCustomer = true;
				notifications.danger('Failed to fetch customer');
			});
	}

	async function getBillingRequestBody() {
		const products_billed = Array.from(productMap.values())
			.filter((product) => product.selected)
			.map(getProductRequestObject);

		if (products_billed.length == 0) {
			notifications.danger('No products billed');
			return;
		}

		if (
			!billDetails.phoneNumber.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
		) {
			notifications.danger('Invalid phone number');
			return;
		}

		let customerObject;
		const customerUrl = DOMAIN + `/customer/v1/number/${billDetails.phoneNumber}`;
		await defaultHttpRequest<Customer>(HttpMethod.GET, customerUrl)
			.then((customer) => {
				customerObject = customer;
			})
			.catch((error) => {
				notifications.danger('Customer with provided phone number not found');
				return;
			});

		if (!selectedStoreId) {
			notifications.danger('Store not selected');
			return;
		}

		let billingRequestBody = {
			org_id: orgId,
			store_id: selectedStoreId,
			customer_id: customerObject.id,
			user_id: userId,
			payment_method: billOptions.payment_method,
			products_billed
		};

		if (billOptions.discount_price < 0) {
			notifications.danger('Discount price cannot be negative');
			return;
		}

		if (billOptions.discount_price > membershipPoints) {
			notifications.danger('Discount price cannot be greater than membership points');
			return;
		}

		if (billOptions.discount_price > productTotal) {
			notifications.danger('Discount price cannot be greater than product total');
			return;
		}

		if (billOptions.discount_price > 0) {
			billingRequestBody.discount_price = billOptions.discount_price;
		}

		if (billDetails.home_delivery) {
			if (billOptions.delivery_address.length == 0) {
				notifications.danger('Invalid delivery address');
				return;
			}
			if (billOptions.delivery_charge < 0) {
				notifications.danger('Delivery charge cannot be negative');
				return;
			}

			billingRequestBody.delivery_address = billOptions.delivery_address;
			billingRequestBody.delivery_charge = billOptions.delivery_charge;
		}

		return billingRequestBody;
	}

	async function submit() {
		const billingUrl = DOMAIN + `/customer_bill/v1/${orgId}`;

		const requestBody = await getBillingRequestBody();
		if (requestBody == undefined) {
			return;
		}

		await defaultHttpRequest<CreatedCustomerBill>(HttpMethod.POST, billingUrl, requestBody)
			.then((customerBill) => {
				billFetchStatus = true;
				notifications.success('Bill created');
				customerBillId = customerBill.id;
			})
			.catch((error) => {
				billFetchStatus = false;
				notifications.danger('Failed to create bill');
			});
	}
</script>

<div class=" flex pt-5 ...">
	<div class="my-auto mx-auto w-3/4 ...">
		<div class="float-left mb-5">
			<Select
				{handleOnChange}
				label="Select Store : "
				options={otherStoreOptions}
				bind:selectedOption={selectedStoreId}
			/>
		</div>
		<Table {rowValues} {columnNames} />

		<div class="mx-auto mt-4 ...">
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

			<div class="float-left mb-5 mr-10 ...">
				<TextInput
					{handleKeyDown}
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
					disabled={!allowDiscount}
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

			{#if membershipPoints}
				<div class="float-left mb-5">
					<label>
						Membership Points: {membershipPoints}
					</label>
				</div>
			{/if}

			<div class="float-right mb-5">
				<label>
					Net Total: {(
						parseFloat(productTotal) -
						parseFloat(billOptions.discount_price) +
						(billDetails.home_delivery ? parseFloat(billOptions.delivery_charge) : 0)
					).toFixed(2)}
				</label>
			</div>
			<div class="clear-both ..." />

			<div class="float-right mt-5">
				<Button buttonText="Collect Payment" onClick={submit} />
			</div>
			<div class="float-left mt-5">
				{#if newCustomer == true}
					<Modal>
						<AddCustomer />
					</Modal>
				{:else if newCustomer == false}
					<Modal>
						<EditCustomer {customer} />
					</Modal>
				{/if}
			</div>
			<div class="float-left mt-5">
				{#if billFetchStatus == true}
					<Modal>
						<GenerateBill {customerBillId} />
					</Modal>
				{/if}
			</div>
			<div class="clear-both" />
		</div>
	</div>
</div>
