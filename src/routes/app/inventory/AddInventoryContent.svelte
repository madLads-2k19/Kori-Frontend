<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { userData } from '$lib/localStore';
	import { notifications } from '$lib/components/notification';

	let reorder_level: number;
	let name: string;
	let price: number;
	let measurement_unit: string;

	let disableSubmit: boolean = false;
	let productCreationSuccess: boolean = false;

	let retry: boolean = false;
	function validate(productDetails) {
		console.log(productDetails);
		if (!productDetails.name || (productDetails.name && productDetails.name.trim().length == 0)) {
			notifications.danger('Product name cannot be empty');
			return false;
		}
		if (productDetails.price <= 0) {
			notifications.danger('Product selling price must be a positive value');
			return false;
		}
		if (productDetails.reorder_level <= 0) {
			notifications.danger('Product reorder level must be a positive value');
			return false;
		}
		if (
			!productDetails.measurement_unit ||
			(productDetails.measurement_unit && productDetails.measurement_unit.trim().length == 0)
		) {
			notifications.danger('Product measurement unit cannot be empty');
			return false;
		}
		return true;
	}

	function addProduct() {
		disableSubmit = true;
		const orgId = userData.org_id;
		const requestObject = {
			reorder_level,
			name,
			price,
			measurement_unit
		};

		if (!validate(requestObject)) {
			disableSubmit = false;
			return;
		}

		fetch(`https://kori-backend.azurewebsites.net/product/v1/${orgId}`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(requestObject)
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
</script>

<div class="p-4">
	<p class="text-2xl mb-4 text-teal-800">New Product</p>
	<div class="grid grid-cols-2 gap-x-12 gap-y-8 justify-between mb-8">
		<TextInput bind:value={name} label="Product Name" placeholder="Enter Product name" />
		<TextInput
			bind:value={price}
			label="Selling Price"
			placeholder="Enter Selling Price"
			type="number"
		/>
		<TextInput
			bind:value={reorder_level}
			label="Reorder level"
			placeholder="Enter Reorder level"
			type="number"
		/>
		<TextInput
			bind:value={measurement_unit}
			label="Measurement unit"
			placeholder="Enter Measurement unit"
		/>
	</div>

	{#if !disableSubmit}
		<div class="w-24 text-center">
			<Button onClick={addProduct} buttonText="Create" />
		</div>
	{/if}
	{#if disableSubmit}
		{#if productCreationSuccess}
			<p class="text-green-900">Product Creation Success, close the popup to continue...</p>
		{/if}
	{/if}
	{#if retry}
		<p class="text-red-800">Product Creation Failed, retry again</p>
	{/if}
</div>
