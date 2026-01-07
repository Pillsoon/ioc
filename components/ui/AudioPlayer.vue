<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  audioUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  isYouTube: {
    type: Boolean,
    default: false
  },
  youtubeId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const isLoading = ref(false)
const error = ref(null)

const audioElement = ref(null)
const progressBar = ref(null)

const isYouTubeLink = computed(() => {
  return props.isYouTube || props.audioUrl.includes('youtube.com') || props.audioUrl.includes('youtu.be')
})

const youtubeEmbedUrl = computed(() => {
  if (props.youtubeId) {
    return `https://www.youtube.com/embed/${props.youtubeId}?autoplay=1&rel=0`
  }
  // Extract YouTube ID from URL
  const match = props.audioUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`
  }
  // If no match found, return the original URL
  return props.audioUrl
})

const formatTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const togglePlay = () => {
  console.log('Toggle play clicked, isYouTubeLink:', isYouTubeLink.value)
  
  if (isYouTubeLink.value) {
    // For YouTube, we'll open in a modal
    return
  }
  
  if (audioElement.value) {
    console.log('Audio element found, current state:', isPlaying.value)
    if (isPlaying.value) {
      audioElement.value.pause()
      isPlaying.value = false
    } else {
      // Check if audio source is valid before playing
      if (!audioElement.value.src || audioElement.value.src === window.location.href) {
        error.value = '음원 파일을 찾을 수 없습니다. 파일 경로를 확인해주세요.'
        return
      }
      
      audioElement.value.play().catch(err => {
        console.error('Error playing audio:', err)
        error.value = '음원 재생에 실패했습니다. 파일이 손상되었거나 지원하지 않는 형식일 수 있습니다.'
      })
      isPlaying.value = true
    }
  } else {
    console.error('Audio element not found')
  }
}

const handleTimeUpdate = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
  }
}

const handleLoadedMetadata = () => {
  if (audioElement.value) {
    duration.value = audioElement.value.duration
    isLoading.value = false
    error.value = null
  }
}

const handleProgressClick = (event) => {
  if (!audioElement.value || !progressBar.value) return
  
  const rect = progressBar.value.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = percentage * duration.value
  
  audioElement.value.currentTime = newTime
  currentTime.value = newTime
}

const toggleMute = () => {
  if (audioElement.value) {
    audioElement.value.muted = !isMuted.value
    isMuted.value = !isMuted.value
  }
}

const handleVolumeChange = (event) => {
  const newVolume = parseFloat(event.target.value)
  volume.value = newVolume
  
  if (audioElement.value) {
    audioElement.value.volume = newVolume
  }
}

const downloadAudio = async () => {
  try {
    const link = document.createElement('a')
    link.href = props.audioUrl
    link.download = `${props.title}.mp3`
    link.target = '_blank'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    error.value = '음원 다운로드에 실패했습니다.'
    console.error('Download error:', err)
  }
}

const shareAudio = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: props.title,
        text: 'Choir audio from Irvine Onnuri Choir',
        url: props.audioUrl
      })
    } else {
      await navigator.clipboard.writeText(props.audioUrl)
      alert('링크가 클립보드에 복사되었습니다.')
    }
  } catch (err) {
    console.error('Share error:', err)
    try {
      await navigator.clipboard.writeText(props.audioUrl)
      alert('링크가 클립보드에 복사되었습니다.')
    } catch (clipboardErr) {
      alert('공유 기능을 사용할 수 없습니다.')
    }
  }
}

const openYouTubeModal = () => {
  // This will be handled by the parent component
  emit('open-youtube', youtubeEmbedUrl.value)
}

// Watch for URL changes
watch(() => props.audioUrl, (newUrl) => {
  if (!isYouTubeLink.value && audioElement.value && newUrl) {
    audioElement.value.src = newUrl
    error.value = null
    isLoading.value = true
  }
}, { immediate: true })

onMounted(() => {
  if (!isYouTubeLink.value && audioElement.value) {
    // Set the audio source
    audioElement.value.src = props.audioUrl
    
    audioElement.value.addEventListener('timeupdate', handleTimeUpdate)
    audioElement.value.addEventListener('loadedmetadata', handleLoadedMetadata)
    audioElement.value.addEventListener('play', () => {
      isPlaying.value = true
    })
    audioElement.value.addEventListener('pause', () => {
      isPlaying.value = false
    })
    audioElement.value.addEventListener('ended', () => {
      isPlaying.value = false
    })
    audioElement.value.addEventListener('error', (e) => {
      console.error('Audio error:', e)
      console.error('Audio src:', audioElement.value.src)
      console.error('Audio networkState:', audioElement.value.networkState)
      console.error('Audio readyState:', audioElement.value.readyState)
      error.value = '음원을 불러올 수 없습니다. 파일 경로를 확인해주세요.'
      isLoading.value = false
    })
    
    audioElement.value.addEventListener('loadstart', () => {
      isLoading.value = true
      error.value = null
    })
  }
})

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.removeEventListener('timeupdate', handleTimeUpdate)
    audioElement.value.removeEventListener('loadedmetadata', handleLoadedMetadata)
    audioElement.value.removeEventListener('play', () => {})
    audioElement.value.removeEventListener('pause', () => {})
    audioElement.value.removeEventListener('ended', () => {})
  }
})
</script>

<template>
  <div class="bg-white rounded-lg p-4 shadow-md">
    <!-- YouTube Link -->
    <div v-if="isYouTubeLink" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div class="flex items-center gap-2">
        <span class="text-lg">🎵</span>
        <span class="font-medium text-gray-700 text-sm">YouTube 음원</span>
      </div>
      <button @click="openYouTubeModal" class="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
        <span class="text-sm">▶️</span>
        보기
      </button>
    </div>

    <!-- MP3 Audio Player -->
    <div v-else class="relative">
      <audio 
        ref="audioElement"
        preload="metadata"
      ></audio>

      <!-- Player Controls -->
      <div class="flex items-center gap-3">
        <button 
          @click="togglePlay"
          class="w-8 h-8 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center text-sm transition-colors duration-200"
          :disabled="isLoading"
        >
          <span v-if="isPlaying">⏸️</span>
          <span v-else>▶️</span>
        </button>

        <div class="flex-1 flex flex-col gap-1">
          <div 
            ref="progressBar"
            class="w-full h-1.5 bg-gray-200 rounded cursor-pointer relative overflow-hidden"
            @click="handleProgressClick"
          >
            <div 
              class="h-full bg-indigo-500 rounded transition-all duration-100"
              :style="{ width: `${(currentTime / duration) * 100}%` }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <button @click="toggleMute" class="text-sm p-1 rounded hover:bg-gray-100 transition-colors duration-200">
            <span v-if="isMuted">🔇</span>
            <span v-else>🔊</span>
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            :value="volume"
            @input="handleVolumeChange"
            class="w-12 h-1 bg-gray-200 rounded outline-none cursor-pointer"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-4">
        <div class="w-6 h-6 border-3 border-gray-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2"></div>
        <p class="text-gray-600 text-sm">음원을 불러오는 중...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="text-center py-4">
        <p class="text-red-600 text-sm">{{ error }}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 mt-3">
      <button 
        v-if="!isYouTubeLink"
        @click="downloadAudio"
        class="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
      >
        <span class="text-sm">⬇️</span>
        다운로드
      </button>
      <button 
        @click="shareAudio"
        class="flex-1 flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
      >
        <span class="text-sm">📤</span>
        공유
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Custom slider styling for volume control */
.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .player-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .progress-section {
    width: 100%;
  }
  
  .volume-section {
    justify-content: center;
  }
  
  .audio-actions {
    flex-direction: column;
  }
  
  .youtube-section {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
