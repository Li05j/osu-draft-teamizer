<script>
    import List from "$lib/assets/List.svg";

    export let toggleSidebarOpen;
    export let switchView;

    export let sidebar_open;
</script>

<div class={`bg-gray-800 text-white transition-all duration-300 ease-in-out drop-shadow-2xl ${sidebar_open ? 'w-48 h-48' : 'w-16 h-16'}`}>
    <button on:click={() => toggleSidebarOpen()} class="p-4">
        <img src={List} alt={sidebar_open ? "Hide Sidebar" : "Show Sidebar"} class="w-6 h-6" />
    </button>
    {#if sidebar_open}
        <nav class="p-4">
            <ul>
                <li><button on:click={() => switchView('draft')} class="block py-2 w-full border-2 border-gray-700 hover:bg-blue-500 hover:shadow-lg transition">Draft</button></li>
                <li><button on:click={() => switchView('import')} class="block py-2 w-full border-2 border-gray-700 hover:bg-blue-500 hover:shadow-lg transition">Import</button></li>
            </ul>
        </nav>
    {/if}
</div>
  