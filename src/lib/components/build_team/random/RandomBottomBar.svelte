<script lang="ts">
	import { TEAM_SIZE } from '$lib/constants';
	import type { OsuUserInfo } from '$lib/interfaces';
    import { players, captains, player_pairs, teams, addPlayerToTeamSignal, add_pairs_to_team_signal, undoStack, undoSignal } from '$lib/stores';
    import { onMount } from 'svelte';

    let revealed_first = false;

    function handleFirstPairClick() {
        if (!revealed_first) {
            revealed_first = true;
        } else {
            // Send pair to signal and remove from conveyor
            add_pairs_to_team_signal.set(shuffled_pairs[0]);
            shuffled_pairs = shuffled_pairs.slice(1);
            revealed_first = false;
        }
    }

    function handleFirstPlayerClick() {
        if (!revealed_first) {
            revealed_first = true;
        } else {
            // Send player to signal and remove from conveyor
            addPlayerToTeamSignal.set(shuffled_players[0]);
            shuffled_players = shuffled_players.slice(1);
            revealed_first = false;
        }
    }

    let shuffled_pairs: [OsuUserInfo, OsuUserInfo][] = [];
    let shuffled_players: OsuUserInfo[] = [];

    // Fisher-Yates shuffle algorithm
    function shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    $: shuffled_pairs = shuffleArray($player_pairs);

        // Excluding those already in pairs
    $: {
        const players_in_pairs = new Set<string>();
        $player_pairs.forEach(([p1, p2]) => {
            players_in_pairs.add(p1.user_id);
            players_in_pairs.add(p2.user_id);
        });

        // Combine players + captains then filter out those in pairs
        const all_players = [...$players, ...$captains];
        const remaining_players = all_players.filter(player => !players_in_pairs.has(player.user_id));
        shuffled_players = shuffleArray(remaining_players);
    }

    // Helper to count players by tier in a team
    function getTeamTierCounts(team: any): Record<string, number> {
        const counts: Record<string, number> = {};
        team.players.forEach((player: OsuUserInfo) => {
            counts[player.tier] = (counts[player.tier] || 0) + 1;
        });
        return counts;
    }

    // Find eligible teams for a pair
    function findEligibleTeamsForPair(currentTeams: any[], player1: OsuUserInfo, player2: OsuUserInfo): number[] {
        const eligibleTeams: number[] = [];

        currentTeams.forEach((team, index) => {
            // Check if team has space for 2 more players
            if (team.players.length + 2 > TEAM_SIZE) return;

            const tierCounts = getTeamTierCounts(team);

            // Check if adding both players would violate tier constraints (max 2 per tier)
            const newTier1Count = (tierCounts[player1.tier] || 0) + 1;
            const newTier2Count = (tierCounts[player2.tier] || 0) + (player1.tier === player2.tier ? 1 : 0);

            if (newTier1Count <= 2 && newTier2Count <= 2) {
                eligibleTeams.push(index);
            }
        });

        return eligibleTeams;
    }

    // Find eligible teams for a single player
    function findEligibleTeamsForPlayer(currentTeams: any[], player: OsuUserInfo): number[] {
        const eligibleTeams: number[] = [];

        currentTeams.forEach((team, index) => {
            // Check if team has space for 1 more player
            if (team.players.length + 1 > TEAM_SIZE) return;

            const tierCounts = getTeamTierCounts(team);

            // Check if adding this player would violate tier constraint (max 2 per tier)
            const newTierCount = (tierCounts[player.tier] || 0) + 1;

            if (newTierCount <= 2) {
                eligibleTeams.push(index);
            }
        });

        return eligibleTeams;
    }

    function selectRandomTeam(eligibleTeams: number[]): number {
        if (eligibleTeams.length === 0) return -1;
        return eligibleTeams[Math.floor(Math.random() * eligibleTeams.length)];
    }

    $: if ($add_pairs_to_team_signal) {
        const [player1, player2] = $add_pairs_to_team_signal;
        
        teams.update(current_teams => {
            const eligible_teams = findEligibleTeamsForPair(current_teams, player1, player2);
            const selected_team_index = selectRandomTeam(eligible_teams);
            
            if (selected_team_index !== -1) {
                current_teams[selected_team_index].players.push(player1, player2);
                console.log(`Added pair to team ${selected_team_index}`); // TODO: Replace these with toast
            } else {
                console.warn('No eligible teams found for pair:', player1.tier, player2.tier);
            }
            
            return current_teams;
        });
        
        // Reset signal
        // add_pairs_to_team_signal.set(null);
    }

    $: if ($addPlayerToTeamSignal) {
        const player = $addPlayerToTeamSignal;
        
        teams.update(current_teams => {
            const eligible_teams = findEligibleTeamsForPlayer(current_teams, player);
            const selected_team_index = selectRandomTeam(eligible_teams);

            if (selected_team_index !== -1) {
                current_teams[selected_team_index].players.push(player);
                console.log(`Added player (${player.tier}) to team ${selected_team_index}`);
            } else {
                console.warn('No eligible teams found for player:', player.tier);
            }

            return current_teams;
        });

        // Reset signal
        // addPlayerToTeamSignal.set(null);
    }

</script>

<div class="bg-white rounded drop-shadow-2xl fixed bottom-0 left-0 right-0 w-full h-20 mx-auto transition-all space-x-2 flex justify-start items-center overflow-x-auto px-4 border-2 border-red-900">
    {#each shuffled_pairs as pair, index}
        {#if index == 0}
            <button 
                class="w-160 h-12 p-3 rounded shadow drop-shadow-2xl text-black flex flex-shrink-0 items-center justify-between space-x-2 {revealed_first ? 'bg-blue-300 border-2 border-blue-500' : 'bg-gray-400 border-2 border-gray-600'}"
                on:click={handleFirstPairClick}
            >
                {#if revealed_first}
                    <div class="flex items-center space-x-2">
                        <img src={pair[0].pfp_url} alt="Profile Pic" class="w-9 h-9 rounded-full" />
                        <h3 class="text-sm font-bold">T{pair[0].tier}</h3>
                        <h3 class="text-sm font-bold">{pair[0].name}</h3>
                    </div>
                    <div class="flex items-center space-x-2">
                        <img src={pair[1].pfp_url} alt="Profile Pic" class="w-9 h-9 rounded-full" />
                        <h3 class="text-sm font-bold">T{pair[1].tier}</h3>
                        <h3 class="text-sm font-bold">{pair[1].name}</h3>
                    </div>
                    <span class="text-yellow-600 text-lg">⭐</span>
                {:else}
                    <span class="text-white font-bold w-80 h-12 text-center flex items-center justify-center">Reveal!</span>

                {/if}
            </button>
        {:else}
            <div class="w-80 h-12 p-3 rounded shadow flex flex-shrink-0 items-center justify-center bg-gray-500 border-2 border-gray-700">
                <span class="text-gray-300 font-bold">???</span>
            </div>
        {/if}
    {/each}

    {#each shuffled_players as player, index}
        {#if index == 0 && shuffled_pairs.length === 0}
            <button 
                class="w-56 h-12 p-3 rounded shadow drop-shadow-2xl text-black flex flex-shrink-0 items-center justify-between space-x-2 {revealed_first ? 'bg-blue-300 border-2 border-blue-500' : 'bg-gray-400 border-2 border-gray-600'}"
                on:click={handleFirstPlayerClick}
            >
                {#if revealed_first}
                    <div class="flex items-center space-x-2">
                        <img src={player.pfp_url} alt="Profile Pic" class="w-9 h-9 rounded-full" />
                        <h3 class="text-sm font-bold">{player.name}</h3>
                    </div>
                    <span class="text-yellow-600 text-lg">⭐</span>
                {:else}
                    <span class="text-white font-bold mx-auto">Reveal!</span>
                {/if}
            </button>
        {:else}
            <div class="w-56 h-12 p-3 rounded shadow flex flex-shrink-0 items-center justify-center bg-gray-500 border-2 border-gray-700">
                <span class="text-gray-300 font-bold">???</span>
            </div>
        {/if}
    {/each}
</div>
