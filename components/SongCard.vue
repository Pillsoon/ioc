<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6 hover:shadow-md transition-shadow duration-200">
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">{{ song.weekLabel }}</h2>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-sm text-gray-500">{{ song.date }}</span>
            <span class="text-lg font-medium text-gray-800">{{ song.title }}</span>
            <span v-if="song.composer" class="text-sm text-gray-500">- {{ song.composer }}</span>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex gap-3 mb-6">
        <button 
          @click="handleDownloadScore"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          <span>📄</span>
          <span>악보 다운로드</span>
        </button>
      </div>

      <!-- Practice Videos (YouTube) -->
      <div v-if="song.practiceVideos" class="mb-6">
        <h3 class="text-sm font-medium text-gray-700 mb-3">연습 비디오</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <a 
            v-for="(url, part) in song.practiceVideos" 
            :key="part"
            :href="url" 
            target="_blank" 
            class="flex items-center justify-center p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-md text-sm font-medium transition-colors duration-200"
          >
            <span>{{ part }}</span>
            <span class="ml-1 text-xs">▶️</span>
          </a>
        </div>
      </div>

      <!-- Practice Files (Audio) -->
      <div v-if="song.practiceFiles" class="mb-6">
        <h3 class="text-sm font-medium text-gray-700 mb-3">연습 파일</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button 
            v-for="(file, part) in song.practiceFiles" 
            :key="part"
            @click="handleSharePracticeFile(file, part)"
            class="flex items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium transition-colors duration-200"
          >
            <span>{{ part }}</span>
            <span class="ml-1 text-xs">🎵</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { downloadScore, sharePracticeFile } from '~/utils/songsUtils.js'

const props = defineProps({
  song: {
    type: Object,
    required: true
  }
})

const handleDownloadScore = () => {
  downloadScore(props.song)
}

const handleSharePracticeFile = (file, part) => {
  sharePracticeFile(file, part)
}
</script>
