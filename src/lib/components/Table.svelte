<script lang="ts">
	export let columnNames: string[];
	export let rowValues: (string | number)[][];
	export let handleRowSelect = (row) => {};
</script>

<table
	class="font-sans mx-auto table-auto border-collapse border overflow-auto w-full rounded-sm font-light ..."
>
	<thead>
		<tr class="bg-teal-500 text-white border ...">
			{#each columnNames as columnName}
				<th>{columnName}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each rowValues as row}
			<tr
				on:click={() => handleRowSelect(row)}
				class="odd:bg-teal-50 hover:bg-teal-100 cursor-pointer ..."
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
