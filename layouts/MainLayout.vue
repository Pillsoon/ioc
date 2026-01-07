<script setup>
const router = useRouter()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const navigateTo = (path) => {
  router.push(path)
  isMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-40">
      <div class="flex items-center justify-between px-4 py-4 max-w-6xl mx-auto">
        <button 
          @click="toggleMenu" 
          class="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          <div class="w-6 h-6 flex flex-col justify-center space-y-1">
            <span class="block w-full h-0.5 bg-white"></span>
            <span class="block w-full h-0.5 bg-white"></span>
            <span class="block w-full h-0.5 bg-white"></span>
          </div>
        </button>
        <h1 class="text-xl font-bold">Irvine Onnuri Choir</h1>
        <div class="text-sm opacity-90 font-medium">ONNURI CHURCH IRVINE</div>
      </div>
    </header>

    <!-- Side Menu -->
    <div 
      v-if="isMenuOpen" 
      class="fixed inset-0 z-50 flex"
    >
      <div 
        class="fixed inset-0 bg-black bg-opacity-50" 
        @click="toggleMenu"
      ></div>
      <nav class="relative bg-white w-80 max-w-sm h-full shadow-xl">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Menu</h2>
          <button 
            @click="toggleMenu" 
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <span class="text-2xl text-gray-600">×</span>
          </button>
        </div>
        <ul class="py-4">
          <li>
            <button 
              @click="navigateTo('/')" 
              class="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700 text-lg"
            >
              HOME
            </button>
          </li>
          <li>
            <button 
              @click="navigateTo('/songs')" 
              class="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700 text-lg"
            >
              예배 찬양곡
            </button>
          </li>
          <li>
            <button 
              @click="navigateTo('/notices')" 
              class="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700 text-lg"
            >
              공지사항
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Main Content -->
    <main class="flex-1 pb-24 max-w-6xl mx-auto w-full px-4">
      <slot />
    </main>
  </div>
</template>