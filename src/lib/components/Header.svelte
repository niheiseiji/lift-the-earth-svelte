<script>
  import { ChevronDown, CircleUser } from 'lucide-svelte';

  let showDropdown = false;

  const toggleDropdown = () => {
    showDropdown = !showDropdown;
  };

  const handleSelect = (action) => {
    console.log(`${action} clicked`);
    showDropdown = false;
  };
</script>

<header class="bg-white border-b border-gray-200">
  <div class="flex justify-between">
    <div class="min-w-0 flex-1">
      <div class="mx-auto px-2 py-2">
        <a href="/">
          <img src="/title_logo.svg" alt="" class="h-[35px]" />
        </a>
      </div>
    </div>
    <div class="flex px-2 py-2">
      <!-- ドロップダウンボタン -->
      <button
        id="dropdownDefaultButton"
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded text-sm px-3 py-1.5 inline-flex items-center h-[35px]"
        on:click={toggleDropdown}
      >
        プリセット設定
        <span class="w-px h-4 mx-2 bg-white/50"></span>
        <ChevronDown class="w-4 h-4" />
      </button>

      <!-- ドロップダウンメニュー -->
      {#if showDropdown}
        <div
          id="dropdown"
          class="absolute right-14 mt-[42px] z-10 w-44 bg-gray-100 divide-y divide-gray-100 rounded-lg"
        >
          <ul class="py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
            <li>
              <button
                class="w-full text-left px-4 py-2 hover:bg-gray-300"
                on:click={() => handleSelect('プリセットに登録')}
              >
                現在のメニューを登録
              </button>
            </li>
            <li>
              <button
                class="w-full text-left px-4 py-2 hover:bg-gray-300"
                on:click={() => handleSelect('プリセットからロード')}
              >
                プリセットからロード
              </button>
            </li>
          </ul>
        </div>
      {/if}

      <CircleUser size={32} class="text-gray-500 mt-0.5 ml-2" />
    </div>
  </div>
</header>
