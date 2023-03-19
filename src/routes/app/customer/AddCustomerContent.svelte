<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Checkbox from "$lib/components/Checkbox.svelte";
	import Select from "$lib/components/Select.svelte";
	import TextArea from "$lib/components/TextArea.svelte";
	import TextInput from "$lib/components/TextInput.svelte";



    let memberCheck: boolean;
    let paymentOptions = [
        {
            'name': 'cash',
            'value': 'Cash'
        },
        {
            'name': 'card',
            'value': 'Card'
        }
    ]

    let email: string;
    let is_member: boolean;
    let membership_points: number = 0;
    let address: string;
    let preferred_payment_method = paymentOptions[0].name
    let name: string;
    let phone_number: string

    let disableSubmit: boolean = false;
    let customerCreationSuccess: boolean = false;


    let retry: boolean = false;
    function addProduct(){
        disableSubmit = true
        fetch(
                "https://kori.azurewebsites.net/customer/v1/77b5028d-5082-4dab-bdba-3fdc3fa35509",
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        name,
                        is_member,
                        phone_number,
                        address,
                        preferred_payment_method,
                        membership_points
                    })
                }
            )
            .then(response => {
            if (response.status == 200){
                customerCreationSuccess = true;
                retry = false;
                disableSubmit = true;
            }
            else{
                retry = true;
                disableSubmit = false;
            }
            })
    }
</script>


<div class="p-4">
    <p class="text-2xl mb-4 text-teal-800">New Customer</p>
    <div class="grid grid-cols-2 gap-x-12 gap-y-8 justify-between mb-8">
        <TextInput bind:value={name} label="Name" placeholder="Enter Customer Name" />
        <TextInput bind:value={email} label="Email" placeholder="Enter Email ID" />
        <div>
            <div class="mt-7">
                <Checkbox bind:checked={memberCheck} label="Register as a member"/>
            </div>
        </div>
        <TextInput bind:value={membership_points} disabled={!memberCheck} label="Membership points" placeholder="Enter Membership points" />
        <Select options={paymentOptions} bind:selectedOption={preferred_payment_method} label="Preferred Payment Method" />
        <TextInput bind:value={phone_number} label="Phone Number" placeholder="Enter Phone Number" />
    </div>
    <div class="mb-4">
        <TextArea label="Address" bind:value={address} placeholder="Enter Address" />
    </div>
    
    {#if !disableSubmit}
    <div class="w-24 text-center">
        <Button onClick={addProduct} buttonText="Create"></Button>
    </div>
    {/if}
    {#if disableSubmit}
      {#if customerCreationSuccess}
        <p class="text-green-900">Customer Creation Success, close the popup to continue...</p>
    {/if}
    {/if}
    {#if retry}
    <p class="text-red-800">Customer Creation Failed, retry again</p>
    {/if}

    
</div>
