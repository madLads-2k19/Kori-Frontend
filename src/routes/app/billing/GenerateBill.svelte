<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { getContext } from 'svelte';
	import GenerateBillContent from './GenerateBillContent.svelte';
	const { open } = getContext('simple-modal');
    export let customerBillId = ''
	const showContent = () => open(GenerateBillContent, {customerBillId});
</script>

<Button onClick={showContent} buttonText="Generate Bill" />
