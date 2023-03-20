<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { getContext } from 'svelte';
	import type { Customer } from '../billing/models';
	import EditCustomerContent from './EditCustomerContent.svelte';
	const { open } = getContext('simple-modal');

	export let customer: Customer;
	const showContent = () => open(EditCustomerContent, { customer });
</script>

<Button onClick={showContent} buttonText="Edit Customer" />
