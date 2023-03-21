<svelte:options accessors />

<script lang="ts">
	export let placeholder: string;
	export let disabled: boolean = false;
	export let value: any = '';
	export let type: string = 'text';
	export let label: string = '';
	export let handleKeyDown = () => {};

	function typeAction(node: HTMLInputElement) {
		node.type = type;
	}
</script>

{#if label != ''}
	<label>
		{label}
		<input
			class="mx-autoplaceholder:text-slate-400 bg-white border w-60
	border-slate-300 rounded-md p-2 shadow-sm focus:outline-none focus:border-teal-900
	focus:ring-teal-900 focus:ring-1 sm:text-sm disabled:bg-slate-50 ml-2"
			{placeholder}
			{disabled}
			use:typeAction
			bind:value
			on:keydown={handleKeyDown}
		/>
	</label>
{:else}
	<label>
		{label}
		<input
			class="mx-autoplaceholder:text-slate-400 bg-white border w-60
	border-slate-300 rounded-md p-2 shadow-sm focus:outline-none focus:border-teal-900
	focus:ring-teal-900 focus:ring-1 sm:text-sm disabled:bg-slate-50"
			{placeholder}
			{disabled}
			use:typeAction
			bind:value
			on:keydown={handleKeyDown}
		/>
	</label>
{/if}
