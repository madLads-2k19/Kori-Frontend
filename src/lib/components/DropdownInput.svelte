<script lang="ts">
	// export let label: string = '';
	export let options: string[] = [];
	export let value: string = '';
	export let label: string = '';
</script>

<label>
	{label}
	<input
		list="datalist"
		class="mx-autoplaceholder:text-slate-400 bg-white border w-60
border-slate-300 rounded-md p-2 shadow-sm focus:outline-none focus:border-teal-900
focus:ring-teal-900 focus:ring-1 sm:text-sm disabled:bg-slate-50"
		bind:value
	/>
</label>

<datalist id="datalist">
	{#each options as value}
		<option {value} />
	{/each}
</datalist>
