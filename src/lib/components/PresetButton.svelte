<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { ChevronDown } from 'lucide-svelte';
  import { fetchPresetTrainings } from '$lib/api.js';

  const dispatch = createEventDispatcher();

  let showDropdown = false;

  const toggleDropdown = () => {
    showDropdown = !showDropdown;
  };

  const registerCurrent = () => {
    showDropdown = false;
    dispatch('register');
  };

  const loadList = () => {
    showDropdown = false;
    dispatch('load');
  };

  const clickOutside = (e) => {
    if (!e.target.closest('.preset-button')) {
      showDropdown = false;
    }
  };

  onMount(() => {
    window.addEventListener('click', clickOutside);
    return () => window.removeEventListener('click', clickOutside);
  });
</script>

<div class="relative preset-button">
  <button
    type="button"
    class="border border-blue-700 text-blue-700 hover:bg-blue-200 rounded text-sm px-3 inline-flex items-center h-[35px]"
    on:click={toggleDropdown}
  >
    <span>プリセット</span>
    <ChevronDown class="w-4 h-4 ml-2" />
  </button>

  {#if showDropdown}
    <div class="absolute right-0 mt-1 bg-white border border-gray-200 rounded shadow z-10 text-sm">
      <button
        type="button"
        class="block w-full text-left px-4 py-2 hover:bg-gray-100"
        on:click={registerCurrent}
      >
        現在のメニューを登録
      </button>
      <button
        type="button"
        class="block w-full text-left px-4 py-2 hover:bg-gray-100"
        on:click={loadList}
      >
        プリセットからロード
      </button>
    </div>
  {/if}
</div>
