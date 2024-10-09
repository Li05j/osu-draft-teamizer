<script>
    import List from "$lib/assets/List.svg";

    export let switchView;
    let sidebar_open = true;
</script>

<div class={`bg-gray-800 text-white transition-all duration-300 ease-in-out h-screen drop-shadow-2xl ${sidebar_open ? 'w-32' : 'w-16'}`}>
    <button on:click={() => sidebar_open = !sidebar_open} class="p-4">
        <img src={List} alt={sidebar_open ? "Hide Sidebar" : "Show Sidebar"} class="w-6 h-6" />
    </button>
    {#if sidebar_open}
        <nav class="p-4">
            <ul>
                <li><button on:click={() => switchView('draft')} class="block py-2">Draft</button></li>
                <li><button on:click={() => switchView('import')} class="block py-2">Import</button></li>
            </ul>
        </nav>
    {/if}
</div>
  