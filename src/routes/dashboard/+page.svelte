<script>
  import { onMount } from 'svelte';
  import { getToken, logout } from '$lib/auth';
  import { goto } from '$app/navigation';

  onMount(() => {
    if (!getToken()) {
      goto('/login');
    }
  });

  function handleLogout() {
    logout();
    goto('/login');
  }
</script>

<h1>ダッシュボード</h1>
<p>ログイン後にだけ見える画面です。</p>
<button on:click={handleLogout}>ログアウト</button>
