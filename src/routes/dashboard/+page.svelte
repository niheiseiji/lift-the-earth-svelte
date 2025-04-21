<script>
  import { onMount } from 'svelte';
  import { getToken, logout } from '$lib/auth';
  import { fetchMe } from '$lib/api';
  import { goto } from '$app/navigation';

  let user = null;
  let error = '';

  onMount(async () => {
    const token = getToken();
    if (!token) {
      goto('/login');
      return;
    }

    try {
      user = await fetchMe();
    } catch (e) {
      error = e.message;
      logout(); // トークン無効時は強制ログアウト
      goto('/login');
    }
  });

  function handleLogout() {
    logout();
    goto('/login');
  }
</script>

<h1>ダッシュボード</h1>
{#if user}
  <p><strong>ID:</strong> {user.id}</p>
  <p><strong>Email:</strong> {user.email}</p>
  <p><strong>登録日:</strong> {user.createdAt}</p>
{/if}

{#if error}
  <p style="color: red">{error}</p>
{/if}
<button on:click={handleLogout}>ログアウト</button>
