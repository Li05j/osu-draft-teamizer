<script>
    import List from "$lib/assets/List.svg"

    export let switchView;
    let sidebar_open = true;
</script>

{#if sidebar_open}
<div class={`bg-gray-800 text-white transition-all h-screen w-32`}>
    <button on:click={() => sidebar_open = false} class="p-4">
        <img src={List} alt="Hide Sidebar" class="w-6 h-6" />
    </button>
      
    <nav class="p-4">
        <ul>
            <li><button on:click={() => switchView('draft')} class="block py-2">Draft</button></li>
            <li><button on:click={() => switchView('import')} class="block py-2">Import</button></li>
        </ul>
    </nav>
</div>
{:else}
<div class={`bg-gray-800 text-white transition-all h-screen w-16`}>
    <button on:click={() => sidebar_open = true} class="p-4">
        <img src={List} alt="Show Sidebar" class="w-6 h-6" />
    </button>
</div>
{/if}