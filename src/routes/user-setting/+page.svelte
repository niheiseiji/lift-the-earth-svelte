<script>
  import { Header, UserIcon } from '$lib/components';
  import { user } from '$lib/stores/user';
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
