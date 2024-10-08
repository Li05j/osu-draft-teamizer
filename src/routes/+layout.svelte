<script>
	import { initializeStores, Toast } from "@skeletonlabs/skeleton"
	import '../app.postcss';
	import List from "$lib/assets/List.svg"

	let sidebarOpen = true;

	initializeStores();
</script>

<div class="flex">
	{#if sidebarOpen}
		<div class={`bg-gray-800 text-white transition-all h-screen w-48`}>
			<button on:click={() => sidebarOpen = false} class="p-4">
				<img src={List} alt="Hide Sidebar" class="w-6 h-6" />
			</button>
			  
			<nav class="p-4">
				<ul>
					<li><a href="/draft" class="block py-2">Draft</a></li>
					<li><a href="/import" class="block py-2">Import</a></li>
				</ul>
			</nav>
		</div>
	{:else}
		<div class={`bg-gray-800 text-white transition-all h-screen 'w-16'`}>
			<button on:click={() => sidebarOpen = true} class="p-4">
				<img src={List} alt="Show Sidebar" class="w-6 h-6" />
			</button>
		</div>
	{/if}
  
	<Toast />
	<div class="flex-1">
		<slot></slot> <!-- Page content will be injected here -->
	</div>
</div>
  