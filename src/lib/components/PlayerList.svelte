<script lang="ts">
    import { players, captains } from '$lib/stores';

    const osu_url = "https://osu.ppy.sh/users";

    let sortedPlayers = [];
    $: sortedPlayers = [...$players].sort((a, b) => a.rank - b.rank); // Sort by rank
    $: teamCaptains = $captains;

    function toggleCaptain(id: string) {
        // Check if the player is already a captain
        const isAlreadyCaptain = teamCaptains.some(captain => captain.user_id === id);
        if (isAlreadyCaptain) {
            // Remove from captains and add back to players
            const captainToRemove = teamCaptains.find(captain => captain.user_id === id);
            if (!captainToRemove) {
                return;
            }
            captains.set(teamCaptains.filter(captain => captain.user_id !== id));
            players.update(currentPlayers => [...currentPlayers, captainToRemove]);
        } else {
            // Move from players to captains
            const playerToPromote = $players.find(player => player.user_id === id);
            if (!playerToPromote) {
                return;
            }
            players.update(currentPlayers => currentPlayers.filter(player => player.user_id !== id));
            captains.update(currentCaptains => [...currentCaptains, playerToPromote]);
        }
        return;
    }
</script>

<div class="overflow-y-auto h-[80vh] p-4">
    {#each teamCaptains as captain}
        <div class="p-4 mb-4 rounded shadow text-black flex justify-between items-center space-x-4 hover:bg-gray-400 hover:shadow-lg transition bg-pink-300">
            <div class="flex space-x-4 items-center">
                <a href={`${osu_url}/${captain.user_id}`} target="_blank" class="block" >
                    <img src={captain.pfp_url} alt="Profile Pic" class="w-16 h-16 rounded-full" />
                </a>
                <h3 class="text-lg font-bold">{captain.name}</h3>
                <p>Rank: {captain.rank}</p>
                <p>pp: {captain.pp}</p>
                <p>Id: {captain.user_id}</p>
            </div>
            
            <button on:click={() => toggleCaptain(captain.user_id)} class="ml-4 bg-blue-500 text-white px-2 py-1 rounded">
                Unset Captain
            </button>
        </div>
    {/each}
    {#each sortedPlayers as player}
        <div class="bg-white p-4 mb-4 rounded shadow text-black flex justify-between items-center space-x-4 hover:bg-gray-400 hover:shadow-lg transition">
            <div class="flex space-x-4 items-center">
                <a href={`${osu_url}/${player.user_id}`} target="_blank" class="block" >
                    <img src={player.pfp_url} alt="Profile Pic" class="w-16 h-16 rounded-full" />
                </a>
                <h3 class="text-lg font-bold">{player.name}</h3>
                <p>Rank: {player.rank}</p>
                <p>pp: {player.pp}</p>
                <p>Id: {player.user_id}</p>
            </div>
            
            <button on:click={() => toggleCaptain(player.user_id)} class="ml-4 bg-blue-500 text-white px-2 py-1 rounded">
                Set Captain
            </button>
        </div>
    {/each}
</div>
  