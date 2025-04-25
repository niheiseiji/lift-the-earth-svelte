<script>
  import { ChevronDown, CircleUser } from 'lucide-svelte';

  export let showRight = true;

  let showDropdown = false;

  const toggleDropdown = () => {
    showDropdown = !showDropdown;
  };

  const handleSelect = (action) => {
    console.log(`${action} clicked`);
    showDropdown = false;
  };
</script>

<header class="bg-white border-b border-gray-200">
  <div class="flex justify-between">
    <div class="min-w-0 flex-1">
      <div class="mx-auto px-2 py-2">
        <a href="/">
          <img src="/title_logo.svg" alt="" class="h-[35px]" />
        </a>
      </div>
    </div>

    <!-- 右上ボタン＆アイコン（条件付き） -->
    {#if showRight}
      <div class="flex relative px-2 py-2">
        <!-- ドロップダウン -->
        <slot name="dropdown" />
        <!-- ユーザーアイコン -->
        <slot name="user" />
      </div>
    {/if}
  </div>
</header>
