<script lang="ts">
	import Toast from '$lib/components/Toast.svelte';
	import '../app.css';

	export let user = 'Mechy';
</script>

<Toast />
<slot />
