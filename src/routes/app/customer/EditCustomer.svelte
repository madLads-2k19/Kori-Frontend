<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { getContext } from 'svelte';
	import EditCustomerContent from './EditCustomerContent.svelte';
	const { open } = getContext('simple-modal');
	import type { Customer } from './models';

	export let customer: Customer;
	const showContent = () => open(EditCustomerContent, { customer });
</script>

<Button onClick={showContent} buttonText="Edit Customer" />
