<script class="ts">
  	import Modal from 'svelte-simple-modal';
	import Table from '$lib/components/Table.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import AddProduct from './AddInventory.svelte';

	let closeModal = false; 

	const columnNames = ['S.no', 'Product ID', 'Description', 'In Stock', 'Price'];

	const rowValues = [
		[1, '12345678', 'S Rithesh', 'Yes', 10],
		[2, '12345678', 'Sheerabth', 'No', 20],
		[3, '12345678', 'Bharath', 'Yes', 30]
	];
</script>

<div class=" h-screen flex ...">
	<div class="my-auto ...">
		<div class="mx-auto w-3/5 mt-4 mb-2 ...">
			<div class="float-left ...">
				<TextInput label="Search Products" placeholder="Search Product by ID or name" />
			</div>
			<div class="float-right ...">
				<Modal>
					<AddProduct />
				</Modal>
			</div>
			<div class="clear-both" />
		</div>
		<Table {rowValues} {columnNames} />
	</div>
</div>

