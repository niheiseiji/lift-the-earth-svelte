<script>
  import { onMount } from 'svelte';
  import { Header, UserIcon } from '$lib/components';
  import { user } from '$lib/stores/user';
  import { updateUserSetting, uploadProfileImage } from '$lib/api';
  import { CircleCheck, ArrowLeft } from 'lucide-svelte';
  import { showToast } from '$lib/stores/toast';

  let displayName = '';
  let uniqueName = '';
  $: displayName = $user?.displayName;
  $: uniqueName = $user?.uniqueName;

  let showEditModal = false;
  let showImageModal = false;

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

  const onSelectFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await uploadProfileImage(file);
      $user.profileImageUrl = url;
      showToast('画像を更新しました', 'success');
    } catch (err) {
      console.error(err);
      showToast('画像のアップロードに失敗しました', 'error');
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
  <div class="flex items-center gap-4">
    <button on:click={() => (showImageModal = true)}>
      <img
        src={$user?.profileImageUrl || '/onigiri_nori.png'}
        alt="プロフィール画像"
        class="w-16 h-16 rounded-full object-cover cursor-pointer"
      />
    </button>
  </div>
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
      <div class="flex items-center gap-4">
        <img
          src={$user?.profileImageUrl || '/onigiri_nori.png'}
          alt="プロフィール画像"
          class="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <label class="text-sm text-blue-600 underline cursor-pointer">
            画像を変更
            <input type="file" accept="image/*" class="hidden" on:change={onSelectFile} />
          </label>
        </div>
      </div>
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
{#if showImageModal}
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <button on:click={() => (showImageModal = false)} class="block p-0 border-none bg-transparent">
      <img
        src={$user?.profileImageUrl || '/onigiri_nori.png'}
        alt="拡大プロフィール画像"
        class="display-inline max-w-[90%] max-h-[90%] md:max-w-[30%] md:max-h-[30%] rounded-lg shadow-lg"
      />
    </button>
  </div>
{/if}
