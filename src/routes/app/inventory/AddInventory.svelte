<script>
	import Button from '$lib/components/Button.svelte';
    import { getContext } from 'svelte';
    import AddProductContent from './AddInventoryContent.svelte';
    const { open } = getContext('simple-modal');


    const showContent = () => open(AddProductContent, {});
  </script>
  

<Button onClick={showContent} buttonText="Add Product" />