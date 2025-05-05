<header class="bg-white border-b border-gray-200">
  <div class="flex justify-between">
    <!-- 左側 -->
    <div class="flex min-w-0 items-center px-2 py-2">
      <slot name="left" />
    </div>

    <!-- 右側 -->
    <div class="flex items-center gap-2 px-2 py-2 relative">
      <slot name="right" />
    </div>
  </div>
</header>
