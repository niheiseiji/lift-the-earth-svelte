<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Header, UserIcon } from '$lib/components';
  import { formatDate } from '$lib/utils/formatDate';

  const today = new Date();

  export let data;
  const { trainings } = data;

  let trainingDatesSet = new Set();
  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth();

  let weeks = []; // [[Date, ...7], ...]
  let weekNumbers = []; // 表示週ごとのローカル週番号
  let scrollContainer;
  let selectedWeekIndex = null;
  let selectedWeekTrainings = [];

  // performedAtからyyyy-MM-dd形式でセット作成
  const normalizeDate = (isoString) => formatDate(new Date(isoString), 'yyyy-MM-dd');
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
    // 月初、月末
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // 1行目: その月1日を含む週の日曜から
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

    // 最大6週分まで表示（1ヶ月＝42マス）
    weeks = [];
    let cur = new Date(startDate);
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        week.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
      }
      weeks.push(week);
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
  const isToday = (date) => formatDate(date, 'yyyy-MM-dd') === formatDate(today, 'yyyy-MM-dd');
  const isTrained = (date) => trainingDatesSet.has(formatDate(date, 'yyyy-MM-dd'));
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
    setTimeout(() => scrollToTop(), 10);
  });

  $: updateTrainingDatesSet();
</script>

<Header>
  <div slot="left">
    <a href="/">
      <img src="/macho_gotikaku_black.svg" alt="" class="h-[20px]" />
    </a>
  </div>
  <div slot="right" class="flex items-center gap-2">
    <button
      on:click={() => goto('/training/new')}
      class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm bg-blue-700 hover:bg-blue-500"
    >
      マッチョ開始💪
    </button>
    <UserIcon />
  </div>
</Header>

<div class="flex items-center text-sm font-bold px-4 py-2 sticky top-0 bg-white z-10 border-b">
  <button class="px-2 text-lg" on:click={() => changeMonth(-1)}>&lt;</button>
  <span class="mx-2">{currentYear}年{currentMonth + 1}月</span>
  <button
    class="ml-2 px-2 py-1 border border-gray-400 rounded text-xs bg-white hover:bg-gray-50"
    on:click={scrollToCurrentMonth}
  >
    今月へ
  </button>
  <button class="px-2 text-lg ml-auto" on:click={() => changeMonth(1)}>&gt;</button>
</div>

<div
  bind:this={scrollContainer}
  class="overflow-y-scroll h-[400px] px-2 bg-white"
  style="max-height:400px;"
>
  <div class="grid grid-cols-7 text-xs text-center mb-2">
    <div class="text-gray-400">日</div>
    <div class="text-gray-400">月</div>
    <div class="text-gray-400">火</div>
    <div class="text-gray-400">水</div>
    <div class="text-gray-400">木</div>
    <div class="text-gray-400">金</div>
    <div class="text-gray-400">土</div>
  </div>
  {#each weeks as week, widx}
    <div class="flex mb-1" class:selected={selectedWeekIndex === widx}>
      <!-- 週番号クリックで週選択 -->
      <button
        class="w-12 text-right text-xs text-gray-500 pr-1 pt-2 hover:underline focus:underline"
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
              w-full py-1 rounded text-center
              {isCurrentMonth(day) ? '' : 'text-gray-300'}
              {isTrained(day) && isCurrentMonth(day) ? 'bg-green-600 text-white' : ''}
              {isToday(day) && isCurrentMonth(day) ? 'underline font-bold' : ''}
              {selectedWeekIndex === widx ? 'ring-2 ring-blue-300' : ''}
            "
            style="
              background: {isTrained(day) && isCurrentMonth(day) ? '#16a34a' : 'transparent'};
              color: {isCurrentMonth(day) ? (isTrained(day) ? '#fff' : '#222') : '#bbb'};
            "
            disabled={!isCurrentMonth(day)}
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
      {currentYear}年{currentMonth + 1}月 {weekNumbers[selectedWeekIndex]}週のトレーニング
    </h2>
    {#if selectedWeekTrainings.length > 0}
      {#each selectedWeekTrainings as training}
        <div class="py-2 border-t border-gray-100 text-sm">
          <div class="flex justify-between items-center mb-1">
            <div class="text-gray-500">{formatDate(training.performedAt, 'yyyy-MM-dd')}</div>
            <button
              on:click={() => goto(`/training/${training.id}`)}
              class="text-blue-600 text-xs font-bold">詳細</button
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

<style>
  .selected {
    background-color: #e0e7ff;
  }
</style>
