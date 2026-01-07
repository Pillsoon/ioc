<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6 hover:shadow-md transition-shadow duration-200">
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">{{ song.weekLabel }}</h2>
          <div class="flex flex-wrap items-center gap-2 mt-1">
            <span class="text-sm text-gray-500">{{ song.displayDate }}</span>
            <span v-if="song.event" class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{{ song.event }}</span>
            <span class="text-lg font-medium text-gray-800">{{ song.title }}</span>
            <span v-if="song.composer" class="text-sm text-gray-500">- {{ song.composer }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 mb-6">
        <button
          @click="handleDownloadScore"
          :disabled="!hasScoreAvailable"
          :class="hasScoreAvailable
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
          class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          <span>📄</span>
          <span>악보 다운로드</span>
        </button>
      </div>

      <!-- Practice Videos (YouTube) -->
      <div v-if="Object.keys(youtubeVideos).length > 0" class="mb-6">
        <h3 class="text-sm font-medium text-gray-700 mb-3">연습 비디오</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <a
            v-for="(item, part) in youtubeVideos"
            :key="part"
            :href="item.url"
            target="_blank"
            class="flex items-center justify-center p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-md text-sm font-medium transition-colors duration-200"
          >
            <span>{{ getPartLabel(part) }}</span>
            <span class="ml-1 text-xs">▶️</span>
          </a>
        </div>
      </div>

      <!-- Practice Files (Audio) -->
      <div v-if="Object.keys(audioFiles).length > 0" class="mb-6">
        <h3 class="text-sm font-medium text-gray-700 mb-3">연습 파일</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            v-for="(item, part) in audioFiles"
            :key="part"
            @click="handleSharePracticeFile(item, part)"
            class="flex items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium transition-colors duration-200"
          >
            <span>{{ getPartLabel(part) }}</span>
            <span class="ml-1 text-xs">🎵</span>
          </button>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="song.notes" class="text-sm text-gray-500 italic">
        {{ song.notes }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  downloadScore,
  sharePracticeFile,
  hasScore,
  getYoutubeVideos,
  getAudioFiles,
  VOICE_PART_LABELS
} from '~/utils/songsUtils.js'

const props = defineProps({
  song: {
    type: Object,
    required: true
  }
})

// Computed
const hasScoreAvailable = computed(() => hasScore(props.song))
const youtubeVideos = computed(() => getYoutubeVideos(props.song.practice))
const audioFiles = computed(() => getAudioFiles(props.song.practice))

// Methods
const getPartLabel = (part) => VOICE_PART_LABELS[part] || part

const handleDownloadScore = () => {
  downloadScore(props.song)
}

const handleSharePracticeFile = (item, part) => {
  sharePracticeFile(item, part)
}
</script>
