<script>
	let sidebarOpen = true;
</script>

<div class="flex">
	{#if sidebarOpen}
		<div class="w-64 bg-gray-800 text-white h-screen">
			<button on:click={() => sidebarOpen = false} class="text-right p-4">Hide</button>
			<nav class="p-4">
				<ul>
					<li><a href="/draft" class="block py-2">Draft</a></li>
					<li><a href="/import" class="block py-2">Import</a></li>
				</ul>
			</nav>
		</div>
	{/if}
  
	<div class="flex-1">
		<button on:click={() => sidebarOpen = true} class="p-4">Show Sidebar</button>
		<slot></slot> <!-- Page content will be injected here -->
	</div>
</div>
  