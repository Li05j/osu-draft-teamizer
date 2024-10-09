<script lang="ts">
    import { teams } from '$lib/stores';
	import TeamCard from './TeamCard.svelte';
</script>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
    {#each $teams as _, index}
        <TeamCard teamIndex={index} />
    {/each}
</div>
