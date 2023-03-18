<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
</script>

<div class="h-screen flex bg-teal-800 ...">
	<div class="my-auto border border-slate-200 mx-auto bg-white rounded-md ...">
        <div class="p-8">
            <p class="text-5xl text-center mb-4 text-teal-900 ...">Kori</p>
            <p class="text-xl text-center mb-4 ...">Welcome</p>
            <p class="text-center mb-2">Register to use Kori</p>
            <div class="mb-4">
                <p class="text-gray-500">Email</p>
                <TextInput placeholder="Enter your username"/>    
            </div>
            <div class="mb-4">
                <p class="text-gray-500">Password</p>
                <TextInput placeholder="Enter your username" isSecret={true} />
            </div>
            <div class="mb-8">
                <p class="text-gray-500">Organisation ID</p>
                <TextInput placeholder="Enter your Organisation ID"/>
            </div>
            <div class="text-center">
                <Button buttonText="Register"></Button>    
            </div>
        </div>
    </div>
</div>