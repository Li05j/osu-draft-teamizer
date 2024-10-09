<script lang="ts">
	import type { OsuUserInfo } from '$lib/interfaces';
    import { teams, players } from '$lib/stores';
    import { onMount } from 'svelte';

    let freePlayers: OsuUserInfo[] = [];
    onMount(() => {
        freePlayers = $players;
        freePlayers = [...freePlayers].sort((a, b) => a.rank - b.rank);
    });

    function setCaptain(teamIndex: number, captain: OsuUserInfo) {
        teams.update(currentTeams => {
            currentTeams[teamIndex].captain = captain;
            return currentTeams;
        });
      }

    function addPlayer(teamIndex: number, player: OsuUserInfo) {
        teams.update(currentTeams => {
            currentTeams[teamIndex].players.push(player);
            return currentTeams;
        });
    }
</script>

<div class="bg-gray-800 text-white fixed right-0 top-0 h-screen w-72 overflow-y-auto">
    {#each freePlayers as player}
        <div class="w-72 h-12 p-3 rounded shadow text-black flex flex-shrink-0 items-center space-x-2 bg-white border-2 border-red-900">
            <img src={player.pfp_url} alt="Profile Pic" class="w-10 h-10 rounded-full" />
            <h3 class="text-sm font-bold">{player.name}</h3>
            <h3 class="text-sm font-bold">#{player.rank}</h3>
        </div>
    {/each}
  </div>
  
  