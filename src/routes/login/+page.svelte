<script>
    import { login } from '$lib/api';
    import { saveToken } from '$lib/auth';
    import { goto } from '$app/navigation';
  
    let email = '';
    let password = '';
    let error = '';
  
    async function handleLogin() {
      try {
        const token = await login(email, password);
        saveToken(token);
        goto('/dashboard');
      } catch (e) {
        error = e.message;
      }
    }
  </script>
  
  <h1>ログイン</h1>
  {#if error}<p style="color: red">{error}</p>{/if}
  <input bind:value={email} placeholder="Email" />
  <input bind:value={password} type="password" placeholder="Password" />
  <button on:click={handleLogin}>ログイン</button>
  