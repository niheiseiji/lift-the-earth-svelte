<script>
  import { Header, UserIcon } from '$lib/components';
  import { user } from '$lib/stores/user';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { fetchTrainings } from '$lib/api';
  import { formatDate } from '$lib/utils/formatDate';

  let showSavedMessage = false;
  let trainings = [];

  onMount(async () => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('saved') === '1') {
      showSavedMessage = true;

      setTimeout(() => (showSavedMessage = false), 5000);

      // クエリパラメータをURLから除去
      url.searchParams.delete('saved');
      history.replaceState(null, '', url);
    }

    trainings = await fetchTrainings();
  });

  const goToTraining = () => {
    goto('/training/new');
  };
</script>

<Header>
  <div slot="left" class="">
    <a href="/">
      <img src="/title_logo.svg" alt="" class="h-[35px]" />
    </a>
  </div>

  <div slot="right" class="flex items-center gap-2">
    <UserIcon />
  </div>
</Header>

<!-- {#if $user}
  <div class="">ID:{$user.id}</div>
  <div class="">MAIL:{$user.email}</div>
{/if} -->

<div class="flex min-h-full flex-col justify-center px-2 py-2 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <!-- data -->
    <!-- TODO: 実装 -->
    <!-- big3 -->
    <!-- TODO: 実装 -->
    <!-- current training and start btn -->
    <div class="rounded border border-gray-200 p-2 bg-white w-full">
      <!-- ヘッダー -->
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-sm font-bold">直近のトレーニング</h2>
        <!-- TODO: 実装 -->
        <!-- <button class="text-blue-600 text-sm font-semibold">すべて見る</button> -->
      </div>

      <!-- トレーニングリスト（上位3件） -->
      {#each trainings.slice(0, 3) as training}
        <div class="py-2 border-t border-gray-100 text-sm">
          <div class="flex justify-between items-center mb-1">
            <div class="text-gray-500">
              {formatDate(training.performedAt)}
            </div>
            <button class="text-blue-600 text-xs">詳細</button>
          </div>
          <div class="text-gray-800">
            {#if training.trainingMenus.filter((m) => m.name.trim() !== '').length > 0}
              {#each training.trainingMenus.filter((m) => m.name.trim() !== '') as menu, i (menu.id)}
                {menu.name}
                {#if menu.sets?.length > 0}({menu.sets.length}set){/if}
                {#if i < training.trainingMenus.filter((m) => m.name.trim() !== '').length - 1}、{/if}
              {/each}
            {:else}
              メニュー未登録
            {/if}
          </div>
        </div>
      {/each}
    </div>
    <!-- TODO: 一日一回の制御 -->
    <button
      class="mt-2 flex w-full justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      on:click={goToTraining}
    >
      トレーニング開始🏋️‍♀️
    </button>
  </div>
</div>

<!-- complete modal -->
{#if showSavedMessage}
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
        <!-- TODO: 気の利いたメッセージを出したい -->
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
