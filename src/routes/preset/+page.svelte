<script>
  import { Header, UserIcon } from '$lib/components';
  import { user } from '$lib/stores/user';
  import { ArrowLeft } from 'lucide-svelte';
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
<h1 class="text-2xl font-bold text-center">(実装中)プリセット管理</h1>
{#if $user}
  <div class="">ID:{$user.id}</div>
  <div class="">MAIL:{$user.email}</div>
{/if}
