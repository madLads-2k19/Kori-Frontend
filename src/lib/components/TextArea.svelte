<script lang="ts">
	export let placeholder: string;
	export let value: string = '';
	export let label: string = '';
	export let disabled: boolean = false;
</script>

<label for="address-box" class="block mb-2 ...">{label}</label>
<textarea
	id="address-box"
	rows="4"
	class="resize-none mx-autoplaceholder:text-slate-400 w-96 bg-white border 
        border-slate-300 rounded-md p-2 shadow-sm focus:outline-none focus:border-teal-900
        focus:ring-teal-900 focus:ring-1 sm:text-sms disabled:bg-slate-50"
	{placeholder}
	bind:value
	{disabled}
/>
