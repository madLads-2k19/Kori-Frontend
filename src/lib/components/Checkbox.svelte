<script lang="ts">
	export let label: string;
	export let checked: boolean = false;
</script>

<div>
	<div class="mt-2...">
		<input
			type="checkbox"
			name="yes"
			class="w-4 h-4 bg-slate-50 hover:bg-teal-700 checked:bg-teal-500 cursor-pointer ..."
			bind:checked
		/>
		<label for="Checkbox-three" class="ml-2">{label}</label>
	</div>
</div>
