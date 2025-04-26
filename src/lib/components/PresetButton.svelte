<script>
  import { ChevronDown } from 'lucide-svelte';
  let showDropdown = false;

  const toggleDropdown = () => {
    showDropdown = !showDropdown;
  };

  const handleSelect = (action) => {
    console.log(`${action} clicked`);
    showDropdown = false;
  };
</script>

<div class="relative">
  <button
    on:click={toggleDropdown}
    class="text-white bg-blue-700 hover:bg-blue-800 rounded text-sm px-3 py-1.5 inline-flex items-center h-[35px]"
  >
    <span> プリセット設定 </span>
    <span class="w-px h-4 ml-2 bg-white/50"></span>
    <ChevronDown class="w-4 h-4 ml-2" />
  </button>

  {#if showDropdown}
    <div class="absolute top-full right-0 mt-2 z-10 w-44 bg-gray-100 rounded shadow">
      <ul class="py-2 text-sm text-gray-700">
        <li>
          <button
            class="w-full text-left px-4 py-2"
            on:click={() => handleSelect('プリセットに登録')}>現在のメニューを登録</button
          >
        </li>
        <li>
          <button
            class="w-full text-left px-4 py-2"
            on:click={() => handleSelect('プリセットからロード')}>プリセットからロード</button
          >
        </li>
      </ul>
    </div>
  {/if}
</div>
