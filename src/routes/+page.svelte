<script>
  import { Header, UserIcon } from '$lib/components';
  import { user } from '$lib/stores/user';
  import { goto } from '$app/navigation';

  const goToInput = () => {
    goto('/input');
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
{/if}

<button
  class="text-white bg-blue-700 hover:bg-blue-800 rounded text-sm px-3 inline-flex items-center h-[35px]"
  on:click={goToInput}
>
  go to input
</button>
