<script>
  import { Header, UserIcon } from '$lib/components';
  import { ArrowLeft, MoreVertical } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  export let data;
  const presets = data.presets;

  const getMenuSummary = (menus) => menus.map((m) => m.name).join('、');

  const goToCreatePreset = () => {
    goto('/presets/new');
  };
</script>

<Header>
  <div slot="left">
    <a href="/">
      <ArrowLeft size={28} />
    </a>
  </div>
  <div slot="right" class="flex items-center gap-2"></div>
</Header>

<div class="p-4">
  <div class="flex justify-between items-center mb-4">
    <h2 class="font-bold">登録済みプリセット一覧</h2>
    <button
      on:click={goToCreatePreset}
      class="text-white bg-blue-700 hover:bg-blue-800 rounded text-sm px-3 inline-flex items-center h-[35px]"
    >
      <span>プリセット追加👩‍💻</span>
    </button>
  </div>

  {#if presets.length > 0}
    <table class="w-full text-left border-t border-gray-300">
      <thead>
        <tr class="text-gray-600 text-sm">
          <th class="py-2">メニュー名</th>
          <th class="py-2">概要</th>
          <th class="py-2">操作</th>
        </tr>
      </thead>
      <tbody>
        {#each presets as preset}
          <tr class="border-t border-gray-200 hover:bg-gray-50 text-sm">
            <td class="py-2">{preset.presetName}</td>
            <td class="py-2">{getMenuSummary(preset.trainingMenus)}</td>
            <td class="py-2">
              <MoreVertical class="cursor-pointer" />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <div class="text-center py-6 text-gray-400 text-sm">プリセットが未登録です💡</div>
  {/if}
</div>
