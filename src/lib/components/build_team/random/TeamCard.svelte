<script lang='ts'>
    import type { OsuTeam, OsuUserInfo } from "$lib/interfaces";
    import { onMount } from 'svelte';
    import { teams, captains, add_pairs_to_team_signal, addPlayerToTeamSignal, undoSignal } from "$lib/stores";

    export let teamIndex: number;

    let team: OsuTeam;
    $: teams.subscribe($teams => {
        team = $teams[teamIndex];
    });
</script>

<div class="bg-white p-4 space-y-4 card-hover overflow-hidden max-w-xs">
    <hr class="h-1 bg-black border-0 opacity-75" />
    <section>
        <ul>
            {#each team.players.slice().sort((a, b) => a.tier - b.tier) as player}
                <div
                    class="w-72 h-10 p-3 rounded shadow text-black flex flex-shrink-0 items-center space-x-2 border-1 {
                        ($add_pairs_to_team_signal && ($add_pairs_to_team_signal[0] === player || $add_pairs_to_team_signal[1] === player)) ||
                        ($addPlayerToTeamSignal && $addPlayerToTeamSignal === player)
                            ? 'bg-pink-300 border-1' 
                            : 'bg-white border-1'
                    }"
                >
                <!-- <div 
                    class="w-72 h-10 p-3 rounded shadow text-black flex flex-shrink-0 items-center space-x-2 bg-white border-1"
                >    -->
                    <img src={player.pfp_url} alt="Profile Pic" class="w-8 h-8 rounded-full" />
                    <h3 class="text-sm font-bold">T{player.tier}</h3>
                    <h3 class="text-sm font-bold">{player.name}</h3>
                    <h3 class="text-sm font-bold">#{player.rank}</h3>
                </div>
            {/each}
      </ul>
    </section>
</div>