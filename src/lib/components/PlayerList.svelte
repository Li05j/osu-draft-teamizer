<script lang="ts">
    import { players } from '$lib/stores';

    const osu_url = "https://osu.ppy.sh/users";

    let sortedPlayers = [];
    $: sortedPlayers = [...$players].sort((a, b) => a.rank - b.rank); // Sort by rank
</script>

<div class="overflow-y-auto h-[80vh] p-4">
    {#each sortedPlayers as player}
        <a href={`${osu_url}/${player.user_id}`} target="_blank" class="block">
            <div class="bg-white p-4 mb-4 rounded shadow text-black flex items-center space-x-4 hover:bg-gray-400 hover:shadow-lg transition">
                <img src={player.pfp_url} alt="Profile Pic" class="w-16 h-16 rounded-full" />
                <h3 class="text-lg font-bold">{player.name}</h3>
                <p>Rank: {player.rank}</p>
                <p>pp: {player.pp}</p>
            </div>
        </a>
    {/each}
</div>
  