<header class="bg-white border-b border-gray-200">
  <div class="flex justify-between">
    <!-- 左側 -->
    <div class="min-w-0">
      <div class="mx-auto px-2 py-2">
        <a href="/">
          <img src="/title_logo.svg" alt="" class="h-[35px]" />
        </a>
      </div>
    </div>

    <!-- 右側 -->
    <div class="flex items-center gap-2 px-2 py-2 relative">
      <slot name="right" />
    </div>
  </div>
</header>
