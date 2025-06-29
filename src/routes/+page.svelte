<script lang="ts">
  	import Sidebar from '$lib/components/Sidebar.svelte';
  	import DraftImportTopBar from '$lib/components/import/draft/ImportTopBar.svelte';
  	import DraftPlayerList from '$lib/components/import/draft/PlayerList.svelte';
	import DraftCaptainBar from '$lib/components/build_team/draft/CaptainBar.svelte';
	import DraftPlayerSidebar from '$lib/components/build_team/draft/DraftPlayerSidebar.svelte';
	import DraftScene from '$lib/components/build_team/draft/DraftScene.svelte';
	
  	import RandomImportTopBar from '$lib/components/import/random/ImportTopBar.svelte';
  	import RandomPlayerList from '$lib/components/import/random/PlayerList.svelte';
	import RandomBottomBar from '$lib/components/build_team/random/RandomBottomBar.svelte';
	import RandomPlayerSidebar from '$lib/components/build_team/random/RandomPlayerSidebar.svelte';
	import RandomScene from '$lib/components/build_team/random/RandomScene.svelte';

	import { onMount } from 'svelte';
	import { players, captains, player_pairs } from '$lib/stores';
	import { browser } from '$app/environment';

	let debugInfo = {
    	browser: false,
    	hasLocalStorage: false,
    	playersData: null,
    	hydrated: false
  	};

	onMount(() => {
		debugInfo.browser = browser;
    	debugInfo.hasLocalStorage = typeof localStorage !== 'undefined';
    	
		if (browser && typeof localStorage !== 'undefined') { // Only access localStorage if in the browser
    		const storedPlayers = localStorage.getItem('players');
    		if (storedPlayers) {
    			players.set(JSON.parse(storedPlayers)); // Populate store with local storage data
				debugInfo.playersData = JSON.parse(storedPlayers);
			}
    		const storedCaptains = localStorage.getItem('captains');
    		if (storedCaptains) {
    			captains.set(JSON.parse(storedCaptains)); // Populate store with local storage data
    		}
    		const stored_pairs = localStorage.getItem('player_pairs');
    		if (stored_pairs) {
    			player_pairs.set(JSON.parse(stored_pairs)); // Populate store with local storage data
    		}
    	}

		debugInfo.hydrated = true;
    	console.log('Debug info:', debugInfo);
  	});
	
	let sidebar_open = true;
  	let current_view = 'import'; // 'import', 'import', or 'team_building'
	let import_type = 'draft'; // 'none', draft' or 'random'
	let team_build_type = 'none'; // 'none', 'draft', or 'random'
  	function switchView(view: string) {
		current_view = view;
		team_build_type = 'none';
		return view;
  	}
	function changeImportType(type: string) {
		import_type = type;
	}
	function setDraftTeamBuilding() {
		team_build_type = 'draft';
		toggleSidebarOpen();
	}
	function setRandomTeamBuilding() {
		team_build_type = 'random';
		toggleSidebarOpen();
	}
	function toggleSidebarOpen() {
		sidebar_open = !sidebar_open;
	}
</script>

<div class="flex h-screen">
	<Sidebar {toggleSidebarOpen} {switchView} {changeImportType} {sidebar_open} {current_view} {import_type} />
		{#if current_view === 'import' && import_type === 'draft'}
		<div class="flex-1">
			<DraftImportTopBar />
			<DraftPlayerList />
		</div>
		{:else if current_view === 'import' && import_type === 'random'}
			<div class="flex-1">
				<RandomImportTopBar />
				<RandomPlayerList />
			</div>
		{:else if current_view === 'team_building'}
			{#if team_build_type === 'none'}
			<div class="flex flex-1 justify-center items-center">
				<button type="button" on:click={setDraftTeamBuilding} class="btn bg-pink-200 text-black rounded mx-auto w-96 h-96 text-2xl">
						Start Draft!
				</button>
				<button type="button" on:click={setRandomTeamBuilding} class="btn bg-pink-200 text-black rounded mx-auto w-96 h-96 text-2xl">
						Start Random!
				</button>
			</div>
			{:else if team_build_type === 'draft'}
				<DraftCaptainBar />
                <DraftPlayerSidebar />
				<div class="flex-1">
					<DraftScene />
				</div>
			{:else if team_build_type === 'random'}
				<RandomBottomBar />
                <RandomPlayerSidebar />
				<div class="flex-1">
					<RandomScene />
				</div>
			{/if}
		{/if}
</div>

<!-- <div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">Welcome to Skeleton.</h2>

		<figure>
			<section class="img-bg" />
			<svg
				class="fill-token -scale-x-[100%]"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 200 200"
			>
				<path
					fill-rule="evenodd"
					d="M98.77 50.95c25.1 0 46.54 8.7 61.86 23a41.34 41.34 0 0 0 5.19-1.93c4.35-2.02 10.06-6.17 17.13-12.43-1.15 10.91-2.38 18.93-3.7 24.04-.7 2.75-1.8 6.08-3.3 10a80.04 80.04 0 0 1 8.42 23.33c6.04 30.3-4.3 43.7-28.33 51.18.18.9.32 1.87.42 2.9.86 8.87-3.62 23.19-9 23.19-3.54 0-5.84-4.93-8.3-12.13-.78 8.34-4.58 17.9-8.98 17.9-4.73 0-7.25-8.84-10.93-20.13a214 214 0 0 1-.64 2.93l-.16.71-.16.71-.17.71c-1.84 7.58-4.46 15.07-8.5 15.07-5.06 0-2.29-15.9-10.8-22.63-43.14 2.36-79.43-13.6-79.43-59.62 0-8.48 2-16.76 5.69-24.45a93.72 93.72 0 0 1-1.77-3.68c-2.87-6.32-6.3-15.88-10.31-28.7 10.26 7.66 18.12 12.22 23.6 13.68.5.14 1.02.26 1.57.36 14.36-14.44 35.88-24.01 60.6-24.01Zm-9.99 62.3c-14.57 0-26.39 11.45-26.39 25.58 0 14.14 11.82 25.6 26.39 25.6s26.39-11.46 26.39-25.6c0-13.99-11.58-25.35-25.95-25.58Zm37.45 31.95c-4.4 0-6.73 9.4-6.73 13.62 0 3.3 1.1 5.12 2.9 5.45 4.39.4 3.05-5.97 5.23-5.97 1.06 0 2.2 1.35 3.34 2.73l.34.42c1.25 1.52 2.5 2.93 3.64 2.49 2.7-1.61 1.67-5.12.74-7.88-3.3-6.96-5.05-10.86-9.46-10.86Zm-36.85-28.45c12.57 0 22.76 9.78 22.76 21.85 0 12.07-10.2 21.85-22.76 21.85-.77 0-1.53-.04-2.29-.11 11.5-1.1 20.46-10.42 20.46-21.74 0-11.32-8.97-20.63-20.46-21.74.76-.07 1.52-.1 2.3-.1Zm65.54-5c-10.04 0-18.18 10.06-18.18 22.47 0 12.4 8.14 22.47 18.18 22.47s18.18-10.06 18.18-22.47c0-12.41-8.14-22.48-18.18-22.48Zm.6 3.62c8.38 0 15.16 8.4 15.16 18.74 0 10.35-6.78 18.74-15.16 18.74-.77 0-1.54-.07-2.28-.21 7.3-1.36 12.89-9.14 12.89-18.53 0-9.4-5.6-17.17-12.89-18.53.74-.14 1.5-.2 2.28-.2Zm3.34-72.27.12.07c.58.38.75 1.16.37 1.74l-2.99 4.6c-.35.55-1.05.73-1.61.44l-.12-.07a1.26 1.26 0 0 1-.37-1.74l2.98-4.6a1.26 1.26 0 0 1 1.62-.44ZM39.66 42l.08.1 2.76 3.93a1.26 1.26 0 0 1-2.06 1.45l-2.76-3.94A1.26 1.26 0 0 1 39.66 42Zm63.28-42 2.85 24.13 10.62-11.94.28 29.72-2.1-.47a77.8 77.8 0 0 0-16.72-2.04c-4.96 0-9.61.67-13.96 2l-2.34.73L83.5 4.96l9.72 18.37L102.94 0Zm-1.87 13.39-7.5 17.96-7.3-13.8-1.03 19.93.22-.06a51.56 51.56 0 0 1 12.1-1.45h.31c4.58 0 9.58.54 15 1.61l.35.07-.15-16.54-9.79 11-2.21-18.72Zm38.86 19.23c.67.2 1.05.89.86 1.56l-.38 1.32c-.17.62-.8 1-1.42.89l-.13-.03a1.26 1.26 0 0 1-.86-1.56l.38-1.32c.19-.66.88-1.05 1.55-.86ZM63.95 31.1l.05.12.7 2.17a1.26 1.26 0 0 1-2.34.9l-.04-.12-.71-2.17a1.26 1.26 0 0 1 2.34-.9Z"
				/>
			</svg>
		</figure>

		<div class="flex justify-center space-x-2">
			<a
				class="btn variant-filled"
				href="https://skeleton.dev/"
				target="_blank"
				rel="noreferrer"
			>
				Launch Documentation
			</a>
		</div>
		<div class="space-y-2">
			<p>Try editing the following:</p>
			<p><code class="code">/src/routes/+layout.svelte</code></p>
			<p><code class="code">/src/routes/+page.svelte</code></p>
		</div>
	</div>
</div>

<style lang="postcss">
	figure {
		@apply flex relative flex-col;
	}
	figure svg,
	.img-bg {
		@apply w-64 h-64 md:w-80 md:h-80;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation: pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite,
			glow 5s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}
</style> -->
