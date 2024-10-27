<script lang="ts">
    import { teams, undoStack, undoSignal } from '$lib/stores';
    import { onMount } from 'svelte';
	import TeamCard from '$lib/components/TeamCard.svelte';

    function handleUndo(event) {
        if (event.ctrlKey && event.key === 'z') {
            event.preventDefault(); // Prevent default undo behavior, if needed
            
            // console.log('Undo triggered');
            undoStack.update(currentStack => {
                const lastPair = currentStack.pop();
                if (lastPair) {
                    undoSignal.set(lastPair)
                }
                return currentStack;
            });
        }
    }

    onMount(() => {
        window.addEventListener('keydown', handleUndo);
        return () => window.removeEventListener('keydown', handleUndo);
    });
</script>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 h-full p-5" style="padding-right: 16rem; padding-bottom: 6rem; grid-auto-rows: 1fr;">
    {#each $teams as _, index}
        <TeamCard teamIndex={index} />
    {/each}
</div>
