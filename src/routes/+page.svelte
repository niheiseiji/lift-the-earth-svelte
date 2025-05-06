<script>
  import { Header, UserIcon } from '$lib/components';
  import { user } from '$lib/stores/user';
  import { goto } from '$app/navigation';
  import { fetchTrainings, fetchTrainingSummary } from '$lib/api';
  import { formatDate } from '$lib/utils/formatDate';
  import { CircleHelp } from 'lucide-svelte';
  import { onMount, onDestroy } from 'svelte';

  // 保存完了メッセージを表示するか
  let showSavedMessage = false;
  // タブ'you' or 'group'
  let selectedTab = 'you';

  let showTooltip = false;
  let buttonEl;
  let tooltipEl;

  export let data;
  const { trainings, trainingSummary, isTodayRegistered } = data;

  const goToTraining = () => {
    goto('/training/new');
  };

  const goToDetail = (id) => {
    goto(`/training/${id}`);
  };

  const toggleTooltip = () => {
    // 表示中なら何もしない（外クリックで閉じる）
    if (showTooltip) return;

    // 表示されていない場合だけ開く
    setTimeout(() => {
      showTooltip = true;
    }, 0);
  };
  const handleClickOutside = (e) => {
    if (!buttonEl?.contains(e.target) && !tooltipEl?.contains?.(e.target)) {
      showTooltip = false;
    }
  };

  onMount(() => {
    window.addEventListener('click', handleClickOutside);
  });

  onDestroy(() => {
    window.removeEventListener('click', handleClickOutside);
  });
</script>

<Header>
  <div slot="left" class="">
    <a href="/">
      <img src="/title_logo.svg" alt="" class="h-[35px]" />
    </a>
  </div>

  <div slot="right" class="flex items-center gap-2">
    <button
      disabled={isTodayRegistered}
      on:click={goToTraining}
      class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
       {isTodayRegistered ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-500'}"
    >
      {#if isTodayRegistered}
        完了⭐
      {:else}
        トレーニング開始🏋️‍♀️
      {/if}
    </button>
    <UserIcon />
  </div>
</Header>

<div class="flex text-sm font-semibold mt-1">
  <button
    on:click={() => (selectedTab = 'you')}
    class="flex-1 text-center py-2 transition-colors duration-200
      {selectedTab === 'you' ? 'text-blue-600' : 'text-gray-600'}"
  >
    あなた
    {#if selectedTab === 'you'}
      <div class="mt-1 mx-auto w-10 border-b-2 border-blue-600"></div>
    {/if}
  </button>
  <div class="my-2 border-l-1 border-gray-300"></div>
  <button
    on:click={() => (selectedTab = 'group')}
    class="flex-1 text-center py-2 transition-colors duration-200
      {selectedTab === 'group' ? 'text-blue-600' : 'text-gray-600'}"
  >
    グループ
    {#if selectedTab === 'group'}
      <div class="mt-1 mx-auto w-10 border-b-2 border-blue-600"></div>
    {/if}
  </button>
</div>

{#if selectedTab === 'you'}
  <div class="flex min-h-full flex-col justify-center px-2 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md space-y-1">
      <!-- データカード -->
      <div class="rounded border border-gray-200 p-4 bg-white w-full">
        <div class="flex justify-between items-start">
          <div class="text-sm space-y-1">
            <div class="flex items-center gap-1">
              <h2 class="font-bold">データ</h2>
            </div>
            <div class="flex justify-between w-40">
              <span>総リフト重量</span>
              <span>{(trainingSummary?.totalLiftedWeightKg / 1000).toFixed(1)}t</span>
            </div>
            <div>トレーニング回数</div>
            <div class="space-y-1">
              <div class="flex justify-between w-40">
                <span>・直近7日間</span><span>{trainingSummary?.trainingsLast7Days}回</span>
              </div>
              <div class="flex justify-between w-40">
                <span>・直近30日間</span><span>{trainingSummary?.trainingsLast30Days}回</span>
              </div>
              <div class="flex justify-between w-40">
                <span>・全期間</span><span>{trainingSummary?.totalTrainings}回</span>
              </div>
            </div>
          </div>

          <!-- TODO: レベリングシステム -->
          <!-- <div class="flex flex-col items-center justify-center rounded px-4 py-2 text-center">
          </div> -->
        </div>
      </div>

      <!-- BIG3カード -->
      <div class="rounded border border-gray-200 p-4 bg-white w-full">
        <div class="flex justify-between items-start">
          <div class="text-sm space-y-1">
            <div class="relative flex items-center gap-1">
              <h2 class="font-bold">BIG3</h2>
              <button on:click={toggleTooltip} class="text-gray-400 text-xs">
                <CircleHelp size={14} />
              </button>
              {#if showTooltip}
                <div
                  bind:this={tooltipEl}
                  class="absolute left-3/4 top-full mt-2 -translate-x-1/2 w-64 rounded bg-gray-800 px-3 py-2 text-sm text-white shadow-lg z-10"
                  role="tooltip"
                >
                  BIG3の記録を登録済みのメニューから抽出します。シュワちゃんの記録は837kgだとか...👱‍♂️
                </div>
              {/if}
              <!-- <span class="text-gray-400 text-xs"><CircleHelp size={14} /></span> -->
            </div>
            <div class="flex justify-between w-40">
              <span>ベンチプレス</span><span>{trainingSummary?.maxBenchPress}kg</span>
            </div>
            <div class="flex justify-between w-40">
              <span>デッドリフト</span><span>{trainingSummary?.maxDeadlift}kg</span>
            </div>
            <div class="flex justify-between w-40">
              <span>スクワット</span><span>{trainingSummary?.maxSquat}kg</span>
            </div>
          </div>
          <div
            class="mt-2 w-22 flex flex-col items-center justify-center rounded bg-gray-100 px-4 py-2 text-center"
          >
            <span class="text-xs text-gray-500">TOTAL</span>
            <span class="text-2xl font-bold">{trainingSummary?.big3TotalWeight}</span>
            <span class="text-xs text-gray-500">kg</span>
          </div>
        </div>
      </div>

      <!-- current training & start btn -->
      <div class="rounded border border-gray-200 p-2 bg-white w-full">
        <!-- ヘッダー -->
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-sm font-bold">直近のトレーニング</h2>
          <!-- TODO: 実装 -->
          <!-- <button class="text-blue-600 text-sm font-semibold">すべて見る</button> -->
        </div>

        <!-- トレーニングリスト（上位3件） -->
        {#if trainings.length > 0}
          {#each trainings.slice(0, 3) as training}
            <div class="py-2 border-t border-gray-100 text-sm">
              <div class="flex justify-between items-center mb-1">
                <div class="text-gray-500">
                  {formatDate(training.performedAt)}
                </div>
                <button on:click={goToDetail(training.id)} class="text-blue-600 text-xs"
                  >詳細</button
                >
              </div>
              <div class="text-gray-800">
                {#if training.trainingMenus.filter((m) => m.name.trim() !== '').length > 0}
                  {#each training.trainingMenus.filter((m) => m.name.trim() !== '') as menu, i (menu.id)}
                    {menu.name}
                    {#if menu.sets?.length > 0}({menu.sets.length}set){/if}
                    {#if i < training.trainingMenus.filter((m) => m.name.trim() !== '').length - 1}、{/if}
                  {/each}
                {:else}
                  <div class="py-4 text-sm text-gray-400 text-center">トレーニングが未登録です</div>
                {/if}
              </div>
            </div>
          {/each}
        {:else}
          <div class="py-4 text-sm text-gray-400 text-center">トレーニングが未登録です</div>
        {/if}
      </div>
      <button
        disabled={isTodayRegistered}
        on:click={goToTraining}
        class="mt-2 flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
       {isTodayRegistered ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-500'}"
      >
        {#if isTodayRegistered}
          今日のトレーニング受付が完了しました⭐
        {:else}
          トレーニング開始🏋️‍♀️
        {/if}
      </button>
    </div>
  </div>
{:else if selectedTab === 'group'}
  <div class="text-center py-12 text-gray-400 text-sm">グループ機能は現在準備中です💡</div>
{/if}
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
