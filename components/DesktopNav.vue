<template>
  <!-- Desktop Navigation -->
  <nav class="hidden lg:block bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-12">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <span class="text-base font-bold text-gray-900">Irvine Onnuri Choir</span>
        </div>
        
        <!-- Navigation Links -->
        <div class="flex items-center space-x-6">
          <NuxtLink 
            to="/" 
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
            :class="{
              'bg-gray-100 text-gray-900': $route.path === '/',
              'text-gray-600 hover:text-gray-900 hover:bg-gray-50': $route.path !== '/'
            }"
          >
            <span>🏠</span>
            <span>홈</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/choir/songs" 
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
            :class="{
              'bg-gray-100 text-gray-900': $route.path === '/choir/songs',
              'text-gray-600 hover:text-gray-900 hover:bg-gray-50': $route.path !== '/choir/songs'
            }"
          >
            <span>예배 찬양곡</span>
          </NuxtLink>
          
          <NuxtLink
            to="/choir/notices"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
            :class="{
              'bg-gray-100 text-gray-900': $route.path === '/choir/notices',
              'text-gray-600 hover:text-gray-900 hover:bg-gray-50': $route.path !== '/choir/notices'
            }"
          >
            <span>📢</span>
            <span>공지사항</span>
          </NuxtLink>

          <NuxtLink
            to="/choir/meals"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
            :class="{
              'bg-gray-100 text-gray-900': $route.path === '/choir/meals',
              'text-gray-600 hover:text-gray-900 hover:bg-gray-50': $route.path !== '/choir/meals'
            }"
          >
            <span>🍽️</span>
            <span>식사</span>
          </NuxtLink>
      </div>
    </div>
    </div>
  </nav>
</template>

<script setup>
// No additional logic needed - reactive classes handle active states
</script>
