<script lang="ts">
	export let buttonText: string;
	export let onClick: Function;
</script>

<div
	class="px-4 py-2
text-base font-medium leading-6 whitespace-no-wrap border bg-teal-50 border-gray-500 rounded-md shadow-sm
hover:bg-teal-900 hover:text-white focus:outline-none focus:shadow-none hover:cursor-pointer"
	on:click={onClick}
>
	{buttonText}
</div>
