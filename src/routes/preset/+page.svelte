<script>
  import { Header } from '$lib/components';
  import { ArrowLeft, MoreVertical } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { deletePresetTraining } from '$lib/api';
  import { onMount, onDestroy } from 'svelte';

  export let data;
  const presets = data.presets;

  const getMenuSummary = (menus) => menus.map((m) => m.name).join('、');

  const goToCreatePreset = () => {
    goto('/preset/new');
  };

  let openMenuId = null;
  let confirmDeleteId = null;

  const confirmDelete = async () => {
    await deletePresetTraining(confirmDeleteId);
    location.reload();
  };

  let closeMenu;

  onMount(() => {
    closeMenu = (e) => {
      if (!e.target.closest('.tooltip-wrapper')) {
        openMenuId = null;
      }
    };
    document.addEventListener('click', closeMenu);
    return () => {
      document.removeEventListener('click', closeMenu);
    };
  });

  onDestroy(() => {
    document.removeEventListener('click', closeMenu);
  });
</script>

<Header>
  <div slot="left">
    <a href="/">
      <ArrowLeft size={28} />
    </a>
  </div>
</Header>

<div class="p-4">
  <div class="flex justify-between items-center mb-4">
    <h2 class="font-bold">登録済みプリセット</h2>
    <button
      on:click={goToCreatePreset}
      class="text-white bg-blue-700 hover:bg-blue-800 rounded text-sm px-3 inline-flex items-center h-[35px]"
    >
      <span>プリセット追加👩‍💻</span>
    </button>
  </div>

  {#if presets.length > 0}
    <table class="w-full text-left border-t border-gray-300 table-fixed">
      <thead>
        <tr class="text-gray-600 text-sm">
          <th class="py-2 w-[30%]">メニュー名</th>
          <th class="py-2 w-[55%]">概要</th>
          <th class="py-2 w-[15%]">操作</th>
        </tr>
      </thead>
      <tbody>
        {#each presets as preset}
          <tr class="relative border-t border-gray-200 hover:bg-gray-50 text-sm">
            <td class="py-2 whitespace-normal break-words">{preset.presetName}</td>
            <td class="py-2 whitespace-normal break-words"
              >{getMenuSummary(preset.trainingMenus)}</td
            >

            <td class="py-2 relative">
              <div class="tooltip-wrapper inline-block">
                <button
                  type="button"
                  class="p-1"
                  on:click={() => (openMenuId = openMenuId === preset.id ? null : preset.id)}
                >
                  <MoreVertical class="cursor-pointer" />
                </button>

                {#if openMenuId === preset.id}
                  <div
                    class="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded shadow z-10 text-xs"
                  >
                    <button
                      type="button"
                      class="px-3 py-2 hover:bg-gray-100 text-left w-full text-xs"
                      on:click={() => goto(`/preset/${preset.id}`)}
                    >
                      編集
                    </button>
                    <button
                      type="button"
                      class="px-3 py-2 hover:bg-red-100 text-red-600 text-left w-full text-xs"
                      on:click={() => (confirmDeleteId = preset.id)}
                    >
                      削除
                    </button>
                  </div>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <div class="text-center py-6 text-gray-400 text-sm">プリセットが未登録です💡</div>
  {/if}
</div>

{#if confirmDeleteId}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
    <div class="bg-white p-5 rounded shadow-md space-y-4 w-80">
      <h2 class="text-sm font-semibold">本当に削除しますか？</h2>
      <div class="flex justify-end gap-2">
        <button class="text-sm text-gray-500" on:click={() => (confirmDeleteId = null)}
          >キャンセル</button
        >
        <button class="text-sm bg-red-600 text-white px-3 py-1 rounded" on:click={confirmDelete}
          >削除</button
        >
      </div>
    </div>
  </div>
{/if}
