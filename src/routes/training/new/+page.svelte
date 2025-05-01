<script>
  import { dndzone } from 'svelte-dnd-action';
  import { Header, UserIcon, PresetButton, SaveButton } from '$lib/components';
  import { Menu } from 'lucide-svelte';

  const setCount = 5;
  const menuCount = 6;

  const createSets = (count) => Array.from({ length: count }, () => ({ reps: '', weight: '' }));

  let menus = [
    { id: '1', name: 'ベンチプレス', sets: createSets(setCount) },
    { id: '2', name: '', sets: createSets(setCount) },
    { id: '3', name: '', sets: createSets(setCount) },
    { id: '4', name: '', sets: createSets(setCount) },
    { id: '5', name: '', sets: createSets(setCount) },
    { id: '6', name: '', sets: createSets(setCount) }
  ];

  const handleDndConsider = (event) => {
    menus = event.detail.items;
  };

  const handleDndFinalize = (event) => {
    menus = event.detail.items;
  };
</script>

<Header>
  <div slot="right" class="flex items-center gap-4">
    <PresetButton />
    <SaveButton />
    <UserIcon />
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
      <div class="rounded border p-2 bg-white shadow-sm w-full max-w-md">
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
