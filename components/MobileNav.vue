<template>
  <!-- Mobile Navigation -->
  <div class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
    <div class="flex items-center justify-between px-4 py-3">
      <!-- Logo/Title -->
      <div class="flex items-center gap-2">
        <span class="text-lg font-bold text-gray-900">Irvine Onnuri Choir</span>
      </div>
      
      <!-- Hamburger Button -->
      <button 
        @click="toggleMenu"
        class="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
        :class="{ 'bg-gray-100': isMenuOpen }"
      >
        <div class="w-6 h-6 flex flex-col justify-center items-center">
          <span 
            class="block w-5 h-0.5 bg-gray-700 transition-all duration-300"
            :class="{ 'rotate-45 translate-y-1': isMenuOpen }"
          ></span>
          <span 
            class="block w-5 h-0.5 bg-gray-700 mt-1 transition-all duration-300"
            :class="{ 'opacity-0': isMenuOpen }"
          ></span>
          <span 
            class="block w-5 h-0.5 bg-gray-700 mt-1 transition-all duration-300"
            :class="{ '-rotate-45 -translate-y-1': isMenuOpen }"
          ></span>
        </div>
      </button>
    </div>
    
    <!-- Mobile Menu Overlay -->
    <div 
      v-if="isMenuOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="closeMenu"
    ></div>
    
    <!-- Mobile Menu Panel -->
    <div 
      class="fixed top-16 right-0 w-64 bg-white shadow-xl border-l border-gray-200 z-50 transform transition-transform duration-300"
      :class="{ 'translate-x-0': isMenuOpen, 'translate-x-full': !isMenuOpen }"
    >
      <div class="p-4">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">메뉴</h3>
        
        <nav class="space-y-2">
          <NuxtLink 
            to="/" 
            @click="closeMenu"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200"
          >
            <span class="text-lg">🏠</span>
            <span class="font-medium text-gray-700">홈</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/choir/songs" 
            @click="closeMenu"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200"
          >
            <span class="text-lg">🎵</span>
            <span class="font-medium text-gray-700">예배 찬양곡</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/choir/notices" 
            @click="closeMenu"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200"
          >
            <span class="text-lg">📢</span>
            <span class="font-medium text-gray-700">공지사항</span>
          </NuxtLink>
        </nav>
        
        <div class="mt-6 pt-4 border-t border-gray-200">
          <div class="text-xs text-gray-500 text-center">
            Irvine Onnuri Choir
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

// Close menu when route changes
const route = useRoute()
watch(() => route.path, () => {
  closeMenu()
})
</script>
