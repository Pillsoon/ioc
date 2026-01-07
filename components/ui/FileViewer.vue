<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    default: 'pdf'
  },
  showPreview: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const isPreviewOpen = ref(false)
const isLoading = ref(false)
const error = ref(null)

const isPDF = computed(() => props.fileType.toLowerCase() === 'pdf')
const isAudio = computed(() => ['mp3', 'wav', 'ogg', 'm4a'].includes(props.fileType.toLowerCase()))
const isVideo = computed(() => ['mp4', 'webm', 'mov'].includes(props.fileType.toLowerCase()))

const openPreview = () => {
  isPreviewOpen.value = true
  isLoading.value = true
  error.value = null
}

const closePreview = () => {
  isPreviewOpen.value = false
  emit('close')
}

const downloadFile = async () => {
  try {
    isLoading.value = true
    
    // Create a temporary link element
    const link = document.createElement('a')
    link.href = props.fileUrl
    link.download = props.fileName
    link.target = '_blank'
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
  } catch (err) {
    error.value = '파일 다운로드에 실패했습니다.'
    console.error('Download error:', err)
  } finally {
    isLoading.value = false
  }
}

const shareFile = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: props.fileName,
        text: 'Choir score from Irvine Onnuri Choir',
        url: props.fileUrl
      })
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(props.fileUrl)
      alert('링크가 클립보드에 복사되었습니다.')
    }
  } catch (err) {
    console.error('Share error:', err)
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(props.fileUrl)
      alert('링크가 클립보드에 복사되었습니다.')
    } catch (clipboardErr) {
      alert('공유 기능을 사용할 수 없습니다.')
    }
  }
}

const handlePreviewLoad = () => {
  isLoading.value = false
}

const handlePreviewError = () => {
  isLoading.value = false
  error.value = '파일을 불러올 수 없습니다.'
}
</script>

<template>
  <div class="flex gap-2 flex-nowrap">
    <!-- Preview Button -->
    <button 
      v-if="showPreview && isPDF"
      @click="openPreview"
      class="flex items-center gap-1.5 px-3 py-2 border-0 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 bg-cyan-500 hover:bg-cyan-600 text-white disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
      :disabled="isLoading"
    >
      <span class="text-sm">👁️</span>
      보기
    </button>

    <!-- Download Button -->
    <button 
      @click="downloadFile"
      class="flex items-center gap-1.5 px-3 py-2 border-0 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 bg-green-600 hover:bg-green-700 text-white disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
      :disabled="isLoading"
    >
      <span class="text-sm">⬇️</span>
      다운
    </button>

    <!-- Share Button -->
    <button 
      @click="shareFile"
      class="flex items-center gap-1.5 px-3 py-2 border-0 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
      :disabled="isLoading"
    >
      <span class="text-sm">📤</span>
      공유
    </button>

    <!-- PDF Preview Modal -->
    <div v-if="isPreviewOpen && isPDF" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-70" @click="closePreview"></div>
      <div class="relative bg-white rounded-2xl w-11/12 max-w-4xl h-4/5 max-h-96 flex flex-col overflow-hidden shadow-2xl">
        <div class="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg font-semibold text-gray-800">{{ fileName }}</h3>
          <button @click="closePreview" class="text-2xl text-gray-600 hover:bg-gray-200 p-1 rounded transition-colors duration-200">×</button>
        </div>
        
        <div class="flex-1 relative overflow-hidden">
          <div v-if="isLoading" class="flex flex-col items-center justify-center h-full p-8">
            <div class="w-10 h-10 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p class="text-gray-600">PDF를 불러오는 중...</p>
          </div>
          
          <div v-else-if="error" class="flex flex-col items-center justify-center h-full p-8">
            <p class="text-red-600 mb-4">{{ error }}</p>
            <button @click="openPreview" class="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">다시 시도</button>
          </div>
          
          <iframe
            v-else
            :src="`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`"
            class="w-full h-full border-0"
            @load="handlePreviewLoad"
            @error="handlePreviewError"
            frameborder="0"
          ></iframe>
        </div>
        
        <div class="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button @click="downloadFile" class="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200">
            <span class="text-base">⬇️</span>
            다운로드
          </button>
          <button @click="shareFile" class="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200">
            <span class="text-base">📤</span>
            공유
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Responsive Design */
@media (max-width: 768px) {
  .file-viewer {
    gap: 0.25rem;
  }
  
  .preview-btn,
  .download-btn,
  .share-btn {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
    min-width: auto;
    flex: 1;
  }
  
  .preview-icon,
  .download-icon,
  .share-icon {
    font-size: 0.875rem;
  }
  
  .preview-content {
    width: 95%;
    height: 90%;
  }
  
  .preview-header {
    padding: 0.75rem 1rem;
  }
  
  .preview-actions {
    padding: 0.75rem 1rem;
  }
  
  .action-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
