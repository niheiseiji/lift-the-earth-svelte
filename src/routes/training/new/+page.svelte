<script>
  import { dndzone } from 'svelte-dnd-action';
  import { Header, UserIcon, PresetButton } from '$lib/components';
  import { Menu, ArrowLeft } from 'lucide-svelte';
  import { createTraining, createPresetTraining, fetchPresetTrainings } from '$lib/api';
  import { goto } from '$app/navigation';
  import { filterEmptyMenus } from '$lib/utils/filterEmptyMenus';
  import { setCount, createSets, padMenus } from '$lib/utils/trainingForm';
  import { getMenuSummary } from '$lib/utils/getMenuSummary';
  import { showToast } from '$lib/stores/toast';

  // デフォルトメニューのサンプル値としてベンチプレスを入れておく
  let menus = [{ id: '1', name: 'ベンチプレス', sets: [{ reps: '10', weight: '60' }] }];
  menus = padMenus(menus);

  const handleDndConsider = (e) => (menus = e.detail.items);
  const handleDndFinalize = (e) => (menus = e.detail.items);

  const saveTraining = async () => {
    const jstDate = new Date();
    jstDate.setMinutes(jstDate.getMinutes() - jstDate.getTimezoneOffset()); // JST補正

    const body = {
      performedAt: jstDate.toISOString(),
      trainingMenus: filterEmptyMenus(menus).map((m, i) => ({
        displayOrder: i + 1,
        name: m.name,
        sets: m.sets.map((s, j) => ({
          setOrder: j + 1,
          reps: Number(s.reps),
          weight: Number(s.weight)
        }))
      }))
    };
    try {
      await createTraining(body);
      goto('/?saved=1');
    } catch {
      alert('保存に失敗しました😥');
    }
  };

  // --- プリセット保存モーダル制御 ---
  let showSaveModal = false;
  let newPresetName = '';
  const openSaveModal = () => {
    newPresetName = '';
    showSaveModal = true;
  };
  const doSavePreset = async () => {
    try {
      await createPresetTraining({
        presetName: newPresetName,
        trainingMenus: filterEmptyMenus(menus).map((m, i) => ({
          displayOrder: i + 1,
          name: m.name,
          sets: m.sets.map((s, j) => ({
            setOrder: j + 1,
            reps: Number(s.reps),
            weight: Number(s.weight)
          }))
        }))
      });
      showToast('プリセットを保存しました', 'success');
    } catch {
      showToast('プリセットの保存に失敗しました', 'error');
    } finally {
      showSaveModal = false;
    }
  };

  // --- プリセットロードモーダル制御 ---
  let showListModal = false;
  let showConfirmModal = false;
  let presets = [];
  let loadCandidate = null;
  const openLoadPresetList = async () => {
    presets = await fetchPresetTrainings();
    showListModal = true;
  };
  const selectPreset = (p) => {
    loadCandidate = p;
    showListModal = false;
    showConfirmModal = true;
  };
  const applyPreset = () => {
    const loadMenus = loadCandidate.trainingMenus.map((m, i) => ({
      id: `${i + 1}`,
      name: m.name,
      sets: createSets(setCount).map((_, j) => ({
        reps: m.sets?.[j]?.reps ?? '',
        weight: m.sets?.[j]?.weight ?? ''
      }))
    }));
    menus = padMenus(loadMenus);
    showConfirmModal = false;
    showToast('プリセットからロードしました👱‍♂️', 'success');
  };
</script>

<Header>
  <div slot="left">
    <a href="/"><ArrowLeft size={28} /></a>
  </div>
  <div slot="right" class="flex items-center gap-4">
    <PresetButton on:register={openSaveModal} on:load={openLoadPresetList} />
    <button
      on:click={saveTraining}
      class="text-white bg-blue-700 hover:bg-blue-800 rounded text-sm px-3 inline-flex items-center h-[35px] cursor-pointer"
    >
      <span>完了💪</span>
    </button>
  </div>
</Header>

<div class="bg-gray-100 min-h-screen pt-1">
  <div
    use:dndzone={{ items: menus, flipDurationMs: 200 }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
    class="flex flex-col items-center gap-2 mx-1"
  >
    {#each menus as menu (menu.id)}
      <div class="rounded border border-gray-200 p-2 bg-white shadow-sm w-full max-w-md">
        <div class="flex items-center gap-1 text-gray-700 text-sm mb-1">
          <Menu size={18} />
          <input
            type="text"
            bind:value={menu.name}
            class="text-base text-gray-900 rounded-sm px-1 focus:outline-1 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm"
          />
        </div>
        <div class="grid grid-cols-5 gap-2">
          {#each menu.sets as set}
            <div class="bg-gray-100 rounded h-20 flex flex-col justify-center items-center">
              <input
                type="number"
                bind:value={set.reps}
                class="w-full text-center bg-transparent border-none focus:outline-none text-gray-700 text-sm"
              />
              <hr class="w-2/3 border-gray-300 my-1" />
              <input
                type="number"
                bind:value={set.weight}
                class="w-full text-center bg-transparent border-none focus:outline-none text-gray-700 text-sm"
              />
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- プリセット保存モーダル -->
{#if showSaveModal}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
    <div class="bg-white p-5 rounded w-80 space-y-4">
      <h2 class="text-sm font-semibold">プリセット名を入力</h2>
      <input
        type="text"
        bind:value={newPresetName}
        placeholder="例: 上半身強化メニュー"
        class="border rounded w-full px-2 py-1 text-sm"
      />
      <div class="flex justify-end gap-2">
        <button class="text-sm text-gray-500" on:click={() => (showSaveModal = false)}
          >キャンセル</button
        >
        <button class="text-sm bg-blue-600 text-white px-3 py-1 rounded" on:click={doSavePreset}
          >保存</button
        >
      </div>
    </div>
  </div>
{/if}

<!-- プリセット一覧モーダル -->
{#if showListModal}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
    <div class="bg-white p-5 rounded w-96 max-h-[70vh] overflow-auto space-y-2">
      <h2 class="text-sm font-semibold">プリセットを選択</h2>
      {#if presets.length > 0}
        {#each presets as p}
          <button
            type="button"
            class="w-full px-3 py-2 hover:bg-gray-100 text-sm text-left"
            on:click={() => selectPreset(p)}
          >
            <span class="text-weight-bold">{p.presetName}</span>
            <span class="text-gray-400">({getMenuSummary(p.trainingMenus)})</span>
          </button>
        {/each}
      {:else}
        <div class="text-center py-12 text-gray-400 text-sm">
          プリセットを登録するとここに表示されます💡
        </div>
      {/if}
      <div class="text-right mt-2">
        <button class="text-sm text-gray-500" on:click={() => (showListModal = false)}
          >閉じる</button
        >
      </div>
    </div>
  </div>
{/if}

<!-- ロード確認モーダル -->
{#if showConfirmModal}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
    <div class="bg-white p-5 rounded w-80 space-y-4">
      <p class="text-sm">現在のメニューがプリセットで上書きされます。よろしいですか？</p>
      <div class="flex justify-end gap-2">
        <button class="text-sm text-gray-500" on:click={() => (showConfirmModal = false)}
          >キャンセル</button
        >
        <button class="text-sm bg-blue-600 text-white px-3 py-1 rounded" on:click={applyPreset}
          >OK</button
        >
      </div>
    </div>
  </div>
{/if}

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
</style>
