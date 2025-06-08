<script lang="ts">
	import type { OsuUserInfo } from '$lib/interfaces';
    import { players, add_pairs_to_team_signal, addPlayerToTeamSignal, undoSignal } from '$lib/stores';
    import { onMount } from 'svelte';

    let freePlayers: OsuUserInfo[] = [];
    $: {
        freePlayers = [...$players].sort((a, b) => a.tier - b.tier);
    }

    // Remove single player when signal emitted
    $: if ($addPlayerToTeamSignal) {
        console.log("Player removed from free players:", $addPlayerToTeamSignal);
        freePlayers = freePlayers.filter(p => p.user_id !== $addPlayerToTeamSignal.user_id);
    }

    // Remove pair when signal emitted
    $: if ($add_pairs_to_team_signal) {
        console.log("Player removed from free players:", $add_pairs_to_team_signal);
        const [player1, player2] = $add_pairs_to_team_signal;
        freePlayers = freePlayers.filter(p => p.user_id !== player1.user_id && p.user_id !== player2.user_id);
    }
</script>

<div class="bg-gray-800 text-white fixed right-0 top-0 h-screen w-72 overflow-y-auto">
    {#each freePlayers as player}
        <div
            class="w-72 h-12 p-3 rounded shadow text-black flex flex-shrink-0 items-center space-x-2 bg-white border-2 border-red-900 hover:bg-gray-400 hover:shadow-lg "
        >
            <img src={player.pfp_url} alt="Profile Pic" class="w-10 h-10 rounded-full" />
            <h3 class="text-sm font-bold">T{player.tier}</h3>
            <h3 class="text-sm font-bold">{player.name}</h3>
            <h3 class="text-sm font-bold">#{player.rank}</h3>
        </div>
    {/each}
</div>
  
  