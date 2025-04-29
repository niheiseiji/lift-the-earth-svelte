<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { user as userStore } from '$lib/stores/user';
  import { fetchMe } from '$lib/api';
  import { goto } from '$app/navigation';

  onMount(async () => {
    const path = window.location.pathname;
    if (path.startsWith('/login') || path.startsWith('/signup')) return;
    try {
      const me = await fetchMe();
      userStore.set(me);
    } catch {
      goto('/login');
    }
  });
</script>

<div data-theme="mytheme" class="min-h-screen bg-white text-foreground">
  <slot />
</div>
