<script lang="ts">
	import Button from '../../../lib/components/Button.svelte';
	import Table from '../../../lib/components/Table.svelte';
	import TextInput from '../../../lib/components/TextInput.svelte';

	const columnNames: string[] = ['S.no', 'Location ID', 'Location', 'In Stock', 'Reorder'];
    let disabled = true;
	const rowValues: (string | number )[][] = [
		[1, '12345678', 'S Rithesh Product', '4', '1'],
		[2, '12345678', 'Sheerabth Product', '3', '2'],
		[3, '12345678', 'Bharath Product', '2', '3'],
	];
</script>

<div class=" h-screen flex ...">
	<div class="my-auto ...">
        <div class="mx-auto w-3/5 mt-4 mb-2 ...">
            <div class="float-left mr-32 ...">
                <TextInput label="Product ID" placeholder="Search Product by ID or name" defaultValue="ProductId" disabled={disabled}/>
            </div>
            <div class="float-left mr-32 ...">
                <TextInput label="Measurement Unit" placeholder="Search Product by ID or name" defaultValue="cm" disabled={disabled}/>
            </div>
            <div class="float-left ...">
                <Button buttonText="Edit" />
            </div>
            <div class="clear-both mb-4 "></div>
            <div class="float-left mr-32 ...">
                <TextInput label="Product Name" placeholder="Search Product by ID or name" disabled={disabled}/>
            </div>
            <div class="float-left mr-32 ...">
                <TextInput label="Reorder Level" placeholder="Search Product by ID or name" disabled={disabled}/>
            </div>
            <div class="float-left mb-4 ...">
                <Button buttonText="Delete" />
            </div>
            <div class="clear-both mb-4 ...">
                <TextInput label="Price" placeholder="Search Product by ID or name" disabled={disabled}/>
            </div>
        </div>
		<Table {rowValues} {columnNames} />

		
	</div>
</div>
