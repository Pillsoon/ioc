<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div class="p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">전체 찬양곡 목록</h2>
      <div class="space-y-3">
        <div 
          v-for="song in songs" 
          :key="song.id"
          class="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span 
                :class="{
                  'bg-blue-500': song.date !== '미정',
                  'bg-gray-400': song.date === '미정'
                }"
                class="text-white px-2 py-1 rounded text-xs font-medium"
              >
                {{ song.date }}
              </span>
              <span class="font-medium text-gray-800">{{ song.title }}</span>
              <span v-if="song.composer" class="text-sm text-gray-500">- {{ song.composer }}</span>
            </div>
          </div>
          <span v-if="song.date === '미정'" class="text-gray-400 text-sm">준비 중</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  songs: {
    type: Array,
    required: true
  }
})
</script>





