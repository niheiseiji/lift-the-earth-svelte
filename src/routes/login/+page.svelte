<script>
  import { login } from '$lib/api';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';

  const handleLogin = async () => {
    try {
      await login(email, password); // ← tokenを返さず、Cookieに保存される前提
      goto('/dashboard');
    } catch (e) {
      error = e.message;
    }
  };

  const loginWithGoogle = () => {
    window.location.href = 'http://localhost:8080/api/auth/google/login';
  };
</script>

<h1>ログイン</h1>
{#if error}<p style="color: red">{error}</p>{/if}
<input bind:value={email} placeholder="Email" />
<input bind:value={password} type="password" placeholder="Password" />
<button on:click={handleLogin}>ログイン</button>

<h2>別の方法でログイン</h2>
<button on:click={loginWithGoogle}> Googleでログイン </button>
