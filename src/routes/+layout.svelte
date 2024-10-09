<script>
	import { initializeStores, Toast } from "@skeletonlabs/skeleton"
	import '../app.postcss';

	initializeStores();
</script>

<div class="flex">
	<Toast />
	<div style="background-color: #6b6b6b" class="flex-1">
		<slot></slot> <!-- Page content will be injected here -->
	</div>
</div>
  