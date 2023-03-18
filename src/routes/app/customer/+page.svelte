<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Table from '$lib/components/Table.svelte';
	import TextInput from '$lib/components/TextInput.svelte';

	const columnNames: string[] = ['S.no', 'Mobile Number', 'Customer Name', 'Is Member'];

	const rowValues: (string | number)[][] = [
		[1, '12345678', 'S Rithesh', 'Yes'],
		[2, '12345678', 'Sheerabth', 'No'],
		[3, '12345678', 'Bharath', 'Yes']
	];
</script>

<div class=" h-screen flex ...">
	<div class="my-auto ...">
		<div class="mx-auto w-3/5 mt-4 mb-2 ...">
			<div class="float-left ...">
				<TextInput label="Search Customer" placeholder="Search Customer By Name" />
			</div>
			<div class="float-right ...">
				<Button buttonText="Add Customer" />
			</div>
			<div class="clear-both" />
		</div>
		<Table {rowValues} {columnNames} />
	</div>
</div>
