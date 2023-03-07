<script lang="ts">
    export let columnNames: string[];

    export let rowValues: (string | number)[][];
</script>


<table class="font-sans mx-auto table-fixed border-collapse border overflow-auto w-3/5 rounded-sm Lato font-light ...">
    <tbody>
      <tr class="bg-teal-900 text-white border ...">
        {#each columnNames as columnName}
            <td>{columnName}</td>
        {/each}
      </tr>
      {#each rowValues as row}
        <tr class="odd:bg-teal-50 hover-bg-stone-100 ...">
            {#each row as rowValue}
                <td>{rowValue}</td>
            {/each}
        </tr>
      {/each}
    </tbody>
</table>


<style>
  td {
      padding: 0.2em;
      text-align: center;
  }
</style>