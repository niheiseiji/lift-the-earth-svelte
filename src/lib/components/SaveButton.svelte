<script>
  import { goto } from '$app/navigation';

  const gotoHome = () => {
    goto('/');
  };
</script>

<div class="relative">
  <button
    on:click={gotoHome}
    class="text-white bg-blue-700 hover:bg-blue-800 rounded text-sm px-3 inline-flex items-center h-[35px]"
  >
    <span>完了💪</span>
  </button>
</div>
