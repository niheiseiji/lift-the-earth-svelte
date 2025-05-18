<script>
  import { Header, UserIcon } from '$lib/components';
  import { user } from '$lib/stores/user';
  import { goto } from '$app/navigation';
  import { fetchTrainings, fetchTrainingSummary } from '$lib/api';
  import { formatDate } from '$lib/utils/formatDate';
  import { CircleHelp, ChevronLeft, ChevronRight } from 'lucide-svelte';
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
  const { trainings, trainingSummary } = data;

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

  onMount(() => {
    window.addEventListener('click', handleClickOutside);
  });

  onDestroy(() => {
    window.removeEventListener('click', handleClickOutside);
  });

  const today = new Date();

  let trainingDatesSet = new Set();
  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth();

  let weeks = []; // [[Date, ...7], ...]
  let weekNumbers = []; // 表示週ごとのローカル週番号
  let scrollContainer;
  let selectedWeekIndex = null;
  let selectedWeekTrainings = [];

  // performedAtからyyyy-MM-dd形式でセット作成
  const normalizeDate = (isoString) => toYmd(new Date(isoString));

  const updateTrainingDatesSet = () => {
    trainingDatesSet = new Set(trainings.map((t) => normalizeDate(t.performedAt)));
  };

  // 1月1日を含む週を第1週、それ以降日曜で+1（1年分の週番号マッピングを生成）
  const getLocalWeekNumbers = (weeks) => {
    // その年の1月1日
    const jan1 = new Date(currentYear, 0, 1);
    // 1月1日を含む週の最初の日（その週の日曜）
    const firstWeekStart = new Date(jan1);
    firstWeekStart.setDate(jan1.getDate() - jan1.getDay());

    return weeks.map((w, idx) => {
      // その週の最初の日（日曜）
      const start = w[0];
      // 差分（日数）
      const diff = Math.floor((start - firstWeekStart) / (7 * 24 * 60 * 60 * 1000));
      return diff + 1;
    });
  };

  // カレンダー生成
  const updateMonth = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

    weeks = [];
    let cur = new Date(startDate);
    const maxWeeks = 6;

    for (let i = 0; i < maxWeeks; i++) {
      const week = [];
      let containsCurrentMonthDay = false;

      for (let j = 0; j < 7; j++) {
        const day = new Date(cur);
        week.push(day);
        if (day.getMonth() === currentMonth && day.getFullYear() === currentYear) {
          containsCurrentMonthDay = true;
        }
        cur.setDate(cur.getDate() + 1);
      }

      // ✅ 現在表示中の月に1日も含まれない週は除外
      if (containsCurrentMonthDay) {
        weeks.push(week);
      }
    }

    weekNumbers = getLocalWeekNumbers(weeks);
  };

  // 月切替
  const changeMonth = (offset) => {
    currentMonth += offset;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    } else if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    updateMonth();
    selectedWeekIndex = null;
    selectedWeekTrainings = [];
    setTimeout(() => scrollToTop(), 10);
  };

  // 今月へ
  const scrollToCurrentMonth = () => {
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    updateMonth();
    selectedWeekIndex = null;
    selectedWeekTrainings = [];
    setTimeout(() => scrollToTop(), 10);
  };

  const scrollToTop = () => {
    if (scrollContainer) scrollContainer.scrollTop = 0;
  };

  // 日付判定
  const isToday = (date) => toYmd(date) === toYmd(today);

  // トレーニング日かどうか判定
  const isTrained = (date) => {
    const key = toYmd(date);
    return trainingDatesSet.has(key);
  };

  // ユーティリティ
  const toYmd = (date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const isCurrentMonth = (date) =>
    date.getMonth() === currentMonth && date.getFullYear() === currentYear;

  // 週クリック処理
  const selectWeek = (weekIdx) => {
    selectedWeekIndex = weekIdx;
    const week = weeks[weekIdx];
    // その週に該当するトレーニングを抽出
    const start = week[0];
    const end = week[6];
    selectedWeekTrainings = trainings.filter((t) => {
      const d = new Date(t.performedAt);
      return d >= start && d <= end;
    });
  };

  // 日クリックでその週
  const selectWeekByDay = (day) => {
    const idx = weeks.findIndex((week) =>
      week.some((d) => formatDate(d, 'yyyy-MM-dd') === formatDate(day, 'yyyy-MM-dd'))
    );
    if (idx !== -1) selectWeek(idx);
  };

  onMount(() => {
    updateTrainingDatesSet();
    updateMonth();

    setTimeout(() => {
      scrollToTop();

      // ✅ 現在日が含まれる週を選択
      const todayIdx = weeks.findIndex((week) => week.some((day) => toYmd(day) === toYmd(today)));
      if (todayIdx !== -1) {
        selectWeek(todayIdx);
      }
    }, 10);
  });

  $: updateTrainingDatesSet();
</script>

<Header>
  <div slot="left" class="">
    <a href="/">
      <img src="/macho_gotikaku_black.svg" alt="" class="h-[20px]" />
    </a>
  </div>

  <div slot="right" class="flex items-center gap-2">
    <button
      on:click={() => goto('/training/new')}
      class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer
       bg-blue-700 hover:bg-blue-500"
    >
      トレーニング開始🏋️‍♀️
    </button>
    <UserIcon />
  </div>
</Header>

<div class="flex text-sm font-semibold mt-1 max-w-md mx-auto">
  <button
    on:click={() => (selectedTab = 'you')}
    class="flex-1 text-center py-2 transition-colors duration-200 cursor-pointer
      {selectedTab === 'you' ? 'text-blue-600' : 'text-gray-600'}"
  >
    あなた
    {#if selectedTab === 'you'}
      <div class="mt-1 mx-auto w-10 border-b-2 border-blue-600"></div>
    {/if}
  </button>
  <div class="my-2 border-l-1 border-gray-200"></div>
  <button
    on:click={() => (selectedTab = 'group')}
    class="flex-1 text-center py-2 transition-colors duration-200 cursor-pointer
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
      <div class="flex items-center text-sm font-bold px-4 py-2 sticky top-0 bg-white z-10">
        <button class="px-2 text-lg cursor-pointer" on:click={() => changeMonth(-1)}
          ><ChevronLeft /></button
        >
        <span class="mx-2">{currentYear}年{currentMonth + 1}月</span>
        <button
          class="ml-2 px-2 py-1 border border-gray-400 rounded text-xs bg-white hover:bg-gray-50 cursor-pointer"
          on:click={scrollToCurrentMonth}
        >
          今月へ
        </button>
        <button class="px-2 text-lg ml-auto cursor-pointer" on:click={() => changeMonth(1)}
          ><ChevronRight /></button
        >
      </div>

      <div bind:this={scrollContainer} class="px-2 bg-white" style="max-height:400px;">
        <div class="flex">
          <div class="w-12 pr-1"></div>

          <div class="grid grid-cols-7 text-xs text-center mb-2 w-full">
            <div class="text-gray-400">日</div>
            <div class="text-gray-400">月</div>
            <div class="text-gray-400">火</div>
            <div class="text-gray-400">水</div>
            <div class="text-gray-400">木</div>
            <div class="text-gray-400">金</div>
            <div class="text-gray-400">土</div>
          </div>
        </div>
        {#each weeks as week, widx}
          <div class="flex mb-1" class:selected={selectedWeekIndex === widx}>
            <!-- 週番号クリックで週選択 -->
            <button
              class="w-12 text-right text-xs text-gray-500 pr-2 hover:underline focus:underline cursor-pointer"
              style="min-width:3rem;"
              on:click={() => selectWeek(widx)}
              aria-label="週を選択"
            >
              {weekNumbers[widx]}週
            </button>
            <div class="grid grid-cols-7 gap-1 w-full">
              {#each week as day}
                <button
                  class="
                    w-full py-1 rounded text-center cursor-pointer text-sm
                    {isCurrentMonth(day) ? '' : 'text-gray-300'}
                    {isTrained(day) ? 'text-white' : ''}
                    {isToday(day) && isCurrentMonth(day) ? 'underline font-bold' : ''}
                    {selectedWeekIndex === widx ? 'ring-2 ring-blue-200' : ''}
                  "
                  style="
                    background:
                    {isTrained(day) ? '#008B6D' : 'transparent'};
                    color: {isTrained(day) ? '#fff' : isCurrentMonth(day) ? '#222' : '#bbb'};"
                  on:click={() => selectWeek(widx)}
                >
                  {day.getDate()}
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      {#if selectedWeekIndex !== null}
        <div class="p-4">
          <h2 class="text-sm font-bold mb-2">
            {`${currentYear}年${currentMonth + 1}月(第${weekNumbers[selectedWeekIndex]}週)のトレーニング`}
          </h2>
          {#if selectedWeekTrainings.length > 0}
            {#each selectedWeekTrainings as training}
              <div class="py-2 border-t border-gray-200 text-sm">
                <div class="flex justify-between items-center mb-1">
                  <div class="text-gray-500">{formatDate(training.performedAt, 'yyyy-MM-dd')}</div>
                  <button
                    on:click={() => goto(`/training/${training.id}`)}
                    class="text-blue-600 text-xs font-bold cursor-pointer">詳細</button
                  >
                </div>
                <div class="text-gray-800">
                  {#each training.trainingMenus.filter((m) => m.name.trim() !== '') as menu, i (menu.id)}
                    {menu.name}{menu.sets?.length > 0 ? `(${menu.sets.length}set)` : ''}{i <
                    training.trainingMenus.length - 1
                      ? '、'
                      : ''}
                  {/each}
                </div>
              </div>
            {/each}
          {:else}
            <div class="text-sm text-gray-400 text-center py-4">トレーニングが未登録です</div>
          {/if}
        </div>
      {/if}

      <button
        on:click={() => goto('/training/new')}
        class="mt-2 flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer bg-blue-700 hover:bg-blue-500"
      >
        トレーニング開始🏋️‍♀️
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
        <p class="text-pretty text-gray-700">今日のトレーニング受付が完了しました👱‍♂️</p>
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

<style>
  .selected {
    background-color: #e0e7ff;
  }
</style>
