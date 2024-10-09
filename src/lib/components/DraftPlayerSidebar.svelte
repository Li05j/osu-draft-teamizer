<script lang="ts">
	import type { OsuUserInfo } from '$lib/interfaces';
    import { teams, players, nextTurn } from '$lib/stores';
    import { onMount } from 'svelte';

    let freePlayers: OsuUserInfo[] = [];
    onMount(() => {
        freePlayers = $players;
        freePlayers = [...freePlayers].sort((a, b) => a.rank - b.rank);
    });

    function playerSelected(player: OsuUserInfo, teamIndex: number) {
        addPlayer(player, teamIndex);
        notifyCaptains();
    }

    function addPlayer(player: OsuUserInfo, teamIndex: number) {
        teams.update(currentTeams => {
            currentTeams[teamIndex].players.push(player);
            return currentTeams;
        });
    }

    function notifyCaptains() {
        nextTurn.set(true);
    }
</script>

<div class="bg-gray-800 text-white fixed right-0 top-0 h-screen w-72 overflow-y-auto">
    {#each freePlayers as player, index}
        <button 
            class="w-72 h-12 p-3 rounded shadow text-black flex flex-shrink-0 items-center space-x-2 bg-white border-2 border-red-900 hover:bg-gray-400 hover:shadow-lg "
            on:click={() => playerSelected(player, index)}
        >
            <img src={player.pfp_url} alt="Profile Pic" class="w-10 h-10 rounded-full" />
            <h3 class="text-sm font-bold">{player.name}</h3>
            <h3 class="text-sm font-bold">#{player.rank}</h3>
        </button>
    {/each}
  </div>
  
  