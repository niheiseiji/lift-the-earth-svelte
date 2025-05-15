<script>
  import { onMount } from 'svelte';
  import { CircleUser } from 'lucide-svelte';
  import { logout } from '$lib/api';
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/user';

  let showDropdown = false;
  let dropdownRef;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      alert(e.message);
    }
    goto('/login');
  };

  const handleUserSetting = async () => {
    goto('/profile');
  };

  const handlePreset = async () => {
    goto('/preset');
  };

  const toggleDropdown = () => {
    showDropdown = !showDropdown;
  };

  const handleSelect = (action) => {
    console.log(`${action} clicked`);
    showDropdown = false;
    handleLogout();
  };

  const handleClickOutside = (event) => {
    if (!dropdownRef?.contains(event.target)) {
      showDropdown = false;
    }
  };

  onMount(() => {
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  });
</script>

<div class="relative flex items-center" bind:this={dropdownRef}>
  <button on:click={toggleDropdown}>
    <img
      src={$user?.profileImageUrl || '/onigiri_nori.png'}
      alt="プロフィール画像"
      class="block w-[32px] h-[32px] min-w-[32px] rounded-full object-cover cursor-pointer"
    />
  </button>

  {#if showDropdown}
    <div
      class="absolute border border-gray-200 text-gray-700 top-full right-0 mt-1 z-10 w-44 bg-white rounded shadow"
    >
      <div class="px-4 py-3 text-sm">
        <div class="font-medium truncate">{$user.displayName}</div>
        <div class="font-medium truncate">{$user.uniqueName}</div>
      </div>
      <hr class="mx-2 border border-gray-300" />
      <ul class="py-2 text-sm">
        <li>
          <button
            class="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            on:click={() => handlePreset()}>プリセット</button
          >
        </li>
        <li>
          <button
            class="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            on:click={() => handleUserSetting()}>プロフィール</button
          >
        </li>
        <li>
          <button
            class="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            on:click={() => handleSelect('logout')}>ログアウト</button
          >
        </li>
      </ul>
    </div>
  {/if}
</div>
