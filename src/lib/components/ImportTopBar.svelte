<script>
    import { getToastStore } from "@skeletonlabs/skeleton";

    const toastStore = getToastStore()

    let userId = "";

    const submitUserId = async () => {
        // 1. Check if token exists
        let token = localStorage.getItem('guestToken');
        const expiresAt = Number(localStorage.getItem('tokenExpiresAt'));

        // 2. If no token or token is expired
        if (!token || (Date.now() > expiresAt)) {
            console.log("Token doesn't exist or has expired, requesting new token...");
            try {
                const response = await fetch('/api/get_token', { method: 'POST' });
                const data = await response.json();

                console.log(data)

                // Check if we got the token
                if (!data.access_token) throw new Error('Token is null or undefined');
                // Store the token and expiration time
                localStorage.setItem('guestToken', data.access_token);

                const expires_at = Date.now() + Number(data.expires_in) * 1000
                localStorage.setItem('tokenExpiresAt', expires_at.toString());
                
                console.log("New token stored:", token);
            } catch (error) {
                console.error("Failed to fetch new token:", error);
                toastStore.trigger({
                    message: `✗ Failed to fetch new token`,
                    background: 'bg-zinc-800 text-red-400 text-center',
                    timeout: 2500,
                });
                return; // Stop execution if there's an error
            }
        }
        toastStore.trigger({
            message: `✓ User Id submitted: ${userId}`,
            background: 'bg-zinc-800 text-green-400 text-center',
            timeout: 2500,
        })

        userId = "";
    };

    function restrictToNumbers(event) {
        // \D matches anything that's not a digit
        userId = event.target.value.replace(/\D/g, ''); 
    }
</script>
  
<div class="bg-gray-200 p-4 flex justify-between items-center">
    <input
        type="text"
        placeholder="Enter Osu User ID"
        bind:value={userId}
        on:input={restrictToNumbers}
        class="border p-2 rounded text-black placeholder-gray-400"
    />
    <button
        on:click={submitUserId}
        class="bg-blue-500 text-white px-4 py-2 rounded"
    >
        Submit
    </button>
</div>
  