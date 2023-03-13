<script lang="ts">
	export let placeholder: string;
	export let label: string;
	export let disabled: boolean = false;
	export let defaultValue: string = '';
</script>

<label
	>{label}
	<input
		class="mx-autoplaceholder:text-slate-400 bg-white border w-60 ml-4
    border-slate-300 rounded-md p-2 shadow-sm focus:outline-none focus:border-teal-900
    focus:ring-teal-900 focus:ring-1 sm:text-sm disabled:bg-slate-50" 
		{placeholder}
		type="text" disabled={disabled} value={defaultValue}
	/>
</label>
