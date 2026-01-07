<script setup>
import AudioPlayer from './AudioPlayer.vue'

const props = defineProps({
  partName: {
    type: String,
    required: true
  },
  fileData: {
    type: Object,
    required: true
  },
  songTitle: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['open-youtube'])

const isAudioFile = (fileType) => {
  return ['mp3', 'wav', 'ogg', 'm4a'].includes(fileType?.toLowerCase())
}


</script>

<template>
  <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
    <h5 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
      <span 
        class="w-2 h-2 rounded-full" 
        :class="partName === '합창' ? 'bg-blue-500' : 'bg-indigo-500'"
      ></span>
      {{ partName }}
    </h5>
    
    <div class="space-y-3">
      <!-- Audio Player for audio files -->
      <div v-if="isAudioFile(fileData.fileType)" class="mt-2">
        <AudioPlayer 
          :audio-url="fileData.audioUrl"
          :title="`${songTitle} - ${partName}`"
          :is-youtube="false"
          @open-youtube="emit('open-youtube', $event)"
        />
      </div>
      
      <!-- Download button for other files -->
      <div v-else class="flex justify-center">
        <a 
          :href="fileData.audioUrl"
          :download="`${songTitle} - ${partName}.${fileData.fileType}`"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <span class="text-sm">⬇️</span>
          다운로드
        </a>
      </div>
    </div>
  </div>
</template>
