<script lang="ts">
    export let placeholder: string
</script>

<label for="address-box" class="block mb-2 ...">Delivery Address</label>
<textarea id="address-box" rows="4" class="resize-none mx-autoplaceholder:text-slate-400 w-96 bg-white border 
        border-slate-300 rounded-md p-2 shadow-sm focus:outline-none focus:border-teal-900
        focus:ring-teal-900 focus:ring-1 sm:text-sms" placeholder={placeholder}>
</textarea>