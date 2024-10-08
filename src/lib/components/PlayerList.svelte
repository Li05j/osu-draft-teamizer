<script lang="ts">
    // import { players } from '$lib/stores';
    export let players = [];
</script>

<div class="overflow-y-auto h-[80vh] p-4">
    {#each players as player}
        <div class="bg-white p-4 mb-4 rounded shadow text-black">
            <h3 class="text-lg font-bold">{player.name}</h3>
            <p>User ID: {player.id}</p>
        </div>
    {/each}
</div>
  