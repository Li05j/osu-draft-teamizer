<script lang="ts">
    import { teams } from '$lib/stores';
	import TeamCard from '$lib/components/TeamCard.svelte';
</script>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 h-full p-5" style="padding-right: 16rem; padding-bottom: 6rem; grid-auto-rows: 1fr;">
    {#each $teams as _, index}
        <TeamCard teamIndex={index} />
    {/each}
</div>
