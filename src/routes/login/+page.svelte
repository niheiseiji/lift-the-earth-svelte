<script>
  import { login } from '$lib/api';
  import { saveToken } from '$lib/auth';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';

  // ログイン処理を行う関数
  const handleLogin = async () => {
    try {
      const token = await login(email, password);
      saveToken(token);
      goto('/dashboard');
    } catch (e) {
      error = e.message;
    }
  };

  // google認証のための関数
  const loginWithGoogle = () => {
    // Spring Boot 側のGoogle認証開始エンドポイントへリダイレクト
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
