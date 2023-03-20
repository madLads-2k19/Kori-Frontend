<script lang="ts">
	import { onMount } from 'svelte';

	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { HttpMethod, defaultHttpRequest } from '$lib/request';
	import Modal from 'svelte-simple-modal';
	import AddProduct from './AddInventory.svelte';
	import { goto } from '$app/navigation';

	const productTableColNames: string[] = ['#', 'Name', 'Price', 'Measurement Unit'];

	const productTableEntries: (string | number | bigint | Date)[][] = [];

	let searchTextField: TextInput;
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

	let productsBuffered = null;

	function redirectFunction(row) {
		goto('/app/inventory/' + productsBuffered[row[0] - 1].product_id);
	}

	async function loadProducts() {
		const orgID: string = '77b5028d-5082-4dab-bdba-3fdc3fa35509';

		const products = await defaultHttpRequest<Product[]>(
			HttpMethod.GET,
			`https://kori-backend.azurewebsites.net/product/v1/organization/${orgID}`,
			undefined
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

<div class="flex ...">
	<div class="my-auto mx-auto w-3/4 ...">
		<div class="mx-auto mt-4 mb-2 ...">
			<div class="float-left mr-4 ...">
				<TextInput
					bind:this={searchTextField}
					label="Search Products"
					placeholder="Search Product"
				/>
			</div>
			<div class="float-left ...">
				<Button buttonText="Search" onClick={loadProducts} />
			</div>
			<div class="float-right ...">
				<Modal>
					<AddProduct />
				</Modal>
			</div>
			<div class="clear-both" />
		</div>
		<table
			class="font-sans mx-auto table-auto border-collapse border overflow-auto w-full rounded-sm font-light ..."
		>
			<thead>
				<tr class="bg-teal-600 text-white border ...">
					{#each productTableColNames as columnName}
						<th>{columnName}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each productTableEntries as row}
					<tr
						class="odd:bg-teal-50 hover:bg-teal-100 ..."
						on:click={() => redirectFunction(row)}
						style="cursor: pointer"
					>
						{#each row as rowValue}
							<td>{rowValue}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>

		<style>
			th {
				padding: 0.3em;
				text-align: center;
			}

			td {
				padding: 0.3em;
				text-align: center;
			}
		</style>
	</div>
</div>
