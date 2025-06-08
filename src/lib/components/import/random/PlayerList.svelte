<script lang="ts">
    import { players, player_pairs } from '$lib/stores';
    import type { OsuUserInfo } from "$lib/interfaces";

    const osu_url = "https://osu.ppy.sh/users";

    function calculateTiers(players: OsuUserInfo[]): OsuUserInfo[] {
        const sorted_by_rank = [...players].sort((a, b) => a.rank - b.rank);
        const manual_players = players.filter(p => p.manual_tier);
        const auto_players = sorted_by_rank.filter(p => !p.manual_tier);

        // Count manual players per tier
        const manual_counts = [0, 0, 0, 0];
        manual_players.forEach(p => manual_counts[p.tier - 1]++);

        // Calculate available slots per tier
        const tier_limits = [16, 16, 16, Infinity];
        const available_slots = tier_limits.map((limit, i) => Math.max(0, limit - manual_counts[i]));

        // Assign tiers to auto players
        let tier_index = 0;
        let current_tier_count = 0;

        auto_players.forEach(player => {
            while (current_tier_count >= available_slots[tier_index] && tier_index < 3) {
                tier_index++;
                current_tier_count = 0;
            }

            player.tier = tier_index + 1;
            current_tier_count++;
        });

        return [...manual_players, ...auto_players];
    }

    function updatePlayerTier(player_id: string, new_tier: number) {
        players.update(current_players => 
            current_players.map(player => 
                player.user_id === player_id 
                    ? { ...player, tier: new_tier, manual_tier: true }
                    : player
            )
        );
    }
    let tiered_players = [];
    $: tiered_players = calculateTiers($players);

    // Calculate tiers for pairs too
    let tiered_pairs = [];
    $: tiered_pairs = $player_pairs.map(pair => [
        tiered_players.find(p => p.user_id === pair[0].user_id) || pair[0],
        tiered_players.find(p => p.user_id === pair[1].user_id) || pair[1]
    ]);

    let paired_player_ids = new Set();
    $: {
        paired_player_ids = new Set();
        pairs.forEach(pair => {
            paired_player_ids.add(pair[0].user_id);
            paired_player_ids.add(pair[1].user_id);
        });
    }

    $: sorted_players = tiered_players
        .filter(player => !paired_player_ids.has(player.user_id))
        .sort((a, b) => a.rank - b.rank);
    
    $: pairs = tiered_pairs;

    let binding_mode = false;
    let selected_player_id: string = "";

    function unbind_pair(id: string) {
        const pair_index = pairs.findIndex(pair => 
            pair[0].user_id === id || pair[1].user_id === id
        );

        if (pair_index === -1) return; // Not paired
        player_pairs.update(currentPairs => 
            currentPairs.filter((_, index) => index !== pair_index)
        );
    }

    function try_to_bind_pair(id: string) {
        binding_mode = true;
        selected_player_id = id;
    }

    function cancel_bind() {
        binding_mode = false;
        selected_player_id = "";
    }

    function bind_with_player(targetId: string) {
        if (!selected_player_id) return;
        
        const selectedPlayer = $players.find(p => p.user_id === selected_player_id);
        const targetPlayer = $players.find(p => p.user_id === targetId);
        
        if (selectedPlayer && targetPlayer) {
            player_pairs.update(currentPairs => [...currentPairs, [selectedPlayer, targetPlayer]]);
        }

        // Reset binding mode
        binding_mode = false;
        selected_player_id = "";
    }

</script>

<div class="overflow-y-auto h-[90vh] p-4 bg-gray-800">
    {#each pairs as pair}
        <div class="p-4 mb-4 rounded shadow text-black flex justify-between items-center space-x-4 hover:bg-gray-400 hover:shadow-lg transition bg-pink-300">
            <div class="flex space-x-4 items-center">
                <a href={`${osu_url}/${pair[0].user_id}`} target="_blank" class="block" >
                    <img src={pair[0].pfp_url} alt="Profile Pic" class="w-16 h-16 rounded-full" />
                </a>
                <h3 class="text-lg font-bold">{pair[0].name}</h3>
                <p>Rank: {pair[0].rank}</p>
                <p>pp: {pair[0].pp}</p>
                <p>Id: {pair[0].user_id}</p>
                <select class="select text-white w-24" bind:value={pair[0].tier} on:change={() => updatePlayerTier(pair[0].user_id, pair[0].tier)}>
                    <option value={1}>Tier 1</option>
                    <option value={2}>Tier 2</option>
                    <option value={3}>Tier 3</option>
                    <option value={4}>Tier 4</option>
                </select>
            </div>
            <div class="flex space-x-4 items-center">
                <a href={`${osu_url}/${pair[1].user_id}`} target="_blank" class="block" >
                    <img src={pair[1].pfp_url} alt="Profile Pic" class="w-16 h-16 rounded-full" />
                </a>
                <h3 class="text-lg font-bold">{pair[1].name}</h3>
                <p>Rank: {pair[1].rank}</p>
                <p>pp: {pair[1].pp}</p>
                <p>Id: {pair[1].user_id}</p>
                <select class="select text-white w-24" bind:value={pair[1].tier} on:change={() => updatePlayerTier(pair[1].user_id, pair[1].tier)}>
                    <option value={1}>Tier 1</option>
                    <option value={2}>Tier 2</option>
                    <option value={3}>Tier 3</option>
                    <option value={4}>Tier 4</option>
                </select>
            </div>
            <!-- We only need to check one of the two players in the pair -->
            {#if !binding_mode}
                <button on:click={() => unbind_pair(pair[0].user_id)} class="ml-4 bg-blue-500 text-white px-2 py-1 rounded">
                    Unbind Pair
                </button>
            {/if}
        </div>
    {/each}
 
    
    {#each sorted_players as player}
        <div class="p-4 mb-4 rounded shadow text-black flex justify-between items-center space-x-4 hover:shadow-lg transition"
             class:bg-white={!binding_mode || player.user_id === selected_player_id}
             class:bg-blue-300={binding_mode && player.user_id !== selected_player_id}>
            
            <div class="flex space-x-4 items-center">
                <a href={`${osu_url}/${player.user_id}`} target="_blank" class="block" >
                    <img src={player.pfp_url} alt="Profile Pic" class="w-16 h-16 rounded-full" />
                </a>
                <h3 class="text-lg font-bold">{player.name}</h3>
                <p>Rank: {player.rank}</p>
                <p>pp: {player.pp}</p>
                <p>Id: {player.user_id}</p>
                <select class="select text-white w-24" bind:value={player.tier} on:change={() => updatePlayerTier(player.user_id, player.tier)}>
                    <option value={1}>Tier 1</option>
                    <option value={2}>Tier 2</option>
                    <option value={3}>Tier 3</option>
                    <option value={4}>Tier 4</option>
                </select>
            </div>
            
            {#if binding_mode && player.user_id === selected_player_id}
                <button on:click={cancel_bind} class="ml-4 bg-red-500 text-white px-2 py-1 rounded">
                    Cancel Bind
                </button>
            {:else if binding_mode}
                <button on:click={() => bind_with_player(player.user_id)} class="ml-4 bg-green-500 text-white px-2 py-1 rounded">
                    Bind with this player!
                </button>
            {:else}
                <button on:click={() => try_to_bind_pair(player.user_id)} class="ml-4 bg-blue-500 text-white px-2 py-1 rounded">
                    Bind with...
                </button>
            {/if}
        </div>
    {/each}
</div>
