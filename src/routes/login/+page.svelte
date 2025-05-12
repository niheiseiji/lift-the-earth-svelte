<script>
  import { login } from '$lib/api';
  import { goto } from '$app/navigation';
  import { Header } from '$lib/components';

  let email = '';
  let password = '';
  let error = '';

  const handleLogin = async () => {
    try {
      await login(email, password);
      goto('/');
    } catch (e) {
      error = e.message;
    }
  };

  const loginWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google/login`;
  };
</script>

<div class="relative min-h-screen">
  <!-- 背景レイヤー -->
  <div
    class="absolute inset-0 bg-cover bg-center filter brightness-50"
    style="background-image: url('/hawaii_beach.jpg')"
  ></div>
  <!-- コンテンツレイヤー -->
  <div
    class="relative z-10 flex min-h-screen flex-col justify-center items-center px-6 py-8 lg:px-8"
  >
    <div class="bg-white/20 backdrop-blur-sm rounded-md px-8 py-6 shadow-xl">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm flex justify-center items-center">
        <img src="/macho_gotikaku_white.svg" alt="" class="h-[28px]" />
      </div>

      <div class="mt-10">
        {#if error}
          <p class="text-red-600 text-sm text-center mb-4">{error}</p>
        {/if}

        <div class="text-center">
          <button
            on:click={loginWithGoogle}
            class="w-[330px] flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
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
            Googleでログイン
          </button>
          <!-- TODO:LINE, apple追加予定 -->
        </div>
      </div>
    </div>
  </div>
</div>

<div class="absolute bottom-4 right-4 text-white text-xs opacity-70">© 2025 NIHEI SEIJI</div>
