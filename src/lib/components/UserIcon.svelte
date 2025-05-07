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
      // サーバ側でCookie削除
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

<div class="relative" bind:this={dropdownRef}>
  <button on:click={toggleDropdown}>
    <CircleUser size={30} class="text-gray-500 cursor-pointer translate-y-[3px]" />
  </button>

  {#if showDropdown}
    <div class="absolute text-gray-700 top-full right-0 mt-2 z-10 w-44 bg-gray-100 rounded shadow">
      <div class="px-4 py-3 text-sm">
        <div class="font-medium truncate">{$user.name}</div>
        <div class="font-medium truncate">{$user.email}</div>
      </div>
      <hr class="mx-2 border border-gray-300" />
      <ul class="py-2 text-sm">
        <li>
          <button class="w-full text-left px-4 py-2" on:click={() => handlePreset()}
            >プリセット</button
          >
        </li>
        <li>
          <button class="w-full text-left px-4 py-2" on:click={() => handleUserSetting()}
            >プロフィール</button
          >
        </li>
        <li>
          <button class="w-full text-left px-4 py-2" on:click={() => handleSelect('logout')}
            >ログアウト</button
          >
        </li>
      </ul>
    </div>
  {/if}
</div>
