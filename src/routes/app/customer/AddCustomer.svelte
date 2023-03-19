<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { getContext } from 'svelte';
	import AddCustomerContent from './AddCustomerContent.svelte';
	const { open } = getContext('simple-modal');

	const showContent = () => open(AddCustomerContent, {});
</script>

<Button onClick={showContent} buttonText="Add Customer" />
