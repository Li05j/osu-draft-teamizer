<script>
	import ImportTopBar from "$lib/components/ImportTopBar.svelte";
	import PlayerList from "$lib/components/PlayerList.svelte";
	let players = [
		{ id: '123', name: 'PlayerOne' },
		{ id: '456', name: 'PlayerTwo' },
		// More dummy players
	];
</script>
<div class="flex flex-col h-screen">
	<!-- Top Bar -->
	<ImportTopBar />
  
	<!-- Scrollable List -->
	<PlayerList {players} />
</div>
  