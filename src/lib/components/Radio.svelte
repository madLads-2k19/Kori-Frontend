<script lang="ts">
	export let label: string;
</script>

<div>
	<div class="mt-2 ...">
		<input
			type="radio"
			name="radio"
			class="w-4 h-4 bg-slate-50 hover:bg-teal-700 checked:bg-teal-500 cursor-pointer ..."
		/>
		<label for="radio-three" class="ml-2">{label}</label>
	</div>
</div>
