<script>
  import { onMount } from 'svelte';
  import { saveToken } from '$lib/auth';
  import { goto } from '$app/navigation';

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      saveToken(token);
      goto('/dashboard');
    } else {
      alert('トークンが見つかりませんでした');
      goto('/login');
    }
  });
</script>

<p>ログイン中です...</p>
