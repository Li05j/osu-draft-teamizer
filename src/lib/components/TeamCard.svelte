<script lang='ts'>
    import type { OsuTeam, OsuUserInfo } from "$lib/interfaces";
    import { teams } from "$lib/stores";

    export let teamIndex: number;
    let team: OsuTeam;
    $: teams.subscribe($teams => {
        team = $teams[teamIndex];
    });
</script>

<div class="bg-white p-4 space-y-4 card-hover overflow-hidden max-w-xs">
    <header>{team?.captain ? team.captain.name : 'No Captain'}</header>
    <hr class="opacity-50" />
    <section>
        <h6>Players:</h6>
        <ul>
            {#each team.players as player}
                <li>{player.name}</li>
            {/each}
      </ul>
    </section>
</div>