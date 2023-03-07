<script lang="ts">
	import Button from "../../lib/components/Button.svelte";
  import Table from "../../lib/components/Table.svelte";
  import TextArea from "../../lib/components/TextArea.svelte";
  import TextInput from "../../lib/components/TextInput.svelte";
  import Radio from "../../lib/components/Radio.svelte";

  const columnNames: string[] = ['S.no', 'Item', 'Price', 'Quantity', 'Amount']

  const rowValues: (string | number)[][] = [
    [1, 'Sheerabth Fungal Cream', 100, 1, 100],
    [1, 'Mechy Olive Oil 1 Ltr', 100, 1, 100],
    [1, 'Bharath Ghee 1 Ltr', 100, 1, 100],
  ]

</script>


<div class=" h-screen flex ...">
  <div class="my-auto ...">
      <Table rowValues={rowValues} columnNames={columnNames}/>

      <div class="mx-auto w-3/5 mt-4 ...">
        <div class="float-left mr-24 ...">
          <TextInput placeholder="10 digit number" label="Customer Ph Number"/>
        </div>
        <div class="float-left mr-24 ...">
          <Radio label="Home Delivery"/>
        </div>
        <div class="float-left ...">
          <TextInput placeholder="Amount" label="Delivery Charges"/>
        </div>
        <div class="clear-both ..."></div>
        <div class="float-left mt-8 ...">
          <TextInput placeholder="Discount" label="Discount Price"/>
        </div>
        <div class="float-right mt-8 ...">
          <TextArea placeholder=""/>
        </div>

        <div class="clear-both ..."></div>

        <div class="float-right">
          <Button buttonText="Collect Payment"/>
        </div>
        <div class="float-left">
          <Button buttonText="Register Member/Deduct Points"/>
        </div>

        <div class="clear-both"></div>
      </div>
  </div>
</div>
