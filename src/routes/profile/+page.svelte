<script>
  import { onMount } from 'svelte';
  import { Header, UserIcon } from '$lib/components';
  import { user } from '$lib/stores/user';
  import { updateUserSetting } from '$lib/api';
  import { CircleCheck, ArrowLeft } from 'lucide-svelte';
  import { showToast } from '$lib/stores/toast';

  let displayName = '';
  let uniqueName = '';
  $: displayName = $user?.displayName;
  $: uniqueName = $user?.uniqueName;

  let showEditModal = false;

  const openModal = () => {
    displayName = $user.displayName ?? '';
    uniqueName = $user.uniqueName ?? '';
    showEditModal = true;
  };

  const onUpdate = async () => {
    try {
      await updateUserSetting({ displayName, uniqueName });
      $user.displayName = displayName;
      $user.uniqueName = uniqueName;
      showToast('更新しました！', 'success');
      showEditModal = false;
    } catch (e) {
      console.error(e);
      showToast('更新に失敗しました😥', 'error');
    }
  };
</script>

<Header>
  <div slot="left">
    <a href="/">
      <ArrowLeft size={28} />
    </a>
  </div>
  <div slot="right" class="flex items-center gap-2">
    <UserIcon />
  </div>
</Header>

<div class="m-4 space-y-4">
  <div class="text-lg font-semibold">プロフィール</div>
  <div class="text-sm text-gray-600">表示名：{$user?.displayName}</div>
  <div class="text-sm text-gray-600">ユーザーID：{$user?.uniqueName}</div>
  <button
    on:click={openModal}
    class="mt-4 px-4 py-2 bg-blue-700 text-white text-sm rounded hover:bg-blue-800"
  >
    編集
  </button>
</div>

{#if showEditModal}
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-md w-[90%] max-w-md space-y-6">
      <h2 class="text-base font-semibold">プロフィールを編集</h2>
      <form on:submit|preventDefault={onUpdate} class="space-y-4">
        <div>
          <label for="display-name" class="text-sm font-medium text-gray-900">表示名</label>
          <input
            id="display-name"
            type="text"
            bind:value={displayName}
            required
            class="mt-1 block w-full rounded-md px-3 py-1.5 text-base border border-gray-300"
          />
        </div>
        <div>
          <label for="unique-name" class="text-sm font-medium text-gray-900"
            >ユーザーID（@付き）</label
          >
          <input
            id="unique-name"
            type="text"
            bind:value={uniqueName}
            pattern="^@\w+$"
            required
            class="mt-1 block w-full rounded-md px-3 py-1.5 text-base border border-gray-300"
          />
        </div>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            on:click={() => (showEditModal = false)}
            class="text-sm text-gray-600"
          >
            キャンセル
          </button>
          <button
            type="submit"
            class="text-sm text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
