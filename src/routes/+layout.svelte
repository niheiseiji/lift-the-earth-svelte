<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { user as userStore } from '$lib/stores/user';

  export let data;

  onMount(() => {
    console.log('User data:', data.user);
    userStore.set(data.user);
  });
</script>

<div data-theme="mytheme" class="min-h-screen bg-white text-foreground">
  <slot />
</div>
