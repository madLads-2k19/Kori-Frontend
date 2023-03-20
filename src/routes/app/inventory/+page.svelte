<script lang="ts">
	import { onMount } from 'svelte';

	import Table from '$lib/components/Table.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { HttpMethod, defaultHttpRequest, type QueryParams } from '$lib/request';
	import Modal from 'svelte-simple-modal';
	import AddProduct from './AddInventory.svelte';
	import { goto } from '$app/navigation';
	import { userData } from '$lib/localStore';

	const permissionLevel = userData.permission_level;
	const productTableColNames: string[] = ['#', 'Name', 'Price', 'Measurement Unit'];

	const productTableEntries: (string | number | bigint | Date)[][] = [];

	interface Product {
		product_id: string;
		version_id: string;
		org_id: string;
		name: string;
		price: number;
		measurement_unit: string;
		reorder_level: bigint;
		timestamp: Date;
	}

	let productsBuffered: Product[] = [];

	function redirectToProductSubPage(row: number) {
		goto('/app/inventory/' + productsBuffered[row[0] - 1].product_id);
	}

	async function loadProducts() {
		const orgId = userData.org_id;

		const products = await defaultHttpRequest<Product[]>(
			HttpMethod.GET,
			`https://kori-backend.azurewebsites.net/product/v1/organization/${orgId}`,
		);
		productsBuffered = products;

		productTableEntries.length = 0;
		for (const product of products) {
			const productEntry = [
				productTableEntries.length + 1,
				product.name,
				product.price,
				product.measurement_unit
			];
			productTableEntries.push(productEntry);
		}
	}
	onMount(async () => loadProducts());
</script>

<div class=" flex pt-5 ...">
	<div class="my-auto mx-auto w-3/4 ...">
		<div class=" mt-4 mb-2 ...">
			{#if permissionLevel == 'admin'}
				<div class="float-right ...">
					<Modal>
						<AddProduct />
					</Modal>
				</div>
			{/if}
			<div class="clear-both" />
		</div>

		<Table handleRowSelect={redirectToProductSubPage} rowValues={productTableEntries} columnNames={productTableColNames} />
	</div>
</div>
