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
	<div class=" h-screen ...">
		<div on:click={() => goto('/app/inventory/')} style="cursor: pointer">&lt;-Back</div>

		<div class="my-auto ...">
			<div class="mx-auto w-3/5 mt-4 mb-2 ...">
				<div class="clear-both mb-4" />
				<table>
					<thead>
						<tr>
							<th style="width: 150%" colspan="2" align="left"
								>Product ID: {productData.product_id}</th
							>
							<th>
								<div class="float-right w-20 text-center ml-10.5 ...">
									<Button buttonText="Edit" onClick={toggleDisabled} />
								</div>
							</th>
						</tr>
					</thead>
					<br />
					<tbody>
						<tr>
							<td>
								<div class="float-left mr-32 ...">
									<p>Product Name</p>
									<TextInput bind:value={productData.name} {disabled} placeholder="Enter name" />
								</div>
							</td>
							<td>
								<div class="float-left mr-32 ...">
									<p>Measurement Unit</p>
									<TextInput
										bind:value={productData.measurement_unit}
										{disabled}
										placeholder="Enter Measurement Unit"
									/>
								</div>
							</td>
							<td>
								<div class="float-right w-20 text-center mr-10.5 ...">
									<Button buttonText="Delete" onClick={deleteProduct} />
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div class="clear-both mb-4 ...">
									<p>Price</p>
									<TextInput bind:value={productData.price} {disabled} placeholder="Enter Price" />
								</div>
							</td>
							<td>
								<div class="float-left mr-32 ...">
									<p>Reorder Level</p>
									<TextInput
										value={productData.reorder_level}
										disabled="False"
										placeholder="Enter reorder level"
									/>
								</div>
							</td>
							<td>
								<div class="float-right w-20 text-center ml-10.5 ..." hidden={disabled}>
									<Button buttonText="Save" onClick={editProduct} />
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<Table rowValues={productTableEntries} columnNames={productTableColNames} />
		</div>
	</div>
{/if}
