<script lang='ts'>
    import type { OsuTeam, OsuUserInfo } from "$lib/interfaces";
    import { onMount } from 'svelte';
    import { teams, captains } from "$lib/stores";

    export let teamIndex: number;

    let captain: OsuUserInfo;
    let team: OsuTeam;
    $: teams.subscribe($teams => {
        team = $teams[teamIndex];
    });

    onMount(() => {
        if ($captains[teamIndex]) {
            captain = $captains[teamIndex];
        }
    });
</script>

<div class="bg-white p-4 space-y-4 card-hover overflow-hidden max-w-xs">
    <header class="pb-1">
        {#if captain}
            <div class="w-72 h-12 p-3 rounded shadow text-black flex flex-shrink-0 items-center space-x-2 bg-pink-300 border-2">
                <img src={captain.pfp_url} alt="Profile Pic" class="w-10 h-10 rounded-full" />
                <h3 class="text-sm font-bold">{captain.name}</h3>
                <h3 class="text-sm font-bold">#{captain.rank}</h3>
            </div>
        {:else}
            No Captain
        {/if}
    </header>
    <hr class="opacity-50" />
    <section>
        <ul>
            {#each team.players as player}
                <div 
                    class="w-72 h-12 p-3 rounded shadow text-black flex flex-shrink-0 items-center space-x-2 bg-white border-1"
                >   
                    <img src={player.pfp_url} alt="Profile Pic" class="w-10 h-10 rounded-full" />
                    <h3 class="text-sm font-bold">{player.name}</h3>
                    <h3 class="text-sm font-bold">#{player.rank}</h3>
                </div>
            {/each}
      </ul>
    </section>
</div>