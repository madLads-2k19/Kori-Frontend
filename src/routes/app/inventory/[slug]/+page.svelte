<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import Button from '$lib/components/Button.svelte';
	import Select from '$lib/components/Select.svelte';
	import TextInput from '$lib/components/TextInput.svelte';

	import { userData } from '$lib/localStore';
	import { notifications } from '$lib/components/notification';
	import { defaultHttpRequest, HttpMethod } from '$lib/request';

	const orgId = userData.org_id;
	const permissionLevel = userData.permission_level;

	interface Product {
		reorder_level: number;
		name: string;
		price: number;
		measurement_unit: string;
		org_id: string;
		product_id: string;
		version_id: number;
	}

	interface Store {
		id: string;
		org_id: string;
		name: string;
	}

	interface StoreProduct {
		product_id: string;
		stock_available: number;
		stock_locked: number;
		store_id: string;
	}

	// For accessing productID form other page
	export let data;

	const stores: Store[] = [];
	const storeProducts: StoreProduct[] = [];

	const storeIdToNameMap: { [key: string]: string } = {};
	let otherStoreOptions: {
		name: string;
		value: string;
	}[] = [];
	var selectedStoreId: string = userData.default_store_id;
	const productTableColNames: string[] = ['#', 'Store ID', 'Store Name', 'Stock Available'];
	const productTableEntries: (string | number)[][] = [];

	let productData: Product;

	onMount(async () => {
		productData = await defaultHttpRequest<Product>(
			HttpMethod.GET,
			`https://kori-backend.azurewebsites.net/product/v1/${data.productId}`
		);
		await loadProducts();
		render();
	});

	async function loadProducts() {
		const apiStoreProducts = await defaultHttpRequest<StoreProduct[]>(
			HttpMethod.GET,
			`https://kori-backend.azurewebsites.net/store_product/v1/${orgId}/product/${data.productId}`
		);
		storeProducts.length = 0;
		storeProducts.push(...apiStoreProducts);

		const apiStores = await defaultHttpRequest<Store[]>(
			HttpMethod.GET,
			`https://kori-backend.azurewebsites.net/store/v1/${orgId}`
		);
		stores.length = 0;
		stores.push(...apiStores);
	}

	function render() {
		let unMappedStoreId: string[] = [];

		for (var key in storeIdToNameMap) {
			delete storeIdToNameMap[key];
		}
		for (const store of stores) {
			storeIdToNameMap[store.id] = store.name;
			unMappedStoreId.push(store.id);
		}

		productTableEntries.length = 0;
		for (const product of storeProducts) {
			const storeName = storeIdToNameMap[product.store_id];
			const productEntry = [
				productTableEntries.length + 1,
				product.store_id,
				storeName,
				product.stock_available
			];
			productTableEntries.push(productEntry);

			if (unMappedStoreId.includes(product.store_id)) {
				// Remove already present store
				unMappedStoreId.splice(unMappedStoreId.indexOf(product.store_id), 1);
			}
		}

		otherStoreOptions.length = 0
		for (const storeId of unMappedStoreId) {
			const storeName = storeIdToNameMap[storeId];
			otherStoreOptions.push({ name: storeId, value: storeName });
		}
		otherStoreOptions = otherStoreOptions;
		selectedStoreId = otherStoreOptions[0]['name'];
	}

	let productEditDisabled = true;
	let storeProductEditDisabled = true;

	async function editProduct() {
		const name = productData.name;
		const price = productData.price;
		const measurementUnit = productData.measurement_unit;

		await defaultHttpRequest<Store[]>(
			HttpMethod.PUT,
			`https://kori-backend.azurewebsites.net/product/v1/${productData.product_id}`,
			{ name, price, measurement_unit: measurementUnit }
		);
	}

	async function deleteProduct() {
		await defaultHttpRequest<String>(
			HttpMethod.DELETE,
			`https://kori-backend.azurewebsites.net/product/v1/${data.productId}`
		);
		goto('/app/inventory');
	}

	async function addProductToStore() {
		const orgId = userData.org_id;

		if (selectedStoreId.trim() == '') {
			notifications.danger('Invalid Shop selected!');
			return;
		}

		await defaultHttpRequest<String>(
			HttpMethod.POST,
			`https://kori-backend.azurewebsites.net/store_product/v1/${orgId}`,
			{
				product_id: productData.product_id,
				store_id: selectedStoreId,
				stock_available: 0
			}
		);
		await loadProducts();
		await render();
	}

	async function saveStockAvailable() {
		storeProductEditDisabled = true;

		for (const storeProduct of storeProducts) {
			const stockAvailable = parseFloat(String(storeProduct.stock_available));
			if (typeof stockAvailable === 'number' && isFinite(stockAvailable) && stockAvailable >= 0) {
				await defaultHttpRequest<String>(
					HttpMethod.PUT,
					`https://kori-backend.azurewebsites.net/store_product/v1/${orgId}/${storeProduct.store_id}/${storeProduct.product_id}`,
					{
						product_id: storeProduct.product_id,
						store_id: storeProduct.store_id,
						stock_available: stockAvailable
					}
				);
			}
		}
		await loadProducts();
		await render();
		notifications.success('Product added to store');
	}
</script>

{#if productData}
	<div>
		<div class="float-right text-center ml-10.5 ..." />
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div on:click={() => goto('/app/inventory/')} class="hover:cursor-pointer w-24 mt-2 ml-2">
			<Button onClick={() => goto('/app/inventory/')} buttonText="Go Back" />
		</div>

		<div class="mx-auto my-auto w-3/4 ...">
			<div class="mx-auto mt-4 mb-2 grid grid-cols-3 gap-4 ...">
				<p class="font-bold col-span-2 ...">Product ID: {productData.product_id}</p>

				<div class="text-center ...">
					<div class="w-20 float-right ml-2 ..." hidden={productEditDisabled}>
						{#if permissionLevel == 'admin'}
							<Button buttonText="Save" onClick={editProduct} />
						{/if}
					</div>
					<div class="w-20 float-right">
						{#if permissionLevel == 'admin'}
							<Button
								buttonText="Edit"
								onClick={() => {
									productEditDisabled = !productEditDisabled;
								}}
							/>
						{/if}
					</div>
					<div class="w-20 float-right mr-2">
						{#if permissionLevel == 'admin'}
							<Button buttonText="Delete" onClick={deleteProduct} />
						{/if}
					</div>
				</div>

				<div class="col-span-2 ...">
					<TextInput
						label="Product Name"
						bind:value={productData.name}
						disabled={productEditDisabled}
						placeholder="Enter name"
					/>
				</div>

				<div>
					<div class="float-right">
						<TextInput
							label="Measurement Unit"
							bind:value={productData.measurement_unit}
							disabled={productEditDisabled}
							placeholder="Enter Measurement Unit"
						/>
					</div>
				</div>

				<div class="col-span-2 ...">
					<TextInput
						label="Price"
						bind:value={productData.price}
						disabled={productEditDisabled}
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

			<table
				class="font-sans mx-auto table-auto border-collapse border overflow-auto w-full rounded-sm font-light ..."
			>
				<thead>
					<tr class="bg-teal-600 text-white border ...">
						{#each productTableColNames as columnName}
							<th class="raz-entry">{columnName}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each storeProducts as storeProduct, i}
						<tr class="odd:bg-teal-50 hover:bg-teal-100 ...">
							<td class="raz-entry">{i}</td>
							<td class="raz-entry">{storeProduct.store_id}</td>
							<td class="raz-entry">{storeIdToNameMap[storeProduct.store_id]}</td>
							<td class="raz-entry">
								<TextInput
									bind:value={storeProduct.stock_available}
									disabled={storeProductEditDisabled}
									type="number"
									placeholder="0.0"
								/>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>

			<style>
				.raz-entry {
					padding: 0.3em;
					text-align: center;
				}
			</style>

			<div class="mx-auto m-4 ...">
				<div class="float-left m-5">
					<Select
						label="Select Store : "
						options={otherStoreOptions}
						bind:selectedOption={selectedStoreId}
					/>
				</div>
				<div class="float-left m-5 text-center ...">
					<Button buttonText="Add Product to Store" onClick={addProductToStore} />
				</div>
				<div class="float-right m-5 text-center ...">
					<Button buttonText="Save Stock" onClick={saveStockAvailable} />
				</div>

				<div class="float-right m-5 text-center ...">
					<Button
						buttonText="Edit Stock"
						onClick={() => {
							storeProductEditDisabled = !storeProductEditDisabled;
						}}
					/>
				</div>
			</div>
		</div>
	</div>
{/if}
