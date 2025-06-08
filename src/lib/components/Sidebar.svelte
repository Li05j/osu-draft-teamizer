<script>
    import List from "$lib/assets/List.svg";

    export let toggleSidebarOpen;
    export let switchView;
    export let changeImportType;

    export let sidebar_open;
    export let current_view;
    export let import_type;
</script>

<div class={`bg-gray-800 text-white transition-all duration-300 ease-in-out drop-shadow-2xl ${sidebar_open ? 'w-48' : 'w-16 h-16'}`}>
    <button on:click={() => toggleSidebarOpen()} class="p-4">
        <img src={List} alt={sidebar_open ? "Hide Sidebar" : "Show Sidebar"} class="w-6 h-6" />
    </button>
    {#if sidebar_open}
        <nav class="p-4">
            <ul class="space-y-2">
                <li><button on:click={() => switchView('team_building') } class="block py-2 w-full border-2 border-gray-700 hover:bg-blue-500 hover:shadow-lg transition ${current_view === 'team_building' ? 'bg-blue-500 ring-2 ring-blue-400' : ''}">Build Teams</button></li>
                <li>
                    <button on:click={() => switchView('import')} class="block py-2 w-full border-2 border-gray-700 hover:bg-blue-500 hover:shadow-lg transition ${current_view === 'import' ? 'bg-blue-500 ring-2 ring-blue-400' : ''}">Import Players</button>
                    {#if current_view === 'import'}
                        <ul class="mt-1 mr-8 ml-8 space-y-1 items-center">
                            <li><button on:click={() => changeImportType('draft')} class="block py-1.5 w-full text-sm border border-gray-600 hover:bg-blue-400 hover:shadow-md transition ${import_type === 'draft' ? 'bg-blue-400 ring-1 ring-blue-300' : ''}">Draft</button></li>
                            <li><button on:click={() => changeImportType('random')} class="block py-1.5 w-full text-sm border border-gray-600 hover:bg-blue-400 hover:shadow-md transition ${import_type === 'random' ? 'bg-blue-400 ring-1 ring-blue-300' : ''}">Random</button></li>
                        </ul>
                    {/if}
                </li>
            </ul>
        </nav>
    {/if}
</div>
  