<script lang="ts">
	export let buttonText: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let onClick: (event?: Event) => any;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="px-4 py-2
text-base font-medium leading-6 whitespace-no-wrap border bg-teal-50 border-gray-500 rounded-md shadow-sm
hover:bg-teal-900 hover:text-white focus:outline-none focus:shadow-none hover:cursor-pointer"
	on:click={onClick}
	on:keypress={onClick}
>
    {buttonText}
</div>