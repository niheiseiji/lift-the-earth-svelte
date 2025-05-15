<script>
  import { Header, UserIcon } from '$lib/components';
  import { user } from '$lib/stores/user';
  import { goto } from '$app/navigation';
  import { fetchTrainings, fetchTrainingSummary } from '$lib/api';
  import { formatDate } from '$lib/utils/formatDate';
  import { CircleHelp } from 'lucide-svelte';
  import { onMount, onDestroy } from 'svelte';
  import { showToast } from '$lib/stores/toast';

  // 保存完了メッセージを表示するか
  let showSavedMessage = false;
  // タブ'you' or 'group'
  let selectedTab = 'you';

  let showTooltip = false;
  let buttonEl;
  let tooltipEl;

  export let data;
  const { trainings, trainingSummary, isTodayRegistered } = data;

  onMount(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('saved') === '1') {
      showSavedMessage = true;
      url.searchParams.delete('saved');
      history.replaceState(null, '', url);
    }
    if (url.searchParams.get('updated') === '1') {
      showToast('更新しました！', 'success');
      url.searchParams.delete('updated');
      history.replaceState(null, '', url);
    }
  });

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
      <img src="/macho_gotikaku_black.svg" alt="" class="h-[20px]" />
    </a>
  </div>

  <div slot="right" class="flex items-center gap-2">
    <button
      disabled={isTodayRegistered}
      on:click={() => goto('/training/new')}
      class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer
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
