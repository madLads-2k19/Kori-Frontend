<script lang="ts">
	export let label: string;
</script>

<div class="inline-flex items-center align-middle ...">
	<input
		id="default-checkbox"
		type="checkbox"
		value=""
		class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded
     focus:ring-teal-500 dark:focus:ring-teal-600
     dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
	/>
	<label for="default-checkbox" class="ml-2 text-sm font-medium">{label}</label>
</div>
