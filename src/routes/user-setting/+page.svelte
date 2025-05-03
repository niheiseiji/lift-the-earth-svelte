<script>
  import { Header, UserIcon } from '$lib/components';
  import { user } from '$lib/stores/user';
  import { updateUserName } from '$lib/api.js';

  let newName = '';
  let message = '';

  const onUpdate = async () => {
    try {
      await updateUserName(newName);
      $user.name = newName;
      message = '名前を更新しました';
    } catch (e) {
      message = '更新に失敗しました';
    }
  };
</script>

<Header>
  <div slot="right" class="flex items-center gap-2">
    <UserIcon />
  </div>
</Header>

{#if $user}
  <div class="text-black">ID:{$user.id}</div>
  <div class="text-black">MAIL:{$user.email}</div>
  <div class="text-black">NAME:{$user.name}</div>

  <div class="mt-4">
    <input bind:value={newName} placeholder="新しい名前を入力" class="border p-1" />
    <button on:click={onUpdate} class="ml-2 bg-blue-500 text-white px-3 py-1 rounded">更新</button>
    {#if message}<p>{message}</p>{/if}
  </div>
{/if}
