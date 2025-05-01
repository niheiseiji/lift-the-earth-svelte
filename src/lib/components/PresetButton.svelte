<script>
  import { onMount } from 'svelte';
  import { ChevronDown } from 'lucide-svelte';

  let showDropdown = false;
  let dropdownRef;

  const toggleDropdown = () => {
    showDropdown = !showDropdown;
  };

  const handleSelect = (action) => {
    console.log(`${action} clicked`);
    showDropdown = false;
  };

  const handleClickOutside = (event) => {
    if (!dropdownRef?.contains(event.target)) {
      showDropdown = false;
    }
  };

  onMount(() => {
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  });
</script>

<div class="relative" bind:this={dropdownRef}>
  <button
    on:click={toggleDropdown}
    class="border border-blue-700 text-blue-700 hover:bg-blue-200 rounded text-sm px-3 inline-flex items-center h-[35px]"
  >
    <span>プリセット</span>
    <span class="w-px h-4 ml-2 bg-blue-700"></span>
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
