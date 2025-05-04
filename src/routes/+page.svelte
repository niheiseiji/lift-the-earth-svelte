<script>
  import { Header, UserIcon } from '$lib/components';
  import { user } from '$lib/stores/user';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let showSavedMessage = false;

  onMount(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('saved') === '1') {
      showSavedMessage = true;

      setTimeout(() => (showSavedMessage = false), 5000);

      // クエリパラメータをURLから除去
      url.searchParams.delete('saved');
      history.replaceState(null, '', url);
    }
  });

  const goToTraining = () => {
    goto('/training/new');
  };
</script>

<Header>
  <div slot="right" class="flex items-center gap-2">
    <UserIcon />
  </div>
</Header>

{#if $user}
  <div class="">ID:{$user.id}</div>
  <div class="">MAIL:{$user.email}</div>
{/if}

<button
  class="text-white bg-blue-700 hover:bg-blue-800 rounded text-sm px-2 inline-flex items-center h-[35px]"
  on:click={goToTraining}
>
  トレーニング開始🏋️‍♀️
</button>

{#if showSavedMessage}
  <!-- <div class="fixed top-4 bg-green-500 text-white px-4 py-2 rounded shadow">保存しました！</div> -->
  <div
    class="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modalTitle"
  >
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <div class="flex items-start justify-between">
        <h2 id="modalTitle" class="text-xl font-bold text-gray-900 sm:text-2xl">
          ナイスマッチョ💪
        </h2>
      </div>

      <div class="mt-4">
        <p class="text-pretty text-gray-700">今日のトレーニング受付が完了しました。</p>
      </div>

      <footer class="mt-6 flex justify-end gap-2">
        <button
          on:click={() => {
            showSavedMessage = false;
          }}
          type="button"
          class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Done
        </button>
      </footer>
    </div>
  </div>
{/if}
