<script>
  import { onMount } from 'svelte';
  import { Header, UserIcon } from '$lib/components';
  import { user } from '$lib/stores/user';
  import { updateUserName } from '$lib/api.js';
  import { CircleCheck, ArrowLeft } from 'lucide-svelte';

  let newName = '';
  let saveStatus = 'idle';

  $: newName = $user?.name;

  const onUpdate = async () => {
    try {
      await updateUserName(newName);
      $user.name = newName;
      saveStatus = 'success';
      setTimeout(() => (saveStatus = 'idle'), 3000); // 3秒後に戻す
    } catch (e) {}
  };
</script>

<Header>
  <div slot="left" class="">
    <a href="/">
      <ArrowLeft size={28} class="" />
    </a>
  </div>
  <div slot="right" class="flex items-center gap-2">
    <UserIcon />
  </div>
</Header>

{#if $user}
  <div class="m-2">
    <form on:submit|preventDefault={onUpdate} class="space-y-6">
      <div>
        <label for="user-name" class="block text-sm font-medium text-gray-900">ニックネーム</label>
        <div class="mt-2">
          <input
            id="user-name"
            type="text"
            bind:value={newName}
            required
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <!-- TODO: レイアウト -->
        <button
          type="submit"
          class={`flex w-full justify-center items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm
            ${saveStatus === 'success' ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-700 hover:bg-blue-500'}
          `}
        >
          {#if saveStatus === 'success'}
            <CircleCheck class="size-4" />
            保存しました！
          {:else}
            保存
          {/if}
        </button>
      </div>
    </form>
  </div>
{/if}
