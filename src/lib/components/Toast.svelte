<script>
  import { toast } from '$lib/stores/toast';
  import { fly } from 'svelte/transition';
</script>

{#if $toast.visible}
  <div
    in:fly={{ y: 10, duration: 200 }}
    out:fly={{ y: -10, duration: 200 }}
    class="fixed top-10 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded text-sm text-white z-50 shadow-md"
    class:bg-green-600={$toast.type === 'success'}
    class:bg-red-600={$toast.type === 'error'}
  >
    {$toast.message}
  </div>
{/if}
