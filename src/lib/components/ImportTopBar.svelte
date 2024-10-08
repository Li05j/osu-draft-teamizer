<script>
    let userId = "";

    const dummyCallback = () => {
        console.log(`User ID submitted: ${userId}`);
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
        on:click={dummyCallback}
        class="bg-blue-500 text-white px-4 py-2 rounded"
    >
        Submit
    </button>
</div>
  