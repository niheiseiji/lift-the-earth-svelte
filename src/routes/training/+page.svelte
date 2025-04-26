<script>
  import { Header, UserIcon, PresetButton } from '$lib/components';
  import { Menu } from 'lucide-svelte';

  // メニューごとのデータを用意
  let menus = [
    { name: 'ベンチプレス', count: 5 },
    { name: '', count: 5 },
    { name: '', count: 5 },
    { name: '', count: 5 },
    { name: '', count: 5 },
    { name: '', count: 5 }
  ];
</script>

<Header>
  <div slot="right" class="flex items-center gap-4">
    <PresetButton />
    <UserIcon />
  </div>
</Header>

<div class="bg-gray-100 min-h-screen pt-1">
  <!-- メニューごとにカード表示 -->
  {#each menus as menu, idx}
    <div class="rounded border p-2 bg-white shadow-sm m-1 w-full max-w-md mx-auto">
      <!-- メニュー名 -->
      <div class="flex items-center gap-1 text-gray-700 text-sm mb-1">
        <Menu size={18} />
        <input
          type="text"
          bind:value={menu.name}
          class="text-base text-gray-900 rounded-sm px-1 focus:outline-1 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm"
        />
      </div>

      <!-- 入力ボックス -->
      <div class="grid grid-cols-5 gap-2">
        {#each Array(menu.count).fill('') as _, i (i)}
          <div class="bg-gray-100 rounded h-20 flex flex-col justify-center items-center">
            <input
              type="number"
              class="w-full text-center bg-transparent border-none focus:outline-none text-gray-700 text-sm"
            />
            <hr class="w-2/3 border-gray-300 my-1" />
            <input
              type="number"
              class="w-full text-center bg-transparent border-none focus:outline-none text-gray-700 text-sm"
            />
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

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
