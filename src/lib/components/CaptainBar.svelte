<script lang="ts">
	import type { OsuUserInfo } from '$lib/interfaces';
    import { captains } from '$lib/stores';
    import { onMount } from 'svelte';

    const TEAM_SIZE = 8;

    let teamCaptains: OsuUserInfo[] = [];
    onMount(() => {
        captains.subscribe($captains => {
            const tempCaptains: OsuUserInfo[] = [];
            for (let i = 0; i < TEAM_SIZE - 1; i++) {
                $captains.forEach(captain => {
                    tempCaptains.push(captain);
                });
            }
            teamCaptains = tempCaptains; // Reassign to trigger reactivity
        });
    });

</script>

<div class="bg-white rounded drop-shadow-2xl fixed bottom-0 left-0 right-0 w-full h-20 mx-auto transition-all space-x-2 flex justify-start items-center overflow-x-auto px-4 border-2 border-red-900">
    {#each teamCaptains as captain, index}
        {#if index == 0}
            <div class="w-48 h-12 p-3 rounded shadow drop-shadow-2xl text-black flex flex-shrink-0 items-center space-x-2 bg-blue-300 border-2 border-blue-500">
                <img src={captain.pfp_url} alt="Profile Pic" class="w-10 h-10 rounded-full" />
                <h3 class="text-sm font-bold">{captain.name}</h3>

                <span class="text-yellow-600 text-lg">⭐</span>
            </div>
        {:else}
        <div class="w-48 h-12 p-3 rounded shadow text-black flex flex-shrink-0 items-center space-x-2 bg-pink-300 border-2 border-red">
            <img src={captain.pfp_url} alt="Profile Pic" class="w-10 h-10 rounded-full" />
            <h3 class="text-sm font-bold">{captain.name}</h3>
        </div>
        {/if}
    {/each}
</div>
