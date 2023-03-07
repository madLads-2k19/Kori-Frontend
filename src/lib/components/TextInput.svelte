<script lang="ts">
    export let placeholder: string;
    export let label: string;
</script>


<label>{label}
    <input class="mx-autoplaceholder:text-slate-400 bg-white border w-60 ml-4
    border-slate-300 rounded-md p-2 shadow-sm focus:outline-none focus:border-teal-900
    focus:ring-teal-900 focus:ring-1 sm:text-sm" placeholder={placeholder} type="text"/> 
</label>