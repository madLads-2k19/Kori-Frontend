<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Table from '$lib/components/Table.svelte';
	import TextInput from '$lib/components/TextInput.svelte';

	import { onMount } from 'svelte';
	import { defaultHttpRequest, HttpMethod } from '../../../../lib/request';
	import { goto } from '$app/navigation';

	const productTableColNames: string[] = [
		'#',
		'Store ID',
		'Store Name',
		'Stock Available',
		'Reorder Level'
	];
	const productTableEntries: (string | number | bigint | Date)[][] = [];

	let productData;

	interface Product {
		product_id: string;
		stock_available: number;
		stock_locked: number;
		store_id: string;
	}

	interface Store {
		id: string;
		org_id: string;
		name: string;
	}

	async function loadProducts() {
		const orgID: string = '77b5028d-5082-4dab-bdba-3fdc3fa35509';

		let products = await defaultHttpRequest<Product[]>(
			HttpMethod.GET,
			`https://kori-backend.azurewebsites.net/store_product/v1/${orgID}/product/${data.productId}`,
			undefined
		);
		const stores = await defaultHttpRequest<Store[]>(
			HttpMethod.GET,
			`https://kori-backend.azurewebsites.net/store/v1/${orgID}`,
			undefined
		);
		let store_id_name_mapping = {};
		for (const store of stores) {
			store_id_name_mapping[store.id] = store.name;
		}

		productTableEntries.length = 0;
		for (const product of products) {
			const productEntry = [
				productTableEntries.length + 1,
				product.store_id,
				store_id_name_mapping[product.store_id],
				product.stock_available,
				'-'
			];
			productTableEntries.push(productEntry);
		}
	}

	let disabled = true;

	export let data;

	function toggleDisabled() {
		disabled = !disabled;
	}

	async function editProduct() {
		const name = productData.name;
		const price = productData.price;
		const measurement_unit = productData.measurement_unit;

		let disableSubmit: boolean = false;
		let productCreationSuccess: boolean = false;
		let retry: boolean = false;

		fetch(`https://kori-backend.azurewebsites.net/product/v1/${productData.product_id}`, {
			method: 'PUT',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
				name,
				price,
				measurement_unit
			})
		}).then((response) => {
			if (response.status == 200) {
				productCreationSuccess = true;
				retry = false;
				disableSubmit = true;
			} else {
				retry = true;
				disableSubmit = false;
			}
		});
	}
	function deleteProduct() {
		defaultHttpRequest<String>(
			HttpMethod.DELETE,
			`https://kori-backend.azurewebsites.net/product/v1/${data.productId}`,
			undefined
		);
		goto('/app/inventory/');
	}

	onMount(async () => {
		productData = await defaultHttpRequest<Product>(
			HttpMethod.GET,
			`https://kori-backend.azurewebsites.net/product/v1/${data.productId}`,
			undefined
		);
		await loadProducts();
	});
</script>

{#if productData}
	<div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="float-right text-center ml-10.5 ..." />
		<div on:click={() => goto('/app/inventory/')} class="hover:cursor-pointer w-24 mt-2 ml-2">
			<Button buttonText="Go Back" />
		</div>

		<div class="mx-auto my-auto w-3/4 ...">
			<div class="mx-auto mt-4 mb-2 grid grid-cols-3 gap-4 ...">
				<p class="font-bold col-span-2 ...">Product ID: {productData.product_id}</p>

				<div class="text-center ...">
					<div class="w-20 float-right ml-2 ..." hidden={disabled}>
						<Button buttonText="Save" onClick={editProduct} />
					</div>
					<div class="w-20 float-right">
						<Button buttonText="Edit" onClick={toggleDisabled} />
					</div>
					<div class="w-20 float-right mr-2">
						<Button buttonText="Delete" onClick={deleteProduct} />
					</div>
				</div>

				<div class="col-span-2 ...">
					<TextInput
						label="Product Name"
						bind:value={productData.name}
						{disabled}
						placeholder="Enter name"
					/>
				</div>

				<div>
					<div class="float-right">
						<TextInput
							label="Measurement Unit"
							bind:value={productData.measurement_unit}
							{disabled}
							placeholder="Enter Measurement Unit"
						/>
					</div>
				</div>

				<div class="col-span-2 ...">
					<TextInput
						label="Price"
						bind:value={productData.price}
						{disabled}
						placeholder="Enter Price"
					/>
				</div>

				<div>
					<div class="float-right">
						<TextInput
							label="Reorder Level"
							value={productData.reorder_level}
							disabled={false}
							placeholder="Enter reorder level"
						/>
					</div>
				</div>
			</div>
			<Table rowValues={productTableEntries} columnNames={productTableColNames} />
		</div>
	</div>
{/if}
