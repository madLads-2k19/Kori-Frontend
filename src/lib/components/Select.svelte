<script lang="ts">
    type optionType = {
        name: string;
        value: string;
    }

    export let options: optionType[];
    export let label: string;

    export let selectedOption: string;
</script>



<label>{label}
    <select class="mx-autoplaceholder:text-slate-400 bg-white border w-60
    border-slate-300 rounded-md p-2 shadow-sm focus:outline-none focus:border-teal-900
    focus:ring-teal-900 focus:ring-1 sm:text-sm disabled:bg-slate-50" name="pets" id="pet-select" bind:value={selectedOption}>
        {#each options as option}
            <option value={option.name}>{option.value}</option>
        {/each}
    </select>
</label>
