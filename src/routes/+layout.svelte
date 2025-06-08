<script>
	export const ssr = false;
	import { initializeStores, Toast } from "@skeletonlabs/skeleton"
	import '../app.postcss';

	initializeStores();
</script>

<div class="flex">
	<Toast />
	<div style="background-color: #aaaaaa" class="flex-1">
		<slot></slot> <!-- Page content will be injected here -->
	</div>
</div>
  