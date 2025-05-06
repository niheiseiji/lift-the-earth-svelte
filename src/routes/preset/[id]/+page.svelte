<script>
  import { dndzone } from 'svelte-dnd-action';
  import { Header, UserIcon, PresetButton } from '$lib/components';
  import { Menu, ArrowLeft } from 'lucide-svelte';
  import { createTraining } from '$lib/api.js';
  import { goto } from '$app/navigation';
  import { filterEmptyMenus } from '$lib/utils/filterEmptyMenus.js';
  import { setCount, menuCount, createSets } from '$lib/utils/trainingForm';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fetchPresetTrainingById, updatePresetTraining } from '$lib/api.js';

  let id;

  // デフォルト値
  let menus = [];

  let showModal = false;
  let presetName = '';

  onMount(async () => {
    id = $page.params.id;
    const training = await fetchPresetTrainingById(id);
    presetName = training.presetName;
    menus = Array.from({ length: 6 }, (_, i) => {
      const m = training.trainingMenus[i] || {};
      return {
        id: m.id || `${i + 1}`,
        name: m.name || '',
        sets: createSets(setCount).map((_, j) => ({
          reps: m.sets?.[j]?.reps ?? '',
          weight: m.sets?.[j]?.weight ?? ''
        }))
      };
    });
  });

  const handleDndConsider = (event) => {
    menus = event.detail.items;
  };

  const handleDndFinalize = (event) => {
    menus = event.detail.items;
  };

  const openModal = () => {
    showModal = true;
  };

  const updatePreset = async () => {
    const body = {
      presetName,
      trainingMenus: filterEmptyMenus(menus).map((menu, i) => ({
        displayOrder: i + 1,
        name: menu.name,
        sets: menu.sets.map((set, j) => ({
          setOrder: j + 1,
          reps: Number(set.reps),
          weight: Number(set.weight)
        }))
      }))
    };

    try {
      await updatePresetTraining(id, body);
      goto('/preset');
    } catch (err) {
      console.error(err);
      alert('保存に失敗しました');
    }
  };
</script>

<Header>
  <div slot="left" class="">
    <a href="/">
      <ArrowLeft size={28} class="" />
    </a>
  </div>
  <div slot="right" class="flex items-center gap-4">
    <button
      on:click={openModal}
      class="text-white bg-blue-700 hover:bg-blue-800 rounded text-sm px-3 inline-flex items-center h-[35px]"
    >
      <span>更新👩‍💻</span>
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
          {#each menu.sets as set, index}
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

{#if showModal}
  <div class="fixed inset-0 bg-black/50 z-10 flex items-center justify-center">
    <div class="bg-white p-4 rounded shadow-lg w-80 space-y-4">
      <h2 class="text-lg font-bold">プリセット名を入力</h2>
      <input
        type="text"
        bind:value={presetName}
        placeholder="例: 上半身メニュー"
        class="border rounded px-2 py-1 w-full"
      />
      <div class="flex justify-end gap-2">
        <button
          class="text-sm text-gray-600 hover:text-gray-800"
          on:click={() => (showModal = false)}
        >
          キャンセル
        </button>
        <button
          class="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
          on:click={updatePreset}
        >
          保存する
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    @apply appearance-none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
</style>
