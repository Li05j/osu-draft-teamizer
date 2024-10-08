<script lang="ts">
	import ImportTopBar from "$lib/components/ImportTopBar.svelte";
	import PlayerList from "$lib/components/PlayerList.svelte";
	import { onMount } from 'svelte';
	import { players } from '$lib/stores';

	// For SSR using load function in +page.ts.
	export let data;
  	players.set(data.players); // Set loaded player data from local storage
</script>

<div class="flex flex-col h-screen">
	<!-- Top Bar -->
	<ImportTopBar />
  
	<!-- Scrollable List -->
	<PlayerList />
</div>
  