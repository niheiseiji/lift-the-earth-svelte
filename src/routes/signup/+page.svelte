<script>
  import { signup } from '$lib/api';
  import { goto } from '$app/navigation';
  import { Header } from '$lib/components';

  let email = '';
  let password = '';
  let error = '';

  const handleSignup = async () => {
    try {
      await signup(email, password);
      goto('/');
    } catch (e) {
      error = e.message;
    }
  };

  const loginWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google/login`;
  };
</script>

<!-- header -->
<Header />

<!-- form contents -->
<div class="flex min-h-full flex-col justify-center px-6 py-8 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2 class="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">サインアップ</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    {#if error}
      <p class="text-red-600 text-sm text-center mb-4">{error}</p>
    {/if}

    <form class="space-y-6" on:submit|preventDefault={handleSignup}>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-900">メールアドレス</label>
        <div class="mt-2">
          <!-- TODO: メアド重複などのエラーハンドリング -->
          <!-- TODO: 自動入力するとダークモードのカラーになる -->
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            autocomplete="email"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-900">パスワード</label>
        <div class="mt-2">
          <!-- TODO: 確認用の入力を実装する -->
          <input
            id="password"
            type="password"
            bind:value={password}
            required
            autocomplete="current-password"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="flex w-full justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          サインアップ
        </button>
      </div>
    </form>

    <p class="mt-10 text-center text-sm text-gray-500">
      すでにアカウントをお持ちですか？
      <a href="/login" class="font-semibold text-blue-600 hover:text-blue-500">ログイン</a>
    </p>

    <div class="mt-6 text-center">
      <h3 class="text-sm text-gray-500 mb-2">別の方法で登録</h3>
      <button
        on:click={loginWithGoogle}
        class="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
      >
        <svg class="w-5 h-5" viewBox="0 0 533.5 544.3">
          <path
            fill="#4285F4"
            d="M533.5 278.4c0-18.8-1.5-37-4.4-54.6H272v103.3h146.9c-6.3 33.8-25.4 62.4-54 81.6l87 67.7c50.7-46.7 81.6-115.6 81.6-197.9z"
          />
          <path
            fill="#34A853"
            d="M272 544.3c73.3 0 134.7-24.2 179.6-65.5l-87-67.7c-24.1 16.2-55 25.7-92.6 25.7-71.2 0-131.6-48-153.2-112.4H29.1v70.6c44.8 89.4 137.4 149.3 242.9 149.3z"
          />
          <path
            fill="#FBBC04"
            d="M118.8 324.4c-10.6-31.1-10.6-64.8 0-95.9V157.9H29.1c-37.6 75.1-37.6 163.4 0 238.5l89.7-71.9z"
          />
          <path
            fill="#EA4335"
            d="M272 107.7c39.9 0 75.9 13.8 104.2 40.7l78.1-78.1C406.7 24.2 345.3 0 272 0 166.5 0 73.9 59.9 29.1 149.3l89.7 70.6C140.4 155.7 200.8 107.7 272 107.7z"
          />
        </svg>
        Googleで続ける
      </button>
    </div>
  </div>
</div>
