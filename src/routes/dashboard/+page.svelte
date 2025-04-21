<script>
  import { onMount } from 'svelte';
  import { fetchMe, logout } from '$lib/api';
  import { goto } from '$app/navigation';

  let user = null;
  let error = '';

  onMount(async () => {
    try {
      user = await fetchMe(); // credentials: 'include' 付きでCookie送信
    } catch (e) {
      error = e.message;
      await logout();
      goto('/login');
    }
  });

  const handleLogout = async () => {
    try {
      await logout(); // サーバ側でCookie削除
    } catch (e) {
      alert(e.message);
    }
    goto('/login');
  };
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
